import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import SignatureCanvas from 'react-signature-canvas'
import { Save, Eraser, PenTool } from 'lucide-react'
import { useOSStore, type Criticidade } from '../store/osStore'

interface OSFormProps {
    onSuccess: () => void
}

export const OSForm = ({ onSuccess }: OSFormProps) => {
    const addOrdem = useOSStore(state => state.addOrdem)
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [criticidade, setCriticidade] = useState<Criticidade>('Media')

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

        addOrdem({
            titulo,
            descricao,
            criticidade,
            status: 'Pendente',
            // Aqui seria integrado com html2pdf e envio para Google Drive
        })

        onSuccess()
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 sm:p-8 w-full max-w-2xl mx-auto"
        >
            <div className="flex items-center gap-3 mb-6 border-b border-slate-700/50 pb-4">
                <PenTool className="text-brand-500" size={28} />
                <h2 className="text-2xl font-bold">Nova Ordem de Serviço</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Título / Serviço</label>
                    <input
                        type="text"
                        required
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        placeholder="Ex: Troca de disjuntor"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Descrição Detalhada</label>
                    <textarea
                        required
                        rows={3}
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        placeholder="Descreva o que foi encontrado e executado..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Nível de Criticidade</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {(['Baixa', 'Media', 'Alta', 'Critica'] as Criticidade[]).map((level) => (
                            <button
                                key={level}
                                type="button"
                                onClick={() => setCriticidade(level)}
                                className={`py-2 px-3 rounded-lg border transition-all text-sm font-semibold
                  ${criticidade === level
                                        ? 'border-brand-500 bg-brand-500/20 text-brand-300 scale-[1.02]'
                                        : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2 pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-300">Assinatura do Técnico/Cliente</label>
                        <button type="button" onClick={handleClearPad} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
                            <Eraser size={14} /> Limpar
                        </button>
                    </div>
                    <div className="bg-white rounded-lg overflow-hidden border-2 border-slate-600">
                        <SignatureCanvas
                            ref={padRef}
                            penColor="black"
                            canvasProps={{ className: 'w-full h-40' }}
                        />
                    </div>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-brand-500/20"
                    >
                        <Save size={20} /> Salvar OS e Gerar Documento
                    </button>
                </div>
            </form>
        </motion.div>
    )
}
