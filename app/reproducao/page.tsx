import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getCurrentStage } from "@/lib/get-stage"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

function EtapaBadge({ etapa }: { etapa: string }) {
  if (etapa === "implante_hormonal")
    return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Implante</Badge>
  if (etapa === "inseminacao_iatf")
    return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Inseminação IATF</Badge>
  if (etapa === "aguardando_diagnostico")
    return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Aguard. Diagnóstico</Badge>
  return <Badge variant="outline">{etapa}</Badge>
}

export default async function ReproducaoPage() {
  const { data } = await getCurrentStage()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Controle Reprodutivo</h1>
        <p className="text-muted-foreground text-sm mt-1">Protocolos, diagnósticos e repasse de touro · {data.descricao}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Protocolos IATF Ativos */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle>Protocolos IATF Ativos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.vacasEmProtocolo.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum protocolo ativo.</p>
            ) : (
              data.vacasEmProtocolo.map((p) => (
                <div key={p.idEtiqueta} className="rounded-lg border p-3 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-semibold text-sm">{p.idEtiqueta}</span>
                    {p.nome && <span className="text-sm text-muted-foreground">{p.nome}</span>}
                    <span className="text-xs text-muted-foreground">{p.lote}</span>
                    <EtapaBadge etapa={p.etapaAtual} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Implante</p>
                      <p className="font-medium">
                        {format(p.dataImplante, "dd/MM", { locale: ptBR })}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Inseminação</p>
                      <p className="font-medium">
                        {format(p.dataInseminacao, "dd/MM", { locale: ptBR })}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Diagnóstico</p>
                      <p className="font-medium">
                        {format(p.dataDiagnostico, "dd/MM", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  {p.veterinario && (
                    <p className="text-xs text-muted-foreground">{p.veterinario}</p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Diagnósticos Pendentes */}
        <Card className="border-l-4 border-l-violet-500">
          <CardHeader>
            <CardTitle>Diagnósticos Pendentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.diagnosticosPendentes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum diagnóstico pendente.</p>
            ) : (
              data.diagnosticosPendentes.map((d) => (
                <div key={d.idEtiqueta} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-sm">#{d.idEtiqueta}</span>
                      {d.nome && <span className="text-sm text-muted-foreground">{d.nome}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {d.lote} · Insem. {format(d.dataInseminacao, "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {d.diasAguardando > 30 ? (
                      <Badge variant="destructive">{d.diasAguardando}d</Badge>
                    ) : (
                      <Badge className="bg-amber-50 text-amber-700 border-amber-300" variant="outline">
                        {d.diasAguardando}d
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">aguardando</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Repasse de Touro */}
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader>
          <CardTitle>Repasse de Touro</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {data.repasseTouros.map((t) => (
            <div key={t.nome} className="rounded-lg border p-4 space-y-1">
              <p className="font-semibold">{t.nome}</p>
              <p className="text-sm text-muted-foreground">{t.lote}</p>
              <p className="text-sm">
                Desde <span className="font-medium">{format(t.dataInicio, "dd/MM/yyyy", { locale: ptBR })}</span>
              </p>
              <p className="text-sm">
                {t.ativo ? "Encerra em" : "Encerrado em"}{" "}
                <span className="font-medium">{format(t.dataFim, "dd/MM/yyyy", { locale: ptBR })}</span>
              </p>
              {t.ativo ? (
                <Badge className="bg-green-100 text-green-700 border-green-200 mt-1">Ativo</Badge>
              ) : (
                <Badge variant="outline" className="mt-1">Encerrado</Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
