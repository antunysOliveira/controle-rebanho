"use client"

import { useMemo } from "react"
import { useStage } from "@/components/stage-provider"
import { useData } from "@/components/data-provider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

type TipoMed = "HORMONIO" | "ANTIBIOTICO" | "ANTIPARASITARIO" | "VITAMINA" | "OUTRO"

const tipoLabel: Record<TipoMed, string> = {
  HORMONIO: "Hormônio",
  ANTIBIOTICO: "Antibiótico",
  ANTIPARASITARIO: "Antiparasitário",
  VITAMINA: "Vitamina",
  OUTRO: "Outro",
}

function loteStatusBadge(status: string) {
  switch (status) {
    case "PARTO":     return <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Parto</Badge>
    case "EM_MONTA":  return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Em Monta</Badge>
    case "GESTACAO":  return <Badge className="bg-purple-500 hover:bg-purple-600 text-white">Gestação</Badge>
    case "ENCERRADO": return <Badge variant="secondary">Encerrado</Badge>
    default:          return <Badge variant="outline">{status}</Badge>
  }
}

function taxaBadge(taxa: number) {
  if (taxa >= 80) return <Badge variant="outline" className="text-green-700 border-green-400">{taxa.toFixed(1)}%</Badge>
  if (taxa >= 70) return <Badge variant="outline" className="text-amber-700 border-amber-400">{taxa.toFixed(1)}%</Badge>
  return <Badge variant="outline" className="text-red-700 border-red-400">{taxa.toFixed(1)}%</Badge>
}

