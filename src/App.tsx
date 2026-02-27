import { useState } from 'react'
import { OSForm } from './components/OSForm'
import { OSPdfPreview } from './components/OSPdfPreview'
import { useOSStore, type OrdemServico } from './store/osStore'

function App() {
  const [previewOS, setPreviewOS] = useState<OrdemServico | null>(null)
  const { ordens } = useOSStore()

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
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 flex flex-col items-center">
        <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <OSForm onSuccess={handleOSCreated} />
        </div>
      </main>

      {/* Modal / PDF Preview */}
      {previewOS && (
        <OSPdfPreview os={previewOS} onClose={() => setPreviewOS(null)} />
      )}
    </div>
  )
}

export default App
