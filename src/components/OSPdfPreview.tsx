import { useRef, useState } from 'react'
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
                titulo: os.titulo,
                condominio: os.condominio,
                criticidade: os.criticidade,
                status: os.status,
                dataCriacao: os.dataCriacao,
                pdfBase64: pdfBase64
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
            className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
            <div className="bg-slate-800 rounded-2xl max-w-2xl w-full border border-slate-700 shadow-2xl overflow-hidden mt-10 md:mt-0">

                {/* Toolbar Superior */}
                <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-700">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="text-green-400" size={24} />
                        <span className="font-semibold text-lg">OS Salva com Sucesso!</span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white font-medium px-3 py-1 bg-slate-800 rounded-md">
                        Fechar
                    </button>
                </div>

                {/* Visualização da Página A4 (Container com scroll) */}
                <div className="p-6 overflow-x-auto bg-slate-800/50 flex justify-center">
                    {/* O REF abaixo aponta para o container branco que simboliza o papel. Tudo aqui dentro vai pro PDF */}
                    <div ref={printRef} className="bg-white text-slate-900 p-8 w-[210mm] min-h-[297mm] shadow-md flex flex-col relative shrink-0">

                        <div className="absolute top-8 right-8">
                            <QRCodeSVG value={`https://markbuilding.com/os/${os.id}`} size={80} />
                        </div>

                        <div className="border-b-4 border-slate-800 pb-4 mb-6">
                            <h1 className="text-4xl font-black tracking-tighter">MARK BUILDING</h1>
                            <p className="text-lg font-semibold text-slate-500 mt-1">ORDEM DE SERVIÇO TÉCNICA</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8 text-sm border border-slate-300 p-4 rounded-md bg-slate-50">
                            <div className="col-span-2"><span className="font-bold text-slate-500">CONDOMÍNIO / LOCAL:</span> <br /> {os.condominio}</div>
                            <div><span className="font-bold text-slate-500">ID DA OS:</span> <br /> {os.id.toUpperCase()}</div>
                            <div><span className="font-bold text-slate-500">DATA:</span> <br /> {new Date(os.dataCriacao).toLocaleString('pt-BR')}</div>
                            <div><span className="font-bold text-slate-500">CRITICIDADE:</span> <br /> {os.criticidade}</div>
                            <div><span className="font-bold text-slate-500">STATUS INICIAL:</span> <br /> {os.status}</div>
                        </div>

                        <div className="mb-8 flex-1">
                            <h3 className="text-xl font-bold bg-slate-200 px-3 py-1 mb-3">SERVIÇO EXECUTADO</h3>
                            <p className="text-lg font-bold mb-2">{os.titulo}</p>
                            <p className="text-slate-700 whitespace-pre-wrap">{os.descricao}</p>
                        </div>

                        {/* Pad de Assinatura Simulado (No app real pegaríamos a BASE64 do SignatureCanvas) */}
                        <div className="mt-auto pt-8 border-t-2 border-slate-300 grid grid-cols-2 gap-8 text-center text-sm">
                            <div>
                                <div className="h-16 border-b border-slate-400 mb-2 flex items-end justify-center">
                                    <span className="italic text-slate-300">Assinado digitalmente</span>
                                </div>
                                <p className="font-bold">ASSINATURA DO TÉCNICO</p>
                            </div>
                            <div>
                                <div className="h-16 border-b border-slate-400 mb-2"></div>
                                <p className="font-bold">ASSINATURA DO RESPONSÁVEL</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toolbar Inferior - Ações */}
                <div className="p-4 bg-slate-900 flex justify-end gap-3 flex-wrap">
                    <button
                        onClick={handleDownloadPdf}
                        className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-xl font-medium transition-colors"
                    >
                        <Download size={20} /> Baixar PDF
                    </button>

                    <button
                        disabled={isUploading}
                        onClick={handleUploadDrive}
                        className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CloudUpload size={20} /> {isUploading ? 'Sincronizando...' : 'Sincronizar Drive'}
                    </button>
                </div>

            </div>
        </motion.div>
    )
}
