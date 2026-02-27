import { create } from 'zustand'

export type Criticidade = 'Baixa' | 'Media' | 'Alta' | 'Critica'

export interface OrdemServico {
    id: string
    condominio: string
    titulo: string
    descricao: string
    criticidade: Criticidade
    status: 'Pendente' | 'Em Andamento' | 'Concluida'
    dataCriacao: string
    dataConclusao?: string
}

interface OSStore {
    ordens: OrdemServico[]
    addOrdem: (os: Omit<OrdemServico, 'id' | 'dataCriacao'>) => void
    updateStatus: (id: string, status: OrdemServico['status']) => void
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
                    dataCriacao: new Date().toISOString(),
                }
            ]
        })),
    updateStatus: (id, status) =>
        set((state) => ({
            ordens: state.ordens.map((os) =>
                os.id === id
                    ? { ...os, status, ...(status === 'Concluida' ? { dataConclusao: new Date().toISOString() } : {}) }
                    : os
            )
        }))
}))
