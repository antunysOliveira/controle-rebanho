import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { aplicacoes } from "@/lib/mock/data"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"

type Via = "INTRAMUSCULAR" | "SUBCUTANEA" | "ORAL" | "TOPICA"

const viaLabel: Record<Via, string> = {
  INTRAMUSCULAR: "IM",
  SUBCUTANEA: "SC",
  ORAL: "Oral",
  TOPICA: "Tópica",
}

function ViaBadge({ via }: { via: string }) {
  if (via === "INTRAMUSCULAR") {
    return <Badge variant="outline" className="text-blue-700 border-blue-400">{viaLabel.INTRAMUSCULAR}</Badge>
  }
  if (via === "SUBCUTANEA") {
    return <Badge variant="outline" className="text-amber-700 border-amber-400">{viaLabel.SUBCUTANEA}</Badge>
  }
  if (via === "ORAL") {
    return <Badge variant="outline" className="text-green-700 border-green-400">{viaLabel.ORAL}</Badge>
  }
  return <Badge variant="secondary">{viaLabel.TOPICA}</Badge>
}

export default function AplicacoesPage() {
  const sorted = [...aplicacoes].sort((a, b) => b.data.getTime() - a.data.getTime())

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Aplicações de Medicamentos</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {aplicacoes.length} aplicações registradas
          </p>
        </div>
        <Link
          href="/medicamentos"
          className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline"
        >
          ← Voltar a Medicamentos
        </Link>
      </div>

      <div className="rounded-xl border border-l-4 border-l-rose-500 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Animal</TableHead>
              <TableHead>Medicamento</TableHead>
              <TableHead className="text-right">Dose</TableHead>
              <TableHead>Via</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead className="text-right">Carência</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((ap) => (
              <TableRow key={ap.id}>
                <TableCell className="whitespace-nowrap">
                  {format(ap.data, "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <span className="font-mono font-medium">#{ap.etiqueta}</span>
                </TableCell>
                <TableCell>{ap.medicamento}</TableCell>
                <TableCell className="text-right font-mono">
                  {ap.doseAplicada}
                </TableCell>
                <TableCell>
                  <ViaBadge via={ap.via} />
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{ap.motivo}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{ap.responsavel}</TableCell>
                <TableCell className="text-right text-sm">
                  {ap.carenciaDias > 0 ? (
                    <span className="font-medium">{ap.carenciaDias} dias</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
