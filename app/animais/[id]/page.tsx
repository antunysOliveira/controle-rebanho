import { animais } from "@/lib/mock/data"
import { AnimalDetailClient } from "@/components/animal-detail-client"

export function generateStaticParams() {
  return animais.map((a) => ({ id: a.id }))
}

export default async function AnimalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <AnimalDetailClient id={id} />
}
