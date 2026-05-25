"use client"

import { useState } from "react"
import Link from "next/link"
import { format, differenceInYears } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  lotes,
  medicamentos,
  getAnimalById,
  getBezerrosByMae,
  getEventosByAnimal,
} from "@/lib/mock/data"
import { useData } from "@/components/data-provider"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AnimalTimeline } from "@/components/animal-timeline"

type Via = "INTRAMUSCULAR" | "SUBCUTANEA" | "ORAL" | "TOPICA"
type StatusType = "GESTANTE" | "LACTANDO" | "VAZIA" | "EM_PROTOCOLO" | "INSEMINADA" | "DESCARTE"

const statusLabel: Record<StatusType, string> = {
  GESTANTE: "Gestante", LACTANDO: "Lactando", VAZIA: "Vazia",
  EM_PROTOCOLO: "Em Protocolo", INSEMINADA: "Inseminada", DESCARTE: "Descarte",
}

const VIA_OPTIONS: { value: Via; label: string }[] = [
  { value: "INTRAMUSCULAR", label: "Intramuscular (IM)" },
  { value: "SUBCUTANEA",    label: "Subcutânea (SC)" },
  { value: "ORAL",          label: "Oral" },
  { value: "TOPICA",        label: "Tópica" },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    GESTANTE:    "bg-blue-100 text-blue-700 border-blue-200",
    LACTANDO:    "bg-teal-100 text-teal-700 border-teal-200",
    EM_PROTOCOLO:"bg-purple-100 text-purple-700 border-purple-200",
    INSEMINADA:  "bg-amber-100 text-amber-700 border-amber-200",
  }
  if (status === "VAZIA")    return <Badge variant="outline">{statusLabel[status as StatusType]}</Badge>
  if (status === "DESCARTE") return <Badge variant="destructive">{statusLabel[status as StatusType]}</Badge>
  const cls = map[status]
  if (cls) return <Badge className={cls}>{statusLabel[status as StatusType]}</Badge>
  return <Badge>{status}</Badge>
}

const EMPTY_FORM = {
  medicamentoId: "",
  doseAplicada:  "",
  via:           "INTRAMUSCULAR" as Via,
  data:          new Date().toISOString().split("T")[0],
  responsavel:   "",
  motivo:        "",
  carenciaDias:  "0",
  proximaDose:   "",
}

