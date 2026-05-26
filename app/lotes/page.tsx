"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useData } from "@/components/data-provider"
import { Modal } from "@/components/modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { Lote } from "@/lib/types"

const LOTE_STATUS = ["ABERTO", "EM_MONTA", "GESTACAO", "PARTO", "ENCERRADO"] as const
const STATUS_LABEL: Record<string, string> = {
  ABERTO: "Aberto", EM_MONTA: "Em monta", GESTACAO: "Gestação", PARTO: "Parto", ENCERRADO: "Encerrado",
}

function statusBadge(status: string) {
  switch (status) {
    case "ABERTO":    return <Badge variant="outline" className="text-gray-600 border-gray-400">Aberto</Badge>
    case "EM_MONTA":  return <Badge className="bg-blue-500 hover:bg-blue-600">Em monta</Badge>
    case "GESTACAO":  return <Badge className="bg-purple-500 hover:bg-purple-600">Gestação</Badge>
    case "PARTO":     return <Badge className="bg-amber-500 hover:bg-amber-600">Parto</Badge>
    case "ENCERRADO": return <Badge variant="secondary">Encerrado</Badge>
    default:          return <Badge variant="outline">{status}</Badge>
  }
}

function borderTopClass(status: string) {
  switch (status) {
    case "PARTO":     return "border-t-amber-500"
    case "EM_MONTA":  return "border-t-blue-500"
    case "GESTACAO":  return "border-t-purple-500"
    case "ENCERRADO": return "border-t-gray-400"
    default:          return "border-t-green-500"
  }
}

type FormState = {
  nome: string; tipo: string; status: string; dataAbertura: string
  touro: string; totalVacas: string; gestantes: string
  paridasNoMes: string; bezerrosVivos: string; desmamados: string
}

const EMPTY_FORM: FormState = {
  nome: "", tipo: "CRIA", status: "ABERTO", dataAbertura: new Date().toISOString().split("T")[0],
  touro: "", totalVacas: "0", gestantes: "0", paridasNoMes: "0", bezerrosVivos: "0", desmamados: "0",
}

function loteToForm(l: Lote): FormState {
  return {
    nome: l.nome, tipo: l.tipo, status: l.status,
    dataAbertura: l.dataAbertura.toISOString().split("T")[0],
    touro: l.touro ?? "",
    totalVacas: String(l.totalVacas), gestantes: String(l.gestantes),
    paridasNoMes: String(l.paridasNoMes), bezerrosVivos: String(l.bezerrosVivos),
    desmamados: String(l.desmamados),
  }
}

function formToLote(form: FormState, existing?: Lote): Omit<Lote, "id"> {
  return {
    nome: form.nome.trim(),
    tipo: form.tipo.trim(),
    status: form.status,
    dataAbertura: new Date(form.dataAbertura + "T12:00:00"),
    dataFechamento: existing?.dataFechamento ?? null,
    touro: form.touro.trim(),
    totalVacas: Number(form.totalVacas) || 0,
    gestantes: Number(form.gestantes) || 0,
    paridasNoMes: Number(form.paridasNoMes) || 0,
    bezerrosVivos: Number(form.bezerrosVivos) || 0,
    desmamados: Number(form.desmamados) || 0,
    encarregados: existing?.encarregados ?? [],
  }
}

const INPUT = "w-full border rounded-md px-3 py-1.5 text-sm bg-background"
const LABEL = "text-xs font-medium text-muted-foreground"

