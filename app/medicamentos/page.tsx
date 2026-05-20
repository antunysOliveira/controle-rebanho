import Link from "next/link"
import { format, differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { medicamentos } from "@/lib/mock/data"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type TipoMed = "HORMONIO" | "ANTIBIOTICO" | "ANTIPARASITARIO" | "VITAMINA" | "OUTRO"

const tipoLabel: Record<TipoMed, string> = {
  HORMONIO: "Hormônio",
  ANTIBIOTICO: "Antibiótico",
  ANTIPARASITARIO: "Antiparasitário",
  VITAMINA: "Vitamina",
  OUTRO: "Outro",
}

function TipoBadge({ tipo }: { tipo: string }) {
  if (tipo === "HORMONIO") {
    return <Badge variant="outline" className="text-purple-700 border-purple-400">{tipoLabel.HORMONIO}</Badge>
  }
  if (tipo === "ANTIBIOTICO") {
    return <Badge variant="outline" className="text-blue-700 border-blue-400">{tipoLabel.ANTIBIOTICO}</Badge>
  }
  if (tipo === "ANTIPARASITARIO") {
    return <Badge variant="outline" className="text-green-700 border-green-400">{tipoLabel.ANTIPARASITARIO}</Badge>
  }
  if (tipo === "VITAMINA") {
    return <Badge variant="outline" className="text-amber-700 border-amber-400">{tipoLabel.VITAMINA}</Badge>
  }
  return <Badge variant="secondary">{tipoLabel.OUTRO}</Badge>
}

export default function MedicamentosPage() {
  const hoje = new Date()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Medicamentos</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {medicamentos.length} medicamentos cadastrados
          </p>
        </div>
        <Link
          href="/medicamentos/aplicacoes"
          className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline"
        >
          Ver Aplicações →
        </Link>
      </div>

      <div className="rounded-xl border border-l-4 border-l-rose-500 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Princípio Ativo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Estoque</TableHead>
              <TableHead className="w-32">Nível</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Fornecedor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicamentos.map((med) => {
              const baixoEstoque = med.estoqueAtual < med.estoqueMinimo
              const daysToExpiry = differenceInDays(med.validade, hoje)
              const expirandoEmBreve = daysToExpiry >= 0 && daysToExpiry <= 30
              const progressValue = Math.min((med.estoqueAtual / med.estoqueMinimo) * 100, 100)
              const progressClass = baixoEstoque
                ? "[&>div]:bg-red-500"
                : progressValue >= 100
                ? "[&>div]:bg-green-500"
                : "[&>div]:bg-amber-500"

              return (
                <TableRow key={med.id} className={cn(baixoEstoque && "bg-red-50")}>
                  <TableCell className="font-medium">{med.nome}</TableCell>
                  <TableCell className="text-muted-foreground">{med.principioAtivo}</TableCell>
                  <TableCell>
                    <TipoBadge tipo={med.tipo} />
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={cn("font-mono font-medium", baixoEstoque && "text-destructive")}>
                      {med.estoqueAtual}
                    </span>
                    <span className="text-muted-foreground font-mono">
                      {" "}/ {med.estoqueMinimo} {med.unidade}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Progress value={progressValue} className={cn("h-2", progressClass)} />
                  </TableCell>
                  <TableCell>
                    <span className={cn(expirandoEmBreve && "text-yellow-600 font-medium")}>
                      {expirandoEmBreve && "⚠ "}
                      {format(med.validade, "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{med.fornecedor}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
