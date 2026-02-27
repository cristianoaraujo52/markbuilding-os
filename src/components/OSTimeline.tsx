import { motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Clock, Calendar, ArrowRight } from 'lucide-react'
import { useOSStore } from '../store/osStore'

const getCriticidadeStyle = (criticidade: string) => {
    switch (criticidade) {
        case 'Critica': return 'text-critical bg-critical/10 border-critical/30'
        case 'Alta': return 'text-high bg-high/10 border-high/30'
        case 'Media': return 'text-medium bg-medium/10 border-medium/30'
        case 'Baixa': return 'text-low bg-low/10 border-low/30'
        default: return 'text-slate-400 bg-slate-800'
    }
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'Concluida': return <CheckCircle2 className="text-brand-500" size={20} />
        case 'Em Andamento': return <Clock className="text-low" size={20} />
        default: return <AlertTriangle className="text-medium" size={20} />
    }
}

export const OSTimeline = () => {
    const ordens = useOSStore((state) => state.ordens)

    if (ordens.length === 0) {
        return (
            <div className="glass-panel p-8 text-center mt-6 max-w-5xl mx-auto">
                <h3 className="text-xl font-medium text-slate-300">Nenhuma Ordem de Serviço encontrada.</h3>
                <p className="text-slate-500 mt-2">Mude para o Perfil Técnico em Campo para criar uma nova OS.</p>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto mt-8 w-full">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Calendar size={24} className="text-brand-500" /> Histórico de OS
            </h3>
            <div className="relative border-l-2 border-slate-700/50 ml-4 pl-6 space-y-8">
                {ordens.map((os, idx) => (
                    <motion.div
                        key={os.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.15 }}
                        className="relative"
                    >
                        {/* Indicador na linha */}
                        <span className="absolute -left-[35px] top-4 p-1 rounded-full bg-slate-900 border-2 border-slate-700">
                            {getStatusIcon(os.status)}
                        </span>

                        <div className="glass-panel p-5 group hover:border-brand-500/50 transition-colors">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                                <div>
                                    <h4 className="text-lg font-semibold">{os.titulo}</h4>
                                    <p className="text-brand-300 font-medium text-sm mt-1">{os.condominio}</p>
                                    <p className="text-slate-400 text-sm mt-2">{os.descricao}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCriticidadeStyle(os.criticidade)}`}>
                                        {os.criticidade}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {new Date(os.dataCriacao).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                            </div>

                            {os.status !== 'Concluida' && (
                                <div className="flex items-center gap-2 text-sm text-brand-400 font-medium cursor-pointer hover:text-brand-300 transition-colors mt-4">
                                    Abrir Relatório <ArrowRight size={16} />
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
