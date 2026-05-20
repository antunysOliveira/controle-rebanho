import { lotes } from "@/lib/mock/data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

function statusBadge(status: string) {
  switch (status) {
    case "ABERTO":
      return <Badge variant="outline" className="text-gray-600 border-gray-400">Aberto</Badge>
    case "EM_MONTA":
      return <Badge className="bg-blue-500 hover:bg-blue-600">Em monta</Badge>
    case "GESTACAO":
      return <Badge className="bg-purple-500 hover:bg-purple-600">Gestação</Badge>
    case "PARTO":
      return <Badge className="bg-amber-500 hover:bg-amber-600">Parto</Badge>
    case "ENCERRADO":
      return <Badge variant="secondary">Encerrado</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function borderTopClass(status: string) {
  switch (status) {
    case "PARTO":      return "border-t-amber-500"
    case "EM_MONTA":   return "border-t-blue-500"
    case "GESTACAO":   return "border-t-purple-500"
    case "ENCERRADO":  return "border-t-gray-400"
    case "ABERTO":
    default:           return "border-t-green-500"
  }
}

export default function LotesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Lotes</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lotes.map((lote) => (
          <Card key={lote.id} className={cn("border-t-4", borderTopClass(lote.status))}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base font-semibold">{lote.nome}</CardTitle>
                {statusBadge(lote.status)}
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-bold">{lote.totalVacas}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Vacas</p>
                </div>
                <div className="rounded-md bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-bold">{lote.gestantes}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Gestantes</p>
                </div>
                <div className="rounded-md bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-bold">{lote.paridasNoMes}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Partos este mês</p>
                </div>
                <div className="rounded-md bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-bold">{lote.bezerrosVivos}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Bezerros vivos</p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <span>
                  <span className="font-medium text-foreground">Touro:</span> {lote.touro}
                </span>
                <span>
                  <span className="font-medium text-foreground">Aberto:</span>{" "}
                  {format(lote.dataAbertura, "dd/MM/yyyy", { locale: ptBR })}
                </span>
              </div>
            </CardContent>

            <CardFooter>
              <Link
                href={`/lotes/${lote.id}`}
                className="w-full text-center text-sm border border-border rounded-md px-3 py-1.5 hover:bg-muted transition-colors"
              >
                Ver detalhes →
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
