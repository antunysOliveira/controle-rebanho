"use client"

import { useStage } from "@/components/stage-provider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { format, subDays, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"

const STATUS_ORDER: Record<string, number> = { MAMANDO: 0, DESMAMADO: 1, VENDIDO: 2, MORTO: 3 }

function statusBadge(status: string) {
  switch (status) {
    case "MAMANDO":
      return <Badge>Mamando</Badge>
    case "DESMAMADO":
      return <Badge variant="secondary">Desmamado</Badge>
    case "VENDIDO":
      return <Badge variant="outline" className="border-blue-500 text-blue-600">Vendido</Badge>
    case "MORTO":
      return <Badge variant="destructive">Morto</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function BezerrosPage() {
  const { data } = useStage()
  const simDate = data.simDate

  const sorted = [...data.bezarrosAtivos].sort(
    (a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99)
  )

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bezerros</h1>
        <p className="text-muted-foreground text-sm">{data.bezarrosAtivos.length} bezerros ativos · {data.descricao}</p>
      </div>

      <Card className="border-l-4 border-l-teal-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Registro de Bezerros</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Etiqueta</TableHead>
                <TableHead>Sexo</TableHead>
                <TableHead>Mãe</TableHead>
                <TableHead>Nascimento</TableHead>
                <TableHead className="text-right">Dias de Vida</TableHead>
                <TableHead className="text-right">Peso Nasc. (kg)</TableHead>
                <TableHead className="text-right">Peso Atual (kg)</TableHead>
                <TableHead>Desmame Estimado</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((b) => {
                const dataNascimento = subDays(simDate, b.diasVida)
                const dataDesmame = addDays(dataNascimento, 210)
                return (
                  <TableRow
                    key={b.idEtiqueta}
                    className={cn(b.status === "DESMAMADO" && "opacity-60")}
                  >
                    <TableCell className="font-mono font-medium">{b.idEtiqueta}</TableCell>
                    <TableCell>{b.sexo === "M" ? "♂ Macho" : "♀ Fêmea"}</TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">#{b.idMae}</span>
                    </TableCell>
                    <TableCell>
                      {format(dataNascimento, "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-right">{b.diasVida}</TableCell>
                    <TableCell className="text-right">{b.pesoNascimento}</TableCell>
                    <TableCell className="text-right">{b.pesoAtual}</TableCell>
                    <TableCell>
                      {format(dataDesmame, "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>{statusBadge(b.status)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