function LoteForm({ form, setForm, onSubmit, onCancel, submitLabel }: {
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  submitLabel: string
}) {
  const f = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className={LABEL}>Nome do Lote *</label>
          <input required value={form.nome} onChange={f("nome")} className={INPUT} placeholder="Ex: Lote A" />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Tipo</label>
          <input value={form.tipo} onChange={f("tipo")} className={INPUT} placeholder="Ex: CRIA, RECRIA" />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Status</label>
          <select value={form.status} onChange={f("status")} className={INPUT}>
            {LOTE_STATUS.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Data Abertura</label>
          <input type="date" value={form.dataAbertura} onChange={f("dataAbertura")} className={INPUT} />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className={LABEL}>Touro</label>
          <input value={form.touro} onChange={f("touro")} className={INPUT} placeholder="Nome do touro" />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Total de Vacas</label>
          <input type="number" min="0" value={form.totalVacas} onChange={f("totalVacas")} className={INPUT} />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Gestantes</label>
          <input type="number" min="0" value={form.gestantes} onChange={f("gestantes")} className={INPUT} />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Partos este mês</label>
          <input type="number" min="0" value={form.paridasNoMes} onChange={f("paridasNoMes")} className={INPUT} />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Bezerros vivos</label>
          <input type="number" min="0" value={form.bezerrosVivos} onChange={f("bezerrosVivos")} className={INPUT} />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Desmamados</label>
          <input type="number" min="0" value={form.desmamados} onChange={f("desmamados")} className={INPUT} />
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-2 border-t border-border">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" size="sm">{submitLabel}</Button>
      </div>
    </form>
  )
}

export default function LotesPage() {
  const { lotes, loading, addLote, updateLote, deleteLote } = useData()
  const [modal, setModal] = useState<"none" | "create" | "edit">("none")
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Carregando...</div>

  function openCreate() { setForm(EMPTY_FORM); setModal("create") }
  function openEdit(l: Lote) { setEditId(l.id); setForm(loteToForm(l)); setModal("edit") }
  function closeModal() { setModal("none"); setEditId(null) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const existing = editId ? lotes.find(l => l.id === editId) : undefined
    const data = formToLote(form, existing)
    if (modal === "create") await addLote(data)
    else if (modal === "edit" && editId) await updateLote(editId, data)
    closeModal()
  }

  async function handleDelete(id: string) {
    await deleteLote(id)
    setDeleteConfirmId(null)
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Lotes</h1>
        <Button size="sm" onClick={openCreate}>+ Novo Lote</Button>
      </div>

      <Modal open={modal !== "none"} onClose={closeModal} title={modal === "create" ? "Novo Lote" : "Editar Lote"}>
        <LoteForm form={form} setForm={setForm} onSubmit={handleSubmit} onCancel={closeModal} submitLabel={modal === "create" ? "Criar Lote" : "Salvar"} />
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lotes.map((lote) => (
          <Card key={lote.id} className={cn("border-t-4", borderTopClass(lote.status))}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base font-semibold">{lote.nome}</CardTitle>
                {statusBadge(lote.status)}
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-bold">{lote.totalVacas}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Vacas</p>
                </div>
                <div className="rounded-md bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-bold">{lote.gestantes}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Gestantes</p>
                </div>
                <div className="rounded-md bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-bold">{lote.paridasNoMes}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Partos este mês</p>
                </div>
                <div className="rounded-md bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-bold">{lote.bezerrosVivos}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Bezerros vivos</p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <span><span className="font-medium text-foreground">Touro:</span> {lote.touro || "—"}</span>
                <span>
                  <span className="font-medium text-foreground">Aberto:</span>{" "}
                  {format(lote.dataAbertura, "dd/MM/yyyy", { locale: ptBR })}
                </span>
              </div>
            </CardContent>

            <CardFooter className="gap-2">
              <Link
                href={`/lotes/${lote.id}`}
                className="flex-1 text-center text-sm border border-border rounded-md px-3 py-1.5 hover:bg-muted transition-colors"
              >
                Ver detalhes →
              </Link>
              <button
                onClick={() => openEdit(lote)}
                className="text-sm px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors text-blue-600"
              >
                Editar
              </button>
              {deleteConfirmId === lote.id ? (
                <div className="flex items-center gap-1 text-xs">
                  <button onClick={() => handleDelete(lote.id)} className="text-red-600 font-medium px-1.5 py-1 rounded hover:bg-red-50 border border-red-200">Excluir</button>
                  <button onClick={() => setDeleteConfirmId(null)} className="text-muted-foreground px-1.5 py-1 rounded hover:bg-muted border border-border">Não</button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirmId(lote.id)}
                  className="text-sm px-3 py-1.5 rounded-md border border-border hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-muted-foreground"
                >
                  ✕
                </button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
