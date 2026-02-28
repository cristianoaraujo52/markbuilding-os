import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SignatureCanvas from 'react-signature-canvas'
import { Save, Eraser, Zap, Camera, Trash2, ArrowUp, ArrowDown, Minus, QrCode } from 'lucide-react'
import { useOSStore } from '../store/osStore'

interface OSFormProps {
    onSuccess: () => void
}

type Priority = 'Low' | 'Medium' | 'High';

export const OSForm = ({ onSuccess }: OSFormProps) => {
    const addOrdem = useOSStore(state => state.addOrdem)
    const [executor, setExecutor] = useState('')
    const [condominio, setCondominio] = useState('')
    const [prioridade, setPrioridade] = useState<Priority>('Medium')
    const [equipamento, setEquipamento] = useState('')
    const [descricaoTecnica, setDescricaoTecnica] = useState('')
    const [fotos, setFotos] = useState<string[]>([])

    const padRef = useRef<SignatureCanvas>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleClearPad = () => {
        padRef.current?.clear()
    }

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        Array.from(files).forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                const img = new Image()
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    const MAX_WIDTH = 400
                    const MAX_HEIGHT = 400
                    let width = img.width
                    let height = img.height

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width
                            width = MAX_WIDTH
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height
                            height = MAX_HEIGHT
                        }
                    }

                    canvas.width = width
                    canvas.height = height
                    const ctx = canvas.getContext('2d')
                    ctx?.drawImage(img, 0, 0, width, height)

                    // Compress to PNG for compatibility (Note: PNG compression ignores quality parameter)
                    const base64String = canvas.toDataURL('image/png')
                    setFotos(prev => [...prev, base64String])
                }
                img.src = reader.result as string
            }
            reader.readAsDataURL(file)
        })
    }

    const removePhoto = (index: number) => {
        setFotos(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (padRef.current?.isEmpty()) {
            alert("Por favor, preencha a assinatura antes de salvar a OS.")
            return
        }

        addOrdem({
            executor,
            condominio,
            prioridade,
            equipamento,
            descricaoTecnica,
            fotos
        })

        if (padRef.current) {
            const sigData = padRef.current.getTrimmedCanvas().toDataURL('image/png')
            localStorage.setItem('currentSignature', sigData)
        }

        onSuccess()
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl mx-auto"
        >
            <div className="glass-panel p-6 sm:p-8 relative overflow-hidden group">
                {/* Decorative neon accents */}
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary-neon/20 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover:bg-primary-neon/30"></div>
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-accent-pink/10 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover:bg-accent-pink/20"></div>

                <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-5 relative z-10">
                    <div className="p-3 bg-surface-darker rounded-xl border border-white/10 shadow-[0_0_15px_rgba(0,122,255,0.15)] pt-2 pb-2 pl-3 pr-3 flex items-center justify-center">
                        <Zap className="text-primary-neon" size={24} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-secondary-text tracking-tight uppercase">
                        Nova O.S.
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="space-y-6">

                        {/* Priority Selection */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-secondary-text uppercase tracking-widest">
                                Nível de Prioridade
                            </label>
                            <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2">
                                <button type="button" onClick={() => setPrioridade('Low')} className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-all shadow-sm ${prioridade === 'Low' ? 'bg-surface-dark border border-neon-green/50 ring-2 ring-transparent shadow-[0_0_10px_rgba(57,255,20,0.3)]' : 'bg-surface-dark/50 border border-transparent'}`}>
                                    <ArrowDown size={18} className={prioridade === 'Low' ? 'text-neon-green drop-shadow-[0_0_2px_rgba(57,255,20,0.8)]' : 'text-gray-500'} />
                                    <p className={`text-sm font-bold tracking-wide ${prioridade === 'Low' ? 'text-neon-green' : 'text-gray-500'}`}>Baixa</p>
                                </button>
                                <button type="button" onClick={() => setPrioridade('Medium')} className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-all shadow-sm ${prioridade === 'Medium' ? 'bg-surface-dark border border-neon-yellow/50 ring-2 ring-transparent shadow-[0_0_10px_rgba(255,240,31,0.3)]' : 'bg-surface-dark/50 border border-transparent'}`}>
                                    <Minus size={18} className={prioridade === 'Medium' ? 'text-neon-yellow drop-shadow-[0_0_2px_rgba(255,240,31,0.8)]' : 'text-gray-500'} />
                                    <p className={`text-sm font-bold tracking-wide ${prioridade === 'Medium' ? 'text-neon-yellow' : 'text-gray-500'}`}>Média</p>
                                </button>
                                <button type="button" onClick={() => setPrioridade('High')} className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-all shadow-[0_0_15px_rgba(255,7,58,0.3)] ${prioridade === 'High' ? 'bg-neon-red/10 border border-neon-red' : 'bg-surface-dark/50 border border-transparent shadow-none'}`}>
                                    <ArrowUp size={18} className={prioridade === 'High' ? 'text-neon-red drop-shadow-[0_0_2px_rgba(255,7,58,0.8)]' : 'text-gray-500'} />
                                    <p className={`text-sm font-black tracking-wide ${prioridade === 'High' ? 'text-neon-red' : 'text-gray-500'}`}>Alta</p>
                                </button>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div className="space-y-2 group/input">
                                <label className="text-xs font-bold text-secondary-text uppercase tracking-widest group-focus-within/input:text-primary-neon transition-colors">
                                    Executor
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={executor}
                                    onChange={(e) => setExecutor(e.target.value)}
                                    className="w-full bg-surface-darker/80 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:border-primary-neon focus:ring-1 focus:ring-primary-neon transition-all outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                                    placeholder="Nome do Executor..."
                                />
                            </div>

                            <div className="space-y-2 group/input">
                                <label className="text-xs font-bold text-secondary-text uppercase tracking-widest group-focus-within/input:text-accent-pink transition-colors">
                                    Condomínio
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={condominio}
                                    onChange={(e) => setCondominio(e.target.value)}
                                    className="w-full bg-surface-darker/80 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:border-accent-pink focus:ring-1 focus:ring-accent-pink transition-all outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                                    placeholder="Nome do Condomínio..."
                                />
                            </div>
                        </div>

                        {/* Asset Identity */}
                        <div className="relative overflow-hidden rounded-xl bg-surface-dark border border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 group">
                            <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none hidden sm:block">
                                <QrCode size={60} className="text-white" />
                            </div>
                            <div className="flex items-center gap-4 w-full z-10 flex-1">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white border border-white/10">
                                    <QrCode size={24} />
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <h3 className="text-sm font-extrabold text-white tracking-tight truncate">Equipamento / Ativo</h3>
                                    <input
                                        type="text"
                                        value={equipamento}
                                        onChange={(e) => setEquipamento(e.target.value)}
                                        placeholder="Ex: AR-COND-12"
                                        className="bg-transparent border-none text-sm text-neon-green placeholder-gray-500 focus:ring-0 p-0 mt-1 outline-none font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Technical Description */}
                        <div className="space-y-2 group/input">
                            <label className="text-xs font-bold text-secondary-text uppercase tracking-widest group-focus-within/input:text-primary-neon transition-colors">
                                Descrição Técnica
                            </label>
                            <textarea
                                required
                                value={descricaoTecnica}
                                onChange={(e) => setDescricaoTecnica(e.target.value)}
                                className="w-full resize-none bg-surface-darker/80 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:border-primary-neon focus:ring-1 focus:ring-primary-neon min-h-[120px] transition-all outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                                placeholder="Descreva os serviços realizados, peças trocadas..."
                            />
                        </div>

                        {/* Photos Upload */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-secondary-text uppercase tracking-widest">
                                    Fotos do Serviço
                                </label>
                                <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded font-mono">{fotos.length}</span>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                <AnimatePresence>
                                    {fotos.map((photo, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="relative aspect-square rounded-xl border border-white/20 overflow-hidden group/photo"
                                        >
                                            <img src={photo} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(index)}
                                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="text-neon-red" size={24} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square flex flex-col items-center justify-center gap-2 rounded-xl bg-surface-dark border-2 border-dashed border-white/20 hover:border-primary-neon/50 hover:bg-white/5 transition-all text-gray-500 hover:text-primary-neon active:scale-95"
                                >
                                    <Camera size={28} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Adicionar</span>
                                </button>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handlePhotoUpload}
                                />
                            </div>
                        </div>

                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/10 mt-6 pb-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-secondary-text uppercase tracking-widest">
                                Assinatura do Executor
                            </label>
                            <button
                                type="button"
                                onClick={handleClearPad}
                                className="text-[10px] uppercase tracking-wider font-bold text-primary-neon bg-primary-neon/10 hover:bg-primary-neon/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-primary-neon/20"
                            >
                                <Eraser size={14} /> Refazer
                            </button>
                        </div>
                        <div className="bg-[#e2e8f0] rounded-xl overflow-hidden border-2 border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                            <SignatureCanvas
                                ref={padRef}
                                penColor="#0f172a"
                                canvasProps={{ className: 'w-full h-40 sm:h-48 cursor-crosshair' }}
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            className="relative w-full overflow-hidden group/btn bg-surface-darker border border-primary-neon/30 text-white font-bold tracking-widest uppercase py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all hover:border-primary-neon hover:shadow-[0_0_20px_rgba(0,122,255,0.3)] transform hover:-translate-y-0.5"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-neon/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            <Save size={20} className="text-primary-neon" />
                            <span className="relative z-10">Finalizar Ordem</span>
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    )
}
