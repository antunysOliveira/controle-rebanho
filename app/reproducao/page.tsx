"use client"

import { useMemo } from "react"
import { useData } from "@/components/data-provider"
import { format, addDays, differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { IATFStepper } from "@/components/iatf-stepper"
import type { EventoReprodutivo } from "@/lib/types"

type EtapaProtocolo = "implante_hormonal" | "inseminacao_iatf" | "aguardando_diagnostico"

export default function ReproducaoPage() {
  const { animais, eventosReprodutivos, veterinarios, lotes, loading } = useData()
  const hoje = useMemo(() => new Date(), [])

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
          etapaAtual = differenceInDays(hoje, inseminacao.data) >= 28
            ? "aguardando_diagnostico"
            : "inseminacao_iatf"
        }

        const vetId = implante.veterinarioId ?? inseminacao?.veterinarioId
        const vet   = vetId ? veterinarios.find(v => v.id === vetId) : undefined

        return [{ idEtiqueta: a.idEtiqueta, nome: a.nome, lote: a.lote, etapaAtual, dataImplante, dataInseminacao, dataDiagnostico, veterinario: vet?.nome }]
      })
  }, [animais, eventosReprodutivos, veterinarios, hoje])

  const diagnosticosPendentes = useMemo(() => {
    return animais
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

        return [{ idEtiqueta: a.idEtiqueta, nome: a.nome, dataInseminacao: inseminacao.data, diasAguardando: differenceInDays(hoje, inseminacao.data), lote: a.lote }]
      })
      .sort((a, b) => b.diasAguardando - a.diasAguardando)
  }, [animais, eventosReprodutivos, hoje])

  const repasseTouros = useMemo(() => {
    return lotes
      .filter(l => l.touro)
      .map(l => ({
        nome: l.touro,
        lote: l.nome,
        dataInicio: l.dataAbertura,
        dataFim: l.dataFechamento ?? addDays(l.dataAbertura, 365),
        ativo: l.status !== "ENCERRADO",
      }))
  }, [lotes])

  if (loading) return <div className="p-4 md:p-6 text-sm text-muted-foreground">Carregando...</div>

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Controle Reprodutivo</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Protocolos, diagnósticos e repasse de touro
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle>Protocolos IATF Ativos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {vacasEmProtocolo.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum protocolo ativo.</p>
            ) : (
              vacasEmProtocolo.map((p) => (
                <div key={p.idEtiqueta} className="rounded-lg border p-3 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-semibold text-sm">{p.idEtiqueta}</span>
                    {p.nome && <span className="text-sm text-muted-foreground">{p.nome}</span>}
                    <span className="text-xs text-muted-foreground">{p.lote}</span>
                  </div>
                  <IATFStepper
                    etapaAtual={p.etapaAtual}
                    dataImplante={p.dataImplante}
                    dataInseminacao={p.dataInseminacao}
                    dataDiagnostico={p.dataDiagnostico}
                  />
                  {p.veterinario && (
                    <p className="text-xs text-muted-foreground">{p.veterinario}</p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-violet-500">
          <CardHeader>
            <CardTitle>Diagnósticos Pendentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {diagnosticosPendentes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum diagnóstico pendente.</p>
            ) : (
              diagnosticosPendentes.map((d) => (
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

      <Card className="border-l-4 border-l-amber-500">
        <CardHeader>
          <CardTitle>Repasse de Touro</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {repasseTouros.map((t) => (
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