export default function RelatoriosPage() {
  const { data } = useStage()
  const { animais, bezerros, lotes, medicamentos, aplicacoes, eventosReprodutivos, loading } = useData()

  const taxaPrenhez = useMemo(() => {
    const byLote = new Map<string, { ins: Set<string>; pos: Set<string> }>()
    for (const a of animais) {
      const aEvents = eventosReprodutivos.filter(e => e.animalId === a.id)
      if (!aEvents.some(e => e.tipo === "INSEMINACAO_IATF")) continue
      if (!byLote.has(a.lote)) byLote.set(a.lote, { ins: new Set(), pos: new Set() })
      const entry = byLote.get(a.lote)!
      entry.ins.add(a.id)
      if (aEvents.some(e => e.tipo === "DIAGNOSTICO_PRENHEZ" && e.resultado === "POSITIVO")) entry.pos.add(a.id)
    }
    return Array.from(byLote.entries()).map(([lote, d]) => ({
      lote,
      inseminadas: d.ins.size,
      positivas: d.pos.size,
      taxa: d.ins.size > 0 ? (d.pos.size / d.ins.size) * 100 : 0,
    }))
  }, [animais, eventosReprodutivos])

  const producaoBezerrosMes = useMemo(() => {
    const byMonth = new Map<string, { key: Date; machos: number; femeas: number; pesos: number[] }>()
    for (const b of bezerros) {
      const label = format(b.dataNascimento, "MMM/yyyy", { locale: ptBR })
      if (!byMonth.has(label)) byMonth.set(label, { key: b.dataNascimento, machos: 0, femeas: 0, pesos: [] })
      const m = byMonth.get(label)!
      if (b.sexo === "M") m.machos++; else m.femeas++
      m.pesos.push(b.pesoNascimento)
    }
    return Array.from(byMonth.entries())
      .sort(([, a], [, b]) => a.key.getTime() - b.key.getTime())
      .map(([periodo, d]) => ({
        periodo: periodo.charAt(0).toUpperCase() + periodo.slice(1),
        nascimentos: d.machos + d.femeas,
        machos: d.machos,
        femeas: d.femeas,
        pesoMedio: d.pesos.length > 0
          ? `${(d.pesos.reduce((a, b) => a + b, 0) / d.pesos.length).toFixed(1)} kg`
          : null,
      }))
  }, [bezerros])

  const top5 = useMemo(() => {
    const consumoMap = new Map<string, { nome: string; tipo: string; count: number; totalDose: number; unidade: string }>()
    for (const ap of aplicacoes) {
      const med = medicamentos.find(m => m.id === ap.medicamentoId)
      if (!med) continue
      const existing = consumoMap.get(ap.medicamentoId)
      if (existing) { existing.count++; existing.totalDose += ap.doseAplicada }
      else consumoMap.set(ap.medicamentoId, { nome: med.nome, tipo: med.tipo, count: 1, totalDose: ap.doseAplicada, unidade: med.unidade })
    }
    return Array.from(consumoMap.values()).sort((a, b) => b.count - a.count).slice(0, 5)
  }, [aplicacoes, medicamentos])

  const visaoGeralLotes = useMemo(() => lotes.map(l => ({
    nome: l.nome, status: l.status,
    totalVacas: l.totalVacas, gestantes: l.gestantes,
    paridasNoMes: l.paridasNoMes, bezerrosVivos: l.bezerrosVivos, desmamados: l.desmamados,
  })), [lotes])

  const protocolosAtivos = animais.filter(a => a.status === "EM_PROTOCOLO").length
  const bezerrosAtivos   = bezerros.filter(b => b.status === "MAMANDO").length

  if (loading) return <div className="p-4 md:p-6 text-sm text-muted-foreground">Carregando...</div>

  return (
    <div className="p-4 md:p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground text-sm mt-1">Visão consolidada · {data.descricao}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🐄</span>
              <div>
                <p className="text-3xl font-bold leading-none">{animais.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Total de Animais</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🐮</span>
              <div>
                <p className="text-3xl font-bold leading-none">{bezerrosAtivos}</p>
                <p className="text-xs text-muted-foreground mt-1">Bezerros Mamando</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔬</span>
              <div>
                <p className="text-3xl font-bold leading-none">{protocolosAtivos}</p>
                <p className="text-xs text-muted-foreground mt-1">Protocolos Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💊</span>
              <div>
                <p className="text-3xl font-bold leading-none">{aplicacoes.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Aplicações de Medicamentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Taxa de Prenhez por Lote</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lote</TableHead>
                <TableHead className="text-right">Inseminadas</TableHead>
                <TableHead className="text-right">Diagnóstico Positivo</TableHead>
                <TableHead className="text-right">Taxa (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxaPrenhez.map((row) => (
                <TableRow key={row.lote}>
                  <TableCell className="font-medium">{row.lote}</TableCell>
                  <TableCell className="text-right">{row.inseminadas}</TableCell>
                  <TableCell className="text-right">{row.positivas}</TableCell>
                  <TableCell className="text-right">{taxaBadge(row.taxa)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-teal-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Produção de Bezerros por Período</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead className="text-right">Nascimentos</TableHead>
                <TableHead className="text-right">♂ Machos</TableHead>
                <TableHead className="text-right">♀ Fêmeas</TableHead>
                <TableHead className="text-right">Peso Médio Nasc.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {producaoBezerrosMes.map((row) => (
                <TableRow key={row.periodo}>
                  <TableCell className="font-medium">{row.periodo}</TableCell>
                  <TableCell className="text-right">{row.nascimentos}</TableCell>
                  <TableCell className="text-right">{row.machos}</TableCell>
                  <TableCell className="text-right">{row.femeas}</TableCell>
                  <TableCell className="text-right">
                    {row.pesoMedio ?? <span className="text-muted-foreground">—</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-amber-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Consumo de Medicamentos (Top 5)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicamento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Aplicações</TableHead>
                <TableHead className="text-right">Total Aplicado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {top5.map((item) => (
                <TableRow key={item.nome}>
                  <TableCell className="font-medium">{item.nome}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {tipoLabel[item.tipo as TipoMed] ?? item.tipo}
                  </TableCell>
                  <TableCell className="text-right">{item.count}</TableCell>
                  <TableCell className="text-right font-mono">
                    {item.totalDose} {item.unidade}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Status do Rebanho por Lote</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 space-y-4">
          {visaoGeralLotes.map((lote) => (
            <div key={lote.nome} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{lote.nome}</span>
                {loteStatusBadge(lote.status)}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-md bg-muted/50 p-3 text-center">
                  <p className="text-xl font-bold">{lote.totalVacas}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Vacas</p>
                </div>
                <div className="rounded-md bg-muted/50 p-3 text-center">
                  <p className="text-xl font-bold">{lote.gestantes}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Gestantes</p>
                </div>
                <div className="rounded-md bg-muted/50 p-3 text-center">
                  <p className="text-xl font-bold">{lote.bezerrosVivos}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Bezerros</p>
                </div>
                <div className="rounded-md bg-muted/50 p-3 text-center">
                  <p className="text-xl font-bold">{lote.desmamados}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Desmamados</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
