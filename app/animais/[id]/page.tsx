import { AnimalDetailClient } from "@/components/animal-detail-client"

export default async function AnimalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <AnimalDetailClient id={id} />
}
