import Link from "next/link"
import { notFound } from "next/navigation"
import { format, differenceInYears } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  animais,
  getAnimalById,
  getBezerrosByMae,
  getEventosByAnimal,
  getAplicacoesByAnimal,
} from "@/lib/mock/data"

export function generateStaticParams() {
  return animais.map((a) => ({ id: a.id }))
}
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AnimalTimeline } from "@/components/animal-timeline"

type StatusType = "GESTANTE" | "LACTANDO" | "VAZIA" | "EM_PROTOCOLO" | "INSEMINADA" | "DESCARTE"

const statusLabel: Record<StatusType, string> = {
  GESTANTE:    "Gestante",
  LACTANDO:    "Lactando",
  VAZIA:       "Vazia",
  EM_PROTOCOLO:"Em Protocolo",
  INSEMINADA:  "Inseminada",
  DESCARTE:    "Descarte",
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    GESTANTE:    "bg-blue-100 text-blue-700 border-blue-200",
    LACTANDO:    "bg-teal-100 text-teal-700 border-teal-200",
    EM_PROTOCOLO:"bg-purple-100 text-purple-700 border-purple-200",
    INSEMINADA:  "bg-amber-100 text-amber-700 border-amber-200",
  }
  if (status === "VAZIA") return <Badge variant="outline">{statusLabel[status as StatusType]}</Badge>
  if (status === "DESCARTE") return <Badge variant="destructive">{statusLabel[status as StatusType]}</Badge>
  const cls = map[status]
  if (cls) return <Badge className={cls}>{statusLabel[status as StatusType]}</Badge>
  return <Badge>{status}</Badge>
}

export default async function AnimalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const animal = getAnimalById(id)

  if (!animal) notFound()

  const bezerros  = getBezerrosByMae(animal.id)
  const eventos   = getEventosByAnimal(animal.id)
  const aplicacoes = getAplicacoesByAnimal(animal.id)
  const idade = differenceInYears(new Date(), animal.dataNascimento)

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/animais" className="hover:text-green-600 hover:underline">
          ← Animais
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight font-mono">
          #{animal.idEtiqueta}
        </h1>
        {animal.nome && (
          <span className="text-xl font-semibold text-foreground">{animal.nome}</span>
        )}
        <StatusBadge status={animal.status} />
        <Badge variant="secondary">{animal.lote}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Nascimento</dt>
                  <dd className="font-medium">
                    {format(animal.dataNascimento, "dd/MM/yyyy", { locale: ptBR })}{" "}
                    <span className="text-muted-foreground font-normal">
                      ({idade} {idade === 1 ? "ano" : "anos"})
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Último Parto</dt>
                  <dd className="font-medium">
                    {animal.dataUltimoParto
                      ? format(animal.dataUltimoParto, "dd/MM/yyyy", { locale: ptBR })
                      : "—"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Parto Estimado</dt>
                  <dd className="font-medium">
                    {animal.dataPartoEstimado
                      ? format(animal.dataPartoEstimado, "dd/MM/yyyy", { locale: ptBR })
                      : "—"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Em Lactação</dt>
                  <dd className="font-medium">
                    {animal.emLactacao
                      ? <span className="text-teal-600">Sim</span>
                      : <span className="text-muted-foreground">Não</span>}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-teal-500">
            <CardHeader>
              <CardTitle>Bezerros</CardTitle>
            </CardHeader>
            <CardContent>
              {bezerros.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum bezerro registrado.</p>
              ) : (
                <ul className="space-y-3">
                  {bezerros.map((b) => (
                    <li
                      key={b.idEtiqueta}
                      className="flex items-start justify-between text-sm border-b last:border-0 pb-3 last:pb-0"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">{b.idEtiqueta}</span>
                          <span className="text-base leading-none">{b.sexo === "M" ? "♂" : "♀"}</span>
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {format(b.dataNascimento, "dd/MM/yyyy", { locale: ptBR })} · {b.pesoAtual} kg
                        </div>
                      </div>
                      <Badge
                        className={
                          b.status === "MAMANDO"
                            ? "bg-teal-100 text-teal-700 border-teal-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }
                      >
                        {b.status === "MAMANDO" ? "Mamando" : "Desmamado"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column — unified timeline */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle>Histórico</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimalTimeline eventos={eventos} aplicacoes={aplicacoes} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