export function AnimalDetailClient({ id }: { id: string }) {
  const animal = getAnimalById(id)
  const { getAplicacoesByAnimal, addAplicacao, removeAplicacao, getAnimalLote, moveAnimalToLote } = useData()

  const [showForm,   setShowForm]   = useState(false)
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [showMove,   setShowMove]   = useState(false)
  const [novoLoteId, setNovoLoteId] = useState("")

  if (!animal) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <Link href="/animais" className="text-sm text-muted-foreground hover:text-green-600 hover:underline">
          ← Animais
        </Link>
        <p className="text-sm text-muted-foreground">Animal não encontrado.</p>
      </div>
    )
  }

  const loteOverride   = getAnimalLote(id)
  const loteAtual      = loteOverride ?? { loteId: animal.loteId, lote: animal.lote }
  const aplicacoes     = getAplicacoesByAnimal(id)
  const bezerros       = getBezerrosByMae(animal.id)
  const eventos        = getEventosByAnimal(animal.id)
  const idade          = differenceInYears(new Date(), animal.dataNascimento)

  const proximasDoses = aplicacoes
    .filter((a) => a.proximaDose)
    .map((a) => ({ ...a, proximaDoseDate: new Date(a.proximaDose!) }))
    .sort((a, b) => a.proximaDoseDate.getTime() - b.proximaDoseDate.getTime())

  const aplicacoesForTimeline = aplicacoes.map((a) => ({
    id:           a.id,
    medicamento:  a.medicamento,
    doseAplicada: a.doseAplicada,
    via:          a.via,
    data:         new Date(a.data),
    motivo:       a.motivo,
    carenciaDias: a.carenciaDias,
    proximaDose:  a.proximaDose ? new Date(a.proximaDose) : undefined,
  }))

  function handleMedChange(medId: string) {
    const med = medicamentos.find((m) => m.id === medId)
    setForm((f) => ({
      ...f,
      medicamentoId: medId,
      doseAplicada:  med ? String(med.dosePadrao) : "",
      carenciaDias:  "0",
    }))
  }

  function handleSubmitAplicacao(e: React.FormEvent) {
    e.preventDefault()
    if (!form.medicamentoId || !form.data) return
    const med = medicamentos.find((m) => m.id === form.medicamentoId)!
    addAplicacao({
      animalId:      id,
      etiqueta:      animal!.idEtiqueta,
      medicamentoId: form.medicamentoId,
      medicamento:   med.nome,
      doseAplicada:  Number(form.doseAplicada) || med.dosePadrao,
      via:           form.via,
      data:          form.data,
      responsavel:   form.responsavel,
      motivo:        form.motivo,
      carenciaDias:  Number(form.carenciaDias) || 0,
      proximaDose:   form.proximaDose || undefined,
    })
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  function handleSubmitMove(e: React.FormEvent) {
    e.preventDefault()
    if (!novoLoteId) return
    const lote = lotes.find((l) => l.id === novoLoteId)!
    moveAnimalToLote(id, novoLoteId, lote.nome)
    setShowMove(false)
    setNovoLoteId("")
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/animais" className="hover:text-green-600 hover:underline">← Animais</Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight font-mono">#{animal.idEtiqueta}</h1>
        {animal.nome && <span className="text-xl font-semibold">{animal.nome}</span>}
        <StatusBadge status={animal.status} />
        <Badge variant="secondary">{loteAtual.lote}</Badge>
        {loteOverride && (
          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Lote alterado</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Coluna esquerda ─────────────────────────────── */}
        <div className="space-y-6">

          {/* Informações + mover lote */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader><CardTitle>Informações</CardTitle></CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">

                <div className="flex justify-between items-start">
                  <dt className="text-muted-foreground">Lote</dt>
                  <dd className="text-right space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{loteAtual.lote}</span>
                      <button
                        onClick={() => setShowMove((v) => !v)}
                        className="text-xs text-green-600 hover:text-green-700 underline"
                      >
                        {showMove ? "Cancelar" : "Mover"}
                      </button>
                    </div>
                    {showMove && (
                      <form onSubmit={handleSubmitMove} className="rounded-lg border p-3 space-y-2 text-left">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Mover para lote
                        </p>
                        <select
                          value={novoLoteId}
                          onChange={(e) => setNovoLoteId(e.target.value)}
                          className="w-full text-sm rounded border bg-background px-2 py-1.5"
                        >
                          <option value="">Selecione...</option>
                          {lotes
                            .filter((l) => l.id !== loteAtual.loteId)
                            .map((l) => (
                              <option key={l.id} value={l.id}>{l.nome}</option>
                            ))}
                        </select>
                        <button
                          type="submit"
                          disabled={!novoLoteId}
                          className="w-full text-sm py-1.5 rounded bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-40 transition-colors"
                        >
                          Confirmar mudança
                        </button>
                      </form>
                    )}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Nascimento</dt>
                  <dd className="font-medium">
                    {format(animal.dataNascimento, "dd/MM/yyyy", { locale: ptBR })}{" "}
                    <span className="text-muted-foreground font-normal">
                      ({idade} {idade === 1 ? "ano" : "anos"})
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Último Parto</dt>
                  <dd className="font-medium">
                    {animal.dataUltimoParto
                      ? format(animal.dataUltimoParto, "dd/MM/yyyy", { locale: ptBR })
                      : "—"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Parto Estimado</dt>
                  <dd className="font-medium">
                    {animal.dataPartoEstimado
                      ? format(animal.dataPartoEstimado, "dd/MM/yyyy", { locale: ptBR })
                      : "—"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Em Lactação</dt>
                  <dd className="font-medium">
                    {animal.emLactacao
                      ? <span className="text-teal-600">Sim</span>
                      : <span className="text-muted-foreground">Não</span>}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Próximas doses agendadas */}
          {proximasDoses.length > 0 && (
            <Card className="border-l-4 border-l-rose-400">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Próximas Doses Agendadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {proximasDoses.map((a) => (
                  <div key={a.id} className="flex items-center justify-between text-sm border-b last:border-0 pb-2 last:pb-0">
                    <span className="font-medium">{a.medicamento}</span>
                    <Badge className="bg-rose-100 text-rose-700 border-rose-200" variant="outline">
                      {format(a.proximaDoseDate, "dd/MM/yyyy", { locale: ptBR })}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Bezerros */}
          <Card className="border-l-4 border-l-teal-500">
            <CardHeader><CardTitle>Bezerros</CardTitle></CardHeader>
            <CardContent>
              {bezerros.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum bezerro registrado.</p>
              ) : (
                <ul className="space-y-3">
                  {bezerros.map((b) => (
                    <li key={b.idEtiqueta} className="flex items-start justify-between text-sm border-b last:border-0 pb-3 last:pb-0">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">{b.idEtiqueta}</span>
                          <span className="text-base leading-none">{b.sexo === "M" ? "♂" : "♀"}</span>
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {format(b.dataNascimento, "dd/MM/yyyy", { locale: ptBR })} · {b.pesoAtual} kg
                        </div>
                      </div>
                      <Badge className={b.status === "MAMANDO" ? "bg-teal-100 text-teal-700 border-teal-200" : "bg-gray-100 text-gray-600 border-gray-200"}>
                        {b.status === "MAMANDO" ? "Mamando" : "Desmamado"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Coluna direita ──────────────────────────────── */}
        <div className="space-y-6">

          {/* Aplicações: lista + formulário */}
          <Card className="border-l-4 border-l-rose-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Aplicações de Medicamentos</CardTitle>
                <button
                  onClick={() => setShowForm((v) => !v)}
                  className="text-xs px-3 py-1.5 rounded bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                >
                  {showForm ? "Cancelar" : "+ Nova"}
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">

              {/* Formulário */}
              {showForm && (
                <form onSubmit={handleSubmitAplicacao} className="rounded-lg border p-3 space-y-3 bg-muted/30">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nova Aplicação</p>

                  <div className="space-y-1">
                    <label className="text-xs font-medium">Medicamento *</label>
                    <select
                      required
                      value={form.medicamentoId}
                      onChange={(e) => handleMedChange(e.target.value)}
                      className="w-full text-sm rounded border bg-background px-2 py-1.5"
                    >
                      <option value="">Selecione...</option>
                      {medicamentos.map((m) => (
                        <option key={m.id} value={m.id}>{m.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Dose</label>
                      <input
                        type="number" min="0" step="0.1"
                        value={form.doseAplicada}
                        onChange={(e) => setForm((f) => ({ ...f, doseAplicada: e.target.value }))}
                        className="w-full text-sm rounded border bg-background px-2 py-1.5"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Via</label>
                      <select
                        value={form.via}
                        onChange={(e) => setForm((f) => ({ ...f, via: e.target.value as Via }))}
                        className="w-full text-sm rounded border bg-background px-2 py-1.5"
                      >
                        {VIA_OPTIONS.map((v) => (
                          <option key={v.value} value={v.value}>{v.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Data *</label>
                      <input
                        required type="date"
                        value={form.data}
                        onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}
                        className="w-full text-sm rounded border bg-background px-2 py-1.5"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Próxima dose</label>
                      <input
                        type="date"
                        value={form.proximaDose}
                        onChange={(e) => setForm((f) => ({ ...f, proximaDose: e.target.value }))}
                        className="w-full text-sm rounded border bg-background px-2 py-1.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium">Motivo</label>
                    <input
                      type="text"
                      value={form.motivo}
                      onChange={(e) => setForm((f) => ({ ...f, motivo: e.target.value }))}
                      placeholder="Ex: Controle parasitário"
                      className="w-full text-sm rounded border bg-background px-2 py-1.5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Responsável</label>
                      <input
                        type="text"
                        value={form.responsavel}
                        onChange={(e) => setForm((f) => ({ ...f, responsavel: e.target.value }))}
                        className="w-full text-sm rounded border bg-background px-2 py-1.5"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Carência (dias)</label>
                      <input
                        type="number" min="0"
                        value={form.carenciaDias}
                        onChange={(e) => setForm((f) => ({ ...f, carenciaDias: e.target.value }))}
                        className="w-full text-sm rounded border bg-background px-2 py-1.5"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full text-sm py-2 rounded bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                  >
                    Salvar Aplicação
                  </button>
                </form>
              )}

              {/* Lista */}
              {aplicacoes.length === 0 && !showForm ? (
                <p className="text-sm text-muted-foreground">Nenhuma aplicação registrada.</p>
              ) : (
                <div className="space-y-2">
                  {aplicacoes.map((a) => (
                    <div key={a.id} className="flex items-start justify-between text-sm border-b last:border-0 pb-2 last:pb-0 gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{a.medicamento}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(a.data), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {a.doseAplicada} · {a.via}
                          {a.motivo ? ` · ${a.motivo}` : ""}
                          {a.carenciaDias > 0 ? ` · Carência: ${a.carenciaDias}d` : ""}
                        </p>
                        {a.proximaDose && (
                          <p className="text-xs text-rose-600 font-medium">
                            Próxima dose: {format(new Date(a.proximaDose), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeAplicacao(a.id)}
                        className="text-xs text-red-400 hover:text-red-600 shrink-0 px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors"
                        title="Remover aplicação"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Histórico (timeline) */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader><CardTitle>Histórico</CardTitle></CardHeader>
            <CardContent>
              <AnimalTimeline eventos={eventos} aplicacoes={aplicacoesForTimeline} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
