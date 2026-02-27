import { useState, useEffect } from 'react'
import { DashboardKPIs } from './components/DashboardKPIs'
import { OSTimeline } from './components/OSTimeline'
import { OSForm } from './components/OSForm'
import { OSPdfPreview } from './components/OSPdfPreview'
import { useOSStore, type OrdemServico } from './store/osStore'

function App() {
  const [isGestao, setIsGestao] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [previewOS, setPreviewOS] = useState<OrdemServico | null>(null)
  const { ordens, addOrdem } = useOSStore()

  // Injetar Mock Data para Demonstração Visual apenas 1 vez
  useEffect(() => {
    if (!isLoaded) {
      addOrdem({
        titulo: 'Manutenção Ar-condicionado Sala 402',
        condominio: 'Edifício Mark Center',
        descricao: 'Limpeza de filtros e troca de gás refrigente da evaporadora.',
        criticidade: 'Media',
        status: 'Concluida'
      })
      addOrdem({
        titulo: 'Vazamento Infiltração Teto Recepção',
        condominio: 'Condomínio Águas Claras',
        descricao: 'Identificar vazamento na tubulação do 1º andar afetando o gesso.',
        criticidade: 'Critica',
        status: 'Em Andamento'
      })
      addOrdem({
        titulo: 'Substituição Lâmpadas Garagem',
        condominio: 'Residencial Boulevard',
        descricao: 'Trocar lâmpadas queimadas nos setores B e C do subsolo.',
        criticidade: 'Baixa',
        status: 'Pendente'
      })
      setIsLoaded(true)
    }
  }, [isLoaded, addOrdem])

  const handleOSCreated = () => {
    // Pega a última inserida (no topo do store)
    const ultima = ordens[ordens.length - 1]
    if (ultima) {
      setPreviewOS(ultima)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header translúcido */}
      <header className="sticky top-0 z-50 glass px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-brand-500/20">
            MB
          </div>
          <h1 className="text-xl font-bold tracking-wide">MARK BUILDING</h1>
        </div>

        <button
          onClick={() => setIsGestao(!isGestao)}
          className="glass-panel px-4 py-2 text-sm font-medium hover:bg-slate-700/50 transition-colors"
        >
          {isGestao ? '⚙️ Modo: Gestão' : '🛠 Modo: Técnico'}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 flex flex-col items-center">
        {isGestao ? (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-full max-w-5xl mb-2">
              <h2 className="text-2xl font-bold text-slate-100">Visão Geral Executiva</h2>
              <p className="text-slate-400">Acompanhamento em tempo real</p>
            </div>
            <DashboardKPIs />
            <OSTimeline />
          </div>
        ) : (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <OSForm onSuccess={handleOSCreated} />
          </div>
        )}
      </main>

      {/* Modal / PDF Preview */}
      {previewOS && (
        <OSPdfPreview os={previewOS} onClose={() => setPreviewOS(null)} />
      )}
    </div>
  )
}

export default App
