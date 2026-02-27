import { motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Clock, ServerCrash } from 'lucide-react'
import { useOSStore } from '../store/osStore'

export const DashboardKPIs = () => {
    const ordens = useOSStore((state) => state.ordens)

    const concluidas = ordens.filter(os => os.status === 'Concluida').length
    const pendentes = ordens.filter(os => os.status === 'Pendente').length
    const emAndamento = ordens.filter(os => os.status === 'Em Andamento').length
    const criticas = ordens.filter(os => os.criticidade === 'Critica').length

    const kpis = [
        { title: 'Concluídas', value: concluidas, icon: CheckCircle2, color: 'text-brand-500', bg: 'bg-brand-500/10' },
        { title: 'Em Andamento', value: emAndamento, icon: Clock, color: 'text-low', bg: 'bg-low/10' },
        { title: 'Pendentes', value: pendentes, icon: AlertTriangle, color: 'text-medium', bg: 'bg-medium/10' },
        { title: 'Críticas', value: criticas, icon: ServerCrash, color: 'text-critical', bg: 'bg-critical/10' },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl mx-auto my-6">
            {kpis.map((kpi, index) => (
                <motion.div
                    key={kpi.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel p-4 flex flex-col items-center justify-center text-center gap-2 group hover:border-slate-500/50 transition-colors"
                >
                    <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color} mb-2`}>
                        <kpi.icon size={28} />
                    </div>
                    <span className="text-3xl font-bold">{kpi.value}</span>
                    <span className="text-sm text-slate-400 font-medium uppercase tracking-wider">{kpi.title}</span>
                </motion.div>
            ))}
        </div>
    )
}
