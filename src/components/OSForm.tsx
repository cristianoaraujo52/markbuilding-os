import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import SignatureCanvas from 'react-signature-canvas'
import { Save, Eraser, PenTool } from 'lucide-react'
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

        addOrdem({
            executor,
            condominio,
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Nome do Executor</label>
                        <input
                            type="text"
                            required
                            value={executor}
                            onChange={(e) => setExecutor(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                            placeholder="Ex: João da Silva"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Condomínio / Prédio</label>
                        <input
                            type="text"
                            required
                            value={condominio}
                            onChange={(e) => setCondominio(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                            placeholder="Ex: Condomínio Residencial Marques"
                        />
                    </div>
                </div>

                <div className="space-y-2 pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-300">Assinatura do Executor</label>
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
