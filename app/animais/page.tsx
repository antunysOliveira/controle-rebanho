"use client"

import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useData } from "@/components/data-provider"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table"

type StatusType = "GESTANTE" | "LACTANDO" | "VAZIA" | "EM_PROTOCOLO" | "INSEMINADA" | "DESCARTE"

const statusLabel: Record<StatusType, string> = {
  GESTANTE: "Gestante", LACTANDO: "Lactando", VAZIA: "Vazia",
  EM_PROTOCOLO: "Em Protocolo", INSEMINADA: "Inseminada", DESCARTE: "Descarte",
}

function StatusBadge({ status }: { status: string }) {
  const s = status as StatusType
  if (s === "GESTANTE")    return <Badge className="bg-blue-100 text-blue-700 border-blue-200">{statusLabel[s]}</Badge>
  if (s === "LACTANDO")    return <Badge className="bg-teal-100 text-teal-700 border-teal-200">{statusLabel[s]}</Badge>
  if (s === "VAZIA")       return <Badge variant="outline">{statusLabel[s]}</Badge>
  if (s === "EM_PROTOCOLO")return <Badge className="bg-purple-100 text-purple-700 border-purple-200">{statusLabel[s]}</Badge>
  if (s === "INSEMINADA")  return <Badge className="bg-amber-100 text-amber-700 border-amber-200">{statusLabel[s]}</Badge>
  if (s === "DESCARTE")    return <Badge variant="destructive">{statusLabel[s]}</Badge>
  return <Badge>{status}</Badge>
}

export default function AnimaisPage() {
  const { animais, loading } = useData()

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Carregando...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Animais</h1>
        <p className="text-muted-foreground text-sm mt-1">{animais.length} animais cadastrados</p>
      </div>

      <div className="rounded-xl ring-1 ring-foreground/10 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Etiqueta</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Nascimento</TableHead>
              <TableHead>Último Parto</TableHead>
              <TableHead>Parto Estimado</TableHead>
              <TableHead>Lactando</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {animais.map((animal) => (
              <TableRow key={animal.id}>
                <TableCell><span className="font-mono font-medium">{animal.idEtiqueta}</span></TableCell>
                <TableCell>{animal.nome ?? "—"}</TableCell>
                <TableCell>{animal.lote}</TableCell>
                <TableCell><StatusBadge status={animal.status} /></TableCell>
                <TableCell>{format(animal.dataNascimento, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                <TableCell>{animal.dataUltimoParto ? format(animal.dataUltimoParto, "dd/MM/yyyy", { locale: ptBR }) : "—"}</TableCell>
                <TableCell>{animal.dataPartoEstimado ? format(animal.dataPartoEstimado, "dd/MM/yyyy", { locale: ptBR }) : "—"}</TableCell>
                <TableCell>
                  {animal.emLactacao
                    ? <span className="text-teal-600 font-medium">✓</span>
                    : <span className="text-muted-foreground">—</span>}
                </TableCell>
                <TableCell>
                  <Link href={`/animais/${animal.id}`} className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline">
                    Ver
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
