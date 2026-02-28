import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import SignatureCanvas from 'react-signature-canvas'
import { Save, Eraser, Zap } from 'lucide-react'
import { useOSStore } from '../store/osStore'

interface OSFormProps {
    onSuccess: () => void
}

export const OSForm = ({ onSuccess }: OSFormProps) => {
    const addOrdem = useOSStore(state => state.addOrdem)
    const [executor, setExecutor] = useState('')
    const [condominio, setCondominio] = useState('')

    const padRef = useRef<SignatureCanvas>(null)

    const handleClearPad = () => {
        padRef.current?.clear()
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (padRef.current?.isEmpty()) {
            alert("Por favor, preencha a assinatura antes de salvar a OS.")
            return
        }

        // Ideally signature should be saved too, but we will store what we have in the state.
        addOrdem({
            executor,
            condominio,
        })

        // NOTE: we will need a way to pass the signature data to the PDF component.
        // For now, we are completing the form. We might store it in localStorage or pass through a callback.
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

                    <div className="space-y-3 pt-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-secondary-text uppercase tracking-widest">
                                Assinatura
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
