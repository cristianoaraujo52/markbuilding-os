import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Download, CheckCircle, CloudUpload } from 'lucide-react'
import { type OrdemServico } from '../store/osStore'

interface OSPdfPreviewProps {
    os: OrdemServico
    onClose: () => void
}

export const OSPdfPreview = ({ os, onClose }: OSPdfPreviewProps) => {
    const printRef = useRef<HTMLDivElement>(null)
    const [signatureImg, setSignatureImg] = useState<string | null>(null)

    useEffect(() => {
        const sig = localStorage.getItem('currentSignature')
        if (sig) {
            setSignatureImg(sig)
        }
    }, [])

    const handleDownloadPdf = async () => {
        if (!printRef.current) return

        const element = printRef.current
        const canvas = await html2canvas(element, { scale: 2 })
        const data = canvas.toDataURL('image/png')

        const pdf = new jsPDF('p', 'mm', 'a4')
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width

        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight)
        pdf.save(`OS-${os.id.substring(0, 8)}.pdf`)
    }

    const [isUploading, setIsUploading] = useState(false)

    // Envio Real via Webhook Google Drive
    const handleUploadDrive = async () => {
        if (!printRef.current) return

        setIsUploading(true)
        try {
            const element = printRef.current
            const canvas = await html2canvas(element, { scale: 2 })
            const imgData = canvas.toDataURL('image/png')

            const pdf = new jsPDF('p', 'mm', 'a4')
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
            const pdfBase64 = pdf.output('datauristring')

            const payload = {
                id: os.id,
                executor: os.executor,
                condominio: os.condominio,
                prioridade: os.prioridade,
                equipamento: os.equipamento,
                descricaoTecnica: os.descricaoTecnica,
                dataCriacao: os.dataCriacao,
                pdfBase64: pdfBase64,
                fotos: os.fotos
            }

            const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwjhKc3a6MfWbD5UA2Df2iW1DVgjXONKtUyFb1hWA1RfL3sWpu0IuBez-ZMtqBUBAGq/exec"

            await fetch(WEBHOOK_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain",
                },
                body: JSON.stringify(payload)
            })

            alert("🚀 OS enviada e sincronizada no Drive com sucesso!")
            onClose()
        } catch (error) {
            console.error("Erro no upload", error)
            alert("Erro ao tentar sincronizar no Google Drive.")
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-background-dark/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
            <div className="bg-surface-darker rounded-2xl max-w-2xl w-full border border-white/10 shadow-[0_0_30px_rgba(0,122,255,0.2)] overflow-hidden mt-10 md:mt-0">

                {/* Toolbar Superior */}
                <div className="bg-surface-dark px-6 py-4 flex justify-between items-center border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="text-neon-green" size={24} />
                        <span className="font-bold text-lg text-white uppercase tracking-wider">OS Emitida</span>
                    </div>
                    <button onClick={onClose} className="text-secondary-text hover:text-white font-medium px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-md transition-colors border border-white/10 uppercase text-sm tracking-wide">
                        Fechar
                    </button>
                </div>

                {/* Visualização da Página A4 (Container com scroll) */}
                <div className="p-6 overflow-x-auto bg-surface-darker/50 flex justify-center">
                    {/* O REF abaixo aponta para o container branco que simboliza o papel. Tudo aqui dentro vai pro PDF */}
                    <div ref={printRef} className="bg-white text-slate-900 p-8 w-[210mm] min-h-[297mm] shadow-md flex flex-col relative shrink-0">

                        <div className="absolute top-8 right-8">
                            <QRCodeSVG value={`https://markbuilding.com/os/${os.id}`} size={80} />
                        </div>

                        <div className="border-b-4 border-slate-800 pb-4 mb-6">
                            <h1 className="text-4xl font-black tracking-tighter">MARK BUILDING</h1>
                            <p className="text-lg font-semibold text-slate-500 mt-1">ORDEM DE SERVIÇO TÉCNICA</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm border border-slate-300 p-4 rounded-md bg-slate-50">
                            <div><span className="font-bold text-slate-500">CONDOMÍNIO / LOCAL:</span> <br /> {os.condominio}</div>
                            <div><span className="font-bold text-slate-500">NOME DO EXECUTOR:</span> <br /> {os.executor}</div>
                            <div><span className="font-bold text-slate-500">ID DA OS:</span> <br /> {os.id.toUpperCase()}</div>
                            <div><span className="font-bold text-slate-500">DATA:</span> <br /> {new Date(os.dataCriacao).toLocaleString('pt-BR')}</div>
                            <div>
                                <span className="font-bold text-slate-500">PRIORIDADE:</span> <br />
                                <span className={`inline-block px-2 py-0.5 mt-1 rounded text-xs font-bold uppercase ${os.prioridade === 'High' ? 'bg-red-100 text-red-700' :
                                    os.prioridade === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                    {os.prioridade}
                                </span>
                            </div>
                            <div><span className="font-bold text-slate-500">EQUIPAMENTO/ATIVO:</span> <br /> {os.equipamento || 'N/A'}</div>
                        </div>

                        <div className="mb-8 text-sm">
                            <h3 className="font-bold text-slate-500 border-b-2 border-slate-300 pb-1 mb-2">DESCRIÇÃO TÉCNICA</h3>
                            <div className="min-h-[100px] border border-slate-300 p-4 rounded-md bg-white whitespace-pre-wrap">
                                {os.descricaoTecnica}
                            </div>
                        </div>

                        {os.fotos && os.fotos.length > 0 && (
                            <div className="mb-8">
                                <h3 className="font-bold text-slate-500 border-b-2 border-slate-300 pb-1 mb-4 text-sm">REGISTRO FOTOGRÁFICO</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {os.fotos.map((foto, index) => (
                                        <div key={index} className="aspect-square bg-slate-100 rounded border border-slate-300 overflow-hidden flex items-center justify-center">
                                            <img src={foto} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pad de Assinatura */}
                        <div className="mt-auto pt-8 border-t-2 border-slate-300 grid grid-cols-2 gap-8 text-center text-sm">
                            <div>
                                <div className="h-20 border-b border-slate-400 mb-2 flex items-end justify-center pb-1">
                                    {signatureImg ? (
                                        <img src={signatureImg} alt="Assinatura" className="max-h-20 object-contain" />
                                    ) : (
                                        <span className="italic text-slate-300">Não assinado</span>
                                    )}
                                </div>
                                <p className="font-bold">ASSINATURA DO EXECUTOR</p>
                            </div>
                            <div>
                                <div className="h-20 border-b border-slate-400 mb-2"></div>
                                <p className="font-bold">ASSINATURA DO RESPONSÁVEL</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toolbar Inferior - Ações */}
                <div className="p-4 bg-surface-dark flex justify-end gap-3 flex-wrap border-t border-white/10">
                    <button
                        onClick={handleDownloadPdf}
                        className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-surface-darker border border-secondary-text/30 hover:border-white/50 text-white px-5 py-3 rounded-xl font-bold tracking-widest uppercase transition-colors"
                    >
                        <Download size={20} /> PDF
                    </button>

                    <button
                        disabled={isUploading}
                        onClick={handleUploadDrive}
                        className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-gradient-to-r from-primary-neon to-primary-dark text-white px-5 py-3 rounded-xl font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(0,122,255,0.4)] hover:shadow-[0_0_25px_rgba(0,122,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CloudUpload size={20} /> {isUploading ? 'Sincronizando...' : 'Google Drive'}
                    </button>
                </div>

            </div>
        </motion.div>
    )
}
