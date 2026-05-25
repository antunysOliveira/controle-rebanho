"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStage } from "@/components/stage-provider"

function diasBadge(dias: number) {
  if (dias <= 7) return <Badge variant="destructive">{dias}d</Badge>
  return (
    <Badge variant="outline" className="border-yellow-500 text-yellow-700">
      {dias}d
    </Badge>
  )
}

const etapaLabel: Record<string, string> = {
  implante_hormonal: "Implante",
  inseminacao_iatf: "Inseminação IATF",
  aguardando_diagnostico: "Aguard. diagnóstico",
}

const statusLoteLabel: Record<string, string> = {
  ABERTO: "Aberto", EM_MONTA: "Em monta", GESTACAO: "Gestação",
  PARTO: "Parto", ENCERRADO: "Encerrado",
}

export default function Dashboard() {
  const { stageKey: key, data } = useStage()
  const d = data.simDate

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground text-sm">
          📅 {format(d, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded font-mono">Estágio {key} · simulado</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1 max-w-lg">{data.detalhe}</p>
      </div>

      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            🐄 Partos Próximos
            <Badge variant="secondary">{data.partosProximos.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.partosProximos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum parto nos próximos 15 dias.</p>
          ) : (
            <div className="space-y-2">
              {data.partosProximos.map((v) => (
                <div key={v.idEtiqueta} className="flex items-center justify-between py-1.5 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    {diasBadge(v.diasRestantes)}
                    <span className="font-mono text-sm font-medium">#{v.idEtiqueta}</span>
                    {v.nome && <span className="text-sm text-muted-foreground">{v.nome}</span>}
                  </div>
                  <div className="text-right">
                    <span className="text-sm">{format(v.dataEstimada, "dd/MM", { locale: ptBR })}</span>
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
            <Badge variant="secondary">{data.desmaamesProximos.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.desmaamesProximos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum desmame nos próximos 15 dias.</p>
          ) : (
            <div className="space-y-2">
              {data.desmaamesProximos.map((b) => (
                <div key={b.idEtiqueta} className="flex items-center justify-between py-1.5 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    {diasBadge(b.diasRestantes)}
                    <span className="font-mono text-sm font-medium">Bez #{b.idEtiqueta}</span>
                    <span className="text-xs text-muted-foreground">mãe #{b.idMae}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm">{format(b.dataEstimada, "dd/MM", { locale: ptBR })}</span>
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
            <Badge variant="secondary">{data.vacasEmProtocolo.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.vacasEmProtocolo.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum protocolo ativo.</p>
          ) : (
            <div className="space-y-3">
              {data.vacasEmProtocolo.map((v) => (
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
            <Badge variant="secondary">{data.diagnosticosPendentes.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.diagnosticosPendentes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum diagnóstico pendente.</p>
          ) : (
            <div className="space-y-2">
              {data.diagnosticosPendentes.map((v) => (
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
            <Badge variant="destructive">{data.alertasMedicamentos.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.alertasMedicamentos.map((m, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <Badge variant={m.alerta === "estoque" ? "destructive" : "outline"} className="text-xs">
                    {m.alerta === "estoque" ? "Estoque baixo" : "Vence em breve"}
                  </Badge>
                  <span className="text-sm font-medium">{m.nome}</span>
                </div>
                <div className="text-right text-sm">
                  {m.alerta === "estoque" ? (
                    <span className="text-destructive font-medium">{Number(m.estoqueAtual)} / {Number(m.estoqueMinimo)} mín</span>
                  ) : (
                    <span className="text-yellow-600">{format(m.validade!, "dd/MM/yyyy")}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">📋 Visão Geral dos Lotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.visaoGeralLotes.map((lote) => (
              <div key={lote.nome} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="font-medium text-sm">{lote.nome}</span>
                  <Badge variant="outline" className="text-xs">{statusLoteLabel[lote.status]}</Badge>
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
            <Badge variant="secondary">{data.bezarrosAtivos.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.bezarrosAtivos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum bezerro mamando.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {data.bezarrosAtivos.map((b) => (
                <div key={b.idEtiqueta} className="border rounded-md p-2.5 flex items-center justify-between text-sm">
                  <div>
                    <span className="font-mono font-medium">#{b.idEtiqueta}</span>
                    <span className="text-xs text-muted-foreground ml-2">{b.sexo === "M" ? "♂" : "♀"} · mãe #{b.idMae}</span>
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
