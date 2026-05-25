import { LoteDetailClient } from "@/components/lote-detail-client"

export default async function LotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <LoteDetailClient id={id} />
}
