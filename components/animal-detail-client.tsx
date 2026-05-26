"use client"

import { useState } from "react"
import Link from "next/link"
import { format, differenceInYears } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useData } from "@/components/data-provider"
import { Modal } from "@/components/modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AnimalTimeline } from "@/components/animal-timeline"

type Via = "INTRAMUSCULAR" | "SUBCUTANEA" | "ORAL" | "TOPICA"
type StatusType = "GESTANTE" | "LACTANDO" | "VAZIA" | "EM_PROTOCOLO" | "INSEMINADA" | "DESCARTE"
type TipoEvento = "IMPLANTE_HORMONAL" | "INSEMINACAO_IATF" | "DIAGNOSTICO_PRENHEZ" | "PARTO" | "ABORTO" | "DESCARTE"

const ANIMAL_STATUS: StatusType[] = ["GESTANTE", "LACTANDO", "VAZIA", "EM_PROTOCOLO", "INSEMINADA", "DESCARTE"]
const STATUS_LABEL: Record<StatusType, string> = {
  GESTANTE: "Gestante", LACTANDO: "Lactando", VAZIA: "Vazia",
  EM_PROTOCOLO: "Em Protocolo", INSEMINADA: "Inseminada", DESCARTE: "Descarte",
}
const EVENTO_TIPOS: TipoEvento[] = ["IMPLANTE_HORMONAL", "INSEMINACAO_IATF", "DIAGNOSTICO_PRENHEZ", "PARTO", "ABORTO", "DESCARTE"]
const EVENTO_LABEL: Record<TipoEvento, string> = {
  IMPLANTE_HORMONAL: "Implante Hormonal", INSEMINACAO_IATF: "Inseminação IATF",
  DIAGNOSTICO_PRENHEZ: "Diagnóstico de Prenhez", PARTO: "Parto",
  ABORTO: "Aborto", DESCARTE: "Descarte",
}

const INPUT = "w-full border rounded-md px-3 py-1.5 text-sm bg-background"
const LABEL = "text-xs font-medium text-muted-foreground"

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

type EditForm = {
  status: string; dataNascimento: string; dataUltimoParto: string
  dataPartoEstimado: string; emLactacao: boolean; pesoKg: string; raca: string
}

type EventoForm = {
  tipo: TipoEvento; data: string; resultado: string; obs: string
}

const EMPTY_EVENTO: EventoForm = {
  tipo: "INSEMINACAO_IATF", data: new Date().toISOString().split("T")[0], resultado: "", obs: "",
}

