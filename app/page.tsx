"use client"

import { useMemo } from "react"
import { format, differenceInDays, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/components/data-provider"
import type { EventoReprodutivo } from "@/lib/types"

type EtapaProtocolo = "implante_hormonal" | "inseminacao_iatf" | "aguardando_diagnostico"

const etapaLabel: Record<EtapaProtocolo, string> = {
  implante_hormonal: "Implante",
  inseminacao_iatf: "Inseminação IATF",
  aguardando_diagnostico: "Aguard. diagnóstico",
}

const statusLoteLabel: Record<string, string> = {
  ABERTO: "Aberto", EM_MONTA: "Em monta", GESTACAO: "Gestação",
  PARTO: "Parto", ENCERRADO: "Encerrado",
}

function diasBadge(dias: number) {
  if (dias <= 7) return <Badge variant="destructive">{dias}d</Badge>
  return <Badge variant="outline" className="border-yellow-500 text-yellow-700">{dias}d</Badge>
}

export default function Dashboard() {
  const { animais, bezerros, lotes, medicamentos, eventosReprodutivos, veterinarios, loading } = useData()
  const hoje = useMemo(() => new Date(), [])

  const partosProximos = useMemo(() =>
    animais
      .filter(a => a.dataPartoEstimado !== null)
      .map(a => ({ ...a, dias: differenceInDays(a.dataPartoEstimado!, hoje) }))
      .filter(a => a.dias >= 0 && a.dias <= 15)
      .sort((a, b) => a.dias - b.dias),
    [animais, hoje]
  )

  const desmamesProximos = useMemo(() =>
    bezerros
      .filter(b => b.status === "MAMANDO" && b.dataDesmameEstimada !== null)
      .map(b => ({ ...b, dias: differenceInDays(b.dataDesmameEstimada!, hoje) }))
      .filter(b => b.dias >= 0 && b.dias <= 15)
      .sort((a, b) => a.dias - b.dias),
    [bezerros, hoje]
  )

  const vacasEmProtocolo = useMemo(() => {
    const byAnimal = new Map<string, EventoReprodutivo[]>()
    for (const e of eventosReprodutivos) {
      const list = byAnimal.get(e.animalId) ?? []
      list.push(e)
      byAnimal.set(e.animalId, list)
    }
    return animais
      .filter(a => a.status === "EM_PROTOCOLO")
      .flatMap(a => {
        const events = (byAnimal.get(a.id) ?? []).sort((x, y) => x.data.getTime() - y.data.getTime())
        const implante    = events.filter(e => e.tipo === "IMPLANTE_HORMONAL").at(-1)
        const inseminacao = events.filter(e => e.tipo === "INSEMINACAO_IATF").at(-1)
        if (!implante) return []
        const dataImplante    = implante.data
        const dataInseminacao = inseminacao?.data ?? addDays(dataImplante, 2)
        const dataDiagnostico = addDays(dataInseminacao, 30)
        let etapaAtual: EtapaProtocolo
        if (!inseminacao) {
          etapaAtual = "implante_hormonal"
        } else {
          etapaAtual = differenceInDays(hoje, inseminacao.data) >= 28 ? "aguardando_diagnostico" : "inseminacao_iatf"
        }
        const vetId = implante.veterinarioId ?? inseminacao?.veterinarioId
        const vet = vetId ? veterinarios.find(v => v.id === vetId) : undefined
        return [{ idEtiqueta: a.idEtiqueta, nome: a.nome, lote: a.lote, etapaAtual, dataImplante, dataInseminacao, dataDiagnostico, veterinario: vet?.nome }]
      })
  }, [animais, eventosReprodutivos, veterinarios, hoje])

  const diagnosticosPendentes = useMemo(() =>
    animais
      .filter(a => a.status === "INSEMINADA")
      .flatMap(a => {
        const events = eventosReprodutivos.filter(e => e.animalId === a.id)
        const inseminacao = events
          .filter(e => e.tipo === "INSEMINACAO_IATF")
          .sort((x, y) => y.data.getTime() - x.data.getTime())
          .at(0)
        if (!inseminacao) return []
        const hasDiag = events.some(e => e.tipo === "DIAGNOSTICO_PRENHEZ" && e.data > inseminacao.data)
        if (hasDiag) return []
        return [{ ...a, dataInseminacao: inseminacao.data, diasAguardando: differenceInDays(hoje, inseminacao.data) }]
      })
      .sort((a, b) => b.diasAguardando - a.diasAguardando),
    [animais, eventosReprodutivos, hoje]
  )

  type AlertaMed = { alerta: "estoque" | "validade"; diasValidade: number | null } & typeof medicamentos[number]
  const alertasMedicamentos = useMemo((): AlertaMed[] =>
    medicamentos
      .filter(m => m.ativo)
      .flatMap(m => {
        if (m.estoqueAtual <= m.estoqueMinimo)
          return [{ ...m, alerta: "estoque" as const, diasValidade: null }] as AlertaMed[]
        if (m.validade) {
          const dias = differenceInDays(m.validade, hoje)
          if (dias >= 0 && dias <= 60)
            return [{ ...m, alerta: "validade" as const, diasValidade: dias }] as AlertaMed[]
        }
        return [] as AlertaMed[]
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [medicamentos, hoje]
  )

  const bezarrosAtivos = useMemo(() => bezerros.filter(b => b.status === "MAMANDO"), [bezerros])

  if (loading) return <div className="p-4 md:p-6 text-sm text-muted-foreground">Carregando...</div>

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground text-sm">
          {format(hoje, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            🐄 Partos Próximos
            <Badge variant="secondary">{partosProximos.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {partosProximos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum parto nos próximos 15 dias.</p>
          ) : (
            <div className="space-y-2">
              {partosProximos.map((v) => (
                <div key={v.idEtiqueta} className="flex items-center justify-between py-1.5 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    {diasBadge(v.dias)}
                    <span className="font-mono text-sm font-medium">#{v.idEtiqueta}</span>
                    {v.nome && <span className="text-sm text-muted-foreground">{v.nome}</span>}
                  </div>
                  <div className="text-right">
                    <span className="text-sm">{format(v.dataPartoEstimado!, "dd/MM", { locale: ptBR })}</span>
                    <span className="text-xs text-muted-foreground ml-2">{v.lote}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-amber-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            🐮 Desmames Próximos
            <Badge variant="secondary">{desmamesProximos.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {desmamesProximos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum desmame nos próximos 15 dias.</p>
          ) : (
            <div className="space-y-2">
              {desmamesProximos.map((b) => (
                <div key={b.idEtiqueta} className="flex items-center justify-between py-1.5 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    {diasBadge(b.dias)}
                    <span className="font-mono text-sm font-medium">Bez #{b.idEtiqueta}</span>
                    <span className="text-xs text-muted-foreground">mãe #{b.maeEtiqueta}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm">{format(b.dataDesmameEstimada!, "dd/MM", { locale: ptBR })}</span>
                    <span className="text-xs text-muted-foreground ml-2">{b.pesoAtual} kg</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            🔬 Vacas em Protocolo IATF
            <Badge variant="secondary">{vacasEmProtocolo.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vacasEmProtocolo.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum protocolo ativo.</p>
          ) : (
            <div className="space-y-3">
              {vacasEmProtocolo.map((v) => (
                <div key={v.idEtiqueta} className="space-y-1.5 py-2 border-b last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">#{v.idEtiqueta}</span>
                      {v.nome && <span className="text-sm text-muted-foreground">{v.nome}</span>}
                      <span className="text-xs text-muted-foreground">{v.lote}</span>
                    </div>
                    <Badge className="text-xs">{etapaLabel[v.etapaAtual]}</Badge>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Implante: {format(v.dataImplante, "dd/MM")}</span>
                    <span>Inseminação: {format(v.dataInseminacao, "dd/MM")}</span>
                    <span>Diagnóstico: {format(v.dataDiagnostico, "dd/MM")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-violet-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            ⏳ Diagnósticos de Prenhez Pendentes
            <Badge variant="secondary">{diagnosticosPendentes.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {diagnosticosPendentes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum diagnóstico pendente.</p>
          ) : (
            <div className="space-y-2">
              {diagnosticosPendentes.map((v) => (
                <div key={v.idEtiqueta} className="flex items-center justify-between py-1.5 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium">#{v.idEtiqueta}</span>
                    {v.nome && <span className="text-sm text-muted-foreground">{v.nome}</span>}
                    <span className="text-xs text-muted-foreground">{v.lote}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm">Insem.: {format(v.dataInseminacao, "dd/MM")}</span>
                    <span className="text-xs text-muted-foreground ml-2">{v.diasAguardando}d atrás</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-rose-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            💊 Alertas de Medicamentos
            <Badge variant="destructive">{alertasMedicamentos.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alertasMedicamentos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum alerta de medicamentos.</p>
          ) : (
            <div className="space-y-2">
              {alertasMedicamentos.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-1.5 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <Badge variant={m.alerta === "estoque" ? "destructive" : "outline"} className="text-xs">
                      {m.alerta === "estoque" ? "Estoque baixo" : "Vence em breve"}
                    </Badge>
                    <span className="text-sm font-medium">{m.nome}</span>
                  </div>
                  <div className="text-right text-sm">
                    {m.alerta === "estoque" ? (
                      <span className="text-destructive font-medium">{m.estoqueAtual} / {m.estoqueMinimo} mín</span>
                    ) : (
                      <span className="text-yellow-600">{format(m.validade!, "dd/MM/yyyy")}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">📋 Visão Geral dos Lotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {lotes.map((lote) => (
              <div key={lote.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="font-medium text-sm">{lote.nome}</span>
                  <Badge variant="outline" className="text-xs">{statusLoteLabel[lote.status] ?? lote.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>Vacas: <strong className="text-foreground">{lote.totalVacas}</strong></span>
                  <span>Gestantes: <strong className="text-foreground">{lote.gestantes}</strong></span>
                  <span>Partos/mês: <strong className="text-foreground">{lote.paridasNoMes}</strong></span>
                  <span>Bezerros: <strong className="text-foreground">{lote.bezerrosVivos}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-teal-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            🐄 Bezerros em Aleitamento
            <Badge variant="secondary">{bezarrosAtivos.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bezarrosAtivos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum bezerro mamando.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {bezarrosAtivos.map((b) => (
                <div key={b.id} className="border rounded-md p-2.5 flex items-center justify-between text-sm">
                  <div>
                    <span className="font-mono font-medium">#{b.idEtiqueta}</span>
                    <span className="text-xs text-muted-foreground ml-2">{b.sexo === "M" ? "♂" : "♀"} · mãe #{b.maeEtiqueta}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{b.pesoAtual} kg</div>
                    <div className="text-xs text-muted-foreground">{b.diasVida}d de vida</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
