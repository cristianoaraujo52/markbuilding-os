import { create } from 'zustand'

export interface OrdemServico {
    id: string
    executor: string
    condominio: string
    prioridade: 'Low' | 'Medium' | 'High'
    equipamento?: string
    descricaoTecnica: string
    fotos: string[]
    status: 'Concluida'
    dataCriacao: string
}

interface OSStore {
    ordens: OrdemServico[]
    addOrdem: (os: Omit<OrdemServico, 'id' | 'dataCriacao' | 'status'>) => void
}

export const useOSStore = create<OSStore>((set) => ({
    ordens: [],
    addOrdem: (osData) =>
        set((state) => ({
            ordens: [
                ...state.ordens,
                {
                    ...osData,
                    id: crypto.randomUUID(),
                    status: 'Concluida',
                    dataCriacao: new Date().toISOString(),
                }
            ]
        }))
}))
