"use client"

import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useData } from "@/components/data-provider"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table"

type StatusAnimal = "GESTANTE" | "LACTANDO" | "VAZIA" | "EM_PROTOCOLO" | "INSEMINADA" | "DESCARTE"

const statusAnimalLabel: Record<StatusAnimal, string> = {
  GESTANTE: "Gestante", LACTANDO: "Lactando", VAZIA: "Vazia",
  EM_PROTOCOLO: "Em Protocolo", INSEMINADA: "Inseminada", DESCARTE: "Descarte",
}

function AnimalStatusBadge({ status }: { status: string }) {
  const s = status as StatusAnimal
  if (s === "GESTANTE")    return <Badge className="bg-blue-100 text-blue-700 border-blue-200">{statusAnimalLabel[s]}</Badge>
  if (s === "LACTANDO")    return <Badge className="bg-teal-100 text-teal-700 border-teal-200">{statusAnimalLabel[s]}</Badge>
  if (s === "VAZIA")       return <Badge variant="outline">{statusAnimalLabel[s]}</Badge>
  if (s === "EM_PROTOCOLO")return <Badge className="bg-purple-100 text-purple-700 border-purple-200">{statusAnimalLabel[s]}</Badge>
  if (s === "INSEMINADA")  return <Badge className="bg-amber-100 text-amber-700 border-amber-200">{statusAnimalLabel[s]}</Badge>
  if (s === "DESCARTE")    return <Badge variant="destructive">{statusAnimalLabel[s]}</Badge>
  return <Badge>{status}</Badge>
}

const loteStatusLabel: Record<string, string> = {
  PARTO: "Parto", EM_MONTA: "Em Monta", ENCERRADO: "Encerrado", IATF: "IATF",
}

const loteStatusClass: Record<string, string> = {
  PARTO:     "bg-green-100 text-green-700 border-green-200",
  EM_MONTA:  "bg-blue-100 text-blue-700 border-blue-200",
  ENCERRADO: "bg-gray-100 text-gray-500 border-gray-200",
  IATF:      "bg-purple-100 text-purple-700 border-purple-200",
}

const loteTipoLabel: Record<string, string> = {
  VACA_CRIA: "Vaca Cria", RECRIA: "Recria", ENGORDA: "Engorda",
}

export function LoteDetailClient({ id }: { id: string }) {
  const { getLoteById, getAnimaisByLote, loading } = useData()

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Carregando...</div>

  const lote = getLoteById(id)
  if (!lote) {
    return (
      <div className="p-6 space-y-4">
        <Link href="/lotes" className="text-sm text-muted-foreground hover:text-foreground">← Lotes</Link>
        <p className="text-sm text-muted-foreground">Lote não encontrado.</p>
      </div>
    )
  }

  const animais = getAnimaisByLote(lote.id)

  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href="/lotes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Lotes
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">{lote.nome}</h1>
        <Badge className={loteStatusClass[lote.status] ?? ""}>{loteStatusLabel[lote.status] ?? lote.status}</Badge>
        <Badge variant="outline">{loteTipoLabel[lote.tipo] ?? lote.tipo}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader><CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Vacas</CardTitle></CardHeader>
          <CardContent><span className="text-3xl font-bold">{lote.totalVacas}</span></CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader><CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Gestantes</CardTitle></CardHeader>
          <CardContent><span className="text-3xl font-bold">{lote.gestantes}</span></CardContent>
        </Card>
        <Card className="border-l-4 border-l-teal-500">
          <CardHeader><CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Partos este mês</CardTitle></CardHeader>
          <CardContent><span className="text-3xl font-bold">{lote.paridasNoMes}</span></CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader><CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Bezerros vivos</CardTitle></CardHeader>
          <CardContent><span className="text-3xl font-bold">{lote.bezerrosVivos}</span></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Touro de Repasse</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            <p className="font-semibold text-base">{lote.touro}</p>
            <p className="text-sm text-muted-foreground">
              Encerramento:{" "}
              {lote.dataFechamento ? format(lote.dataFechamento, "dd/MM/yyyy", { locale: ptBR }) : "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Encarregados</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {lote.encarregados.map((enc) => (
                <li key={enc} className="text-sm flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                  {enc}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-l-4 border-l-green-500">
        <CardHeader><CardTitle>Animais do Lote</CardTitle></CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Etiqueta</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Parto</TableHead>
                <TableHead>Parto Estimado</TableHead>
                <TableHead>Lactando</TableHead>
                <TableHead className="pr-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {animais.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell className="pl-4"><span className="font-mono font-medium">{animal.idEtiqueta}</span></TableCell>
                  <TableCell>{animal.nome ?? "—"}</TableCell>
                  <TableCell><AnimalStatusBadge status={animal.status} /></TableCell>
                  <TableCell>{animal.dataUltimoParto ? format(animal.dataUltimoParto, "dd/MM/yyyy", { locale: ptBR }) : "—"}</TableCell>
                  <TableCell>{animal.dataPartoEstimado ? format(animal.dataPartoEstimado, "dd/MM/yyyy", { locale: ptBR }) : "—"}</TableCell>
                  <TableCell>
                    {animal.emLactacao
                      ? <span className="text-teal-600 font-medium">✓</span>
                      : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="pr-4">
                    <Link href={`/animais/${animal.id}`} className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline">
                      Ver
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