export function AnimalDetailClient({ id }: { id: string }) {
  const {
    loading, getAnimalById, getBezerrosByMae, getEventosByAnimal,
    medicamentos, lotes,
    getAplicacoesByAnimal, addAplicacao, removeAplicacao, moveAnimalToLote,
    updateAnimal, addEvento, deleteEvento,
  } = useData()
  const animal = getAnimalById(id)

  const [showForm,      setShowForm]      = useState(false)
  const [form,          setForm]          = useState(EMPTY_FORM)
  const [showMove,      setShowMove]      = useState(false)
  const [novoLoteId,    setNovoLoteId]    = useState("")
  const [showEditAnimal, setShowEditAnimal] = useState(false)
  const [editForm,      setEditForm]      = useState<EditForm | null>(null)
  const [showEventoForm, setShowEventoForm] = useState(false)
  const [eventoForm,    setEventoForm]    = useState<EventoForm>(EMPTY_EVENTO)

  if (loading) {
    return <div className="p-4 md:p-6 text-sm text-muted-foreground">Carregando...</div>
  }

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

  const loteAtual = { loteId: animal.loteId, lote: animal.lote }
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

  function openEditAnimal() {
    if (!animal) return
    setEditForm({
      status: animal.status,
      dataNascimento: animal.dataNascimento.toISOString().split("T")[0],
      dataUltimoParto: animal.dataUltimoParto?.toISOString().split("T")[0] ?? "",
      dataPartoEstimado: animal.dataPartoEstimado?.toISOString().split("T")[0] ?? "",
      emLactacao: animal.emLactacao,
      pesoKg: animal.pesoKg != null ? String(animal.pesoKg) : "",
      raca: animal.raca ?? "",
    })
    setShowEditAnimal(true)
  }

  async function handleSubmitEditAnimal(e: React.FormEvent) {
    e.preventDefault()
    if (!animal || !editForm) return
    await updateAnimal(id, {
      idEtiqueta: animal.idEtiqueta,
      nome: animal.nome,
      loteId: animal.loteId,
      lote: animal.lote,
      status: editForm.status,
      dataNascimento: new Date(editForm.dataNascimento + "T12:00:00"),
      dataUltimoParto: editForm.dataUltimoParto ? new Date(editForm.dataUltimoParto + "T12:00:00") : null,
      dataPartoEstimado: editForm.dataPartoEstimado ? new Date(editForm.dataPartoEstimado + "T12:00:00") : null,
      emLactacao: editForm.emLactacao,
      pesoKg: editForm.pesoKg ? Number(editForm.pesoKg) : null,
      raca: editForm.raca || null,
    })
    setShowEditAnimal(false)
  }

  async function handleSubmitEvento(e: React.FormEvent) {
    e.preventDefault()
    if (!animal) return
    await addEvento({
      animalId: id,
      etiqueta: animal.idEtiqueta,
      tipo: eventoForm.tipo,
      data: new Date(eventoForm.data + "T12:00:00"),
      veterinarioId: null,
      resultado: eventoForm.resultado || null,
      obs: eventoForm.obs || null,
    })
    setEventoForm(EMPTY_EVENTO)
    setShowEventoForm(false)
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
        <Button size="sm" variant="outline" onClick={openEditAnimal}>Editar Animal</Button>
      </div>

      <Modal open={showEditAnimal} onClose={() => setShowEditAnimal(false)} title="Editar Animal">
        {editForm && (
          <form onSubmit={handleSubmitEditAnimal} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <label className={LABEL}>Status</label>
                <select value={editForm.status} onChange={e => setEditForm(f => f && ({ ...f, status: e.target.value }))} className={INPUT}>
                  {ANIMAL_STATUS.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className={LABEL}>Nascimento</label>
                <input type="date" value={editForm.dataNascimento} onChange={e => setEditForm(f => f && ({ ...f, dataNascimento: e.target.value }))} className={INPUT} />
              </div>
              <div className="space-y-1">
                <label className={LABEL}>Raça</label>
                <input value={editForm.raca} onChange={e => setEditForm(f => f && ({ ...f, raca: e.target.value }))} className={INPUT} placeholder="Ex: Nelore" />
              </div>
              <div className="space-y-1">
                <label className={LABEL}>Último Parto</label>
                <input type="date" value={editForm.dataUltimoParto} onChange={e => setEditForm(f => f && ({ ...f, dataUltimoParto: e.target.value }))} className={INPUT} />
              </div>
              <div className="space-y-1">
                <label className={LABEL}>Parto Estimado</label>
                <input type="date" value={editForm.dataPartoEstimado} onChange={e => setEditForm(f => f && ({ ...f, dataPartoEstimado: e.target.value }))} className={INPUT} />
              </div>
              <div className="space-y-1">
                <label className={LABEL}>Peso (kg)</label>
                <input type="number" min="0" step="0.1" value={editForm.pesoKg} onChange={e => setEditForm(f => f && ({ ...f, pesoKg: e.target.value }))} className={INPUT} />
              </div>
              <div className="flex items-center gap-2 pt-3">
                <input id="edit-lactacao" type="checkbox" checked={editForm.emLactacao} onChange={e => setEditForm(f => f && ({ ...f, emLactacao: e.target.checked }))} className="h-4 w-4" />
                <label htmlFor="edit-lactacao" className="text-sm">Em lactação</label>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowEditAnimal(false)}>Cancelar</Button>
              <Button type="submit" size="sm">Salvar</Button>
            </div>
          </form>
        )}
      </Modal>

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
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Histórico</CardTitle>
                <button
                  onClick={() => setShowEventoForm(v => !v)}
                  className="text-xs px-3 py-1.5 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  {showEventoForm ? "Cancelar" : "+ Evento"}
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {showEventoForm && (
                <form onSubmit={handleSubmitEvento} className="rounded-lg border p-3 space-y-3 bg-muted/30">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Novo Evento Reprodutivo</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1 col-span-2">
                      <label className={LABEL}>Tipo *</label>
                      <select
                        value={eventoForm.tipo}
                        onChange={e => setEventoForm(f => ({ ...f, tipo: e.target.value as TipoEvento }))}
                        className={INPUT}
                      >
                        {EVENTO_TIPOS.map(t => <option key={t} value={t}>{EVENTO_LABEL[t]}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className={LABEL}>Data *</label>
                      <input required type="date" value={eventoForm.data} onChange={e => setEventoForm(f => ({ ...f, data: e.target.value }))} className={INPUT} />
                    </div>
                    <div className="space-y-1">
                      <label className={LABEL}>Resultado</label>
                      <input value={eventoForm.resultado} onChange={e => setEventoForm(f => ({ ...f, resultado: e.target.value }))} className={INPUT} placeholder="Positivo / Negativo" />
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className={LABEL}>Observação</label>
                      <input value={eventoForm.obs} onChange={e => setEventoForm(f => ({ ...f, obs: e.target.value }))} className={INPUT} placeholder="Opcional" />
                    </div>
                  </div>
                  <button type="submit" className="w-full text-sm py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                    Salvar Evento
                  </button>
                </form>
              )}
              <AnimalTimeline eventos={eventos} aplicacoes={aplicacoesForTimeline} onDeleteEvento={deleteEvento} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
