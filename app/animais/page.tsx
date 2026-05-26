"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useData } from "@/components/data-provider"
import { Modal } from "@/components/modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table"
import type { Animal, Lote } from "@/lib/types"

const ANIMAL_STATUS = ["GESTANTE", "LACTANDO", "VAZIA", "EM_PROTOCOLO", "INSEMINADA", "DESCARTE"] as const
const STATUS_LABEL: Record<string, string> = {
  GESTANTE: "Gestante", LACTANDO: "Lactando", VAZIA: "Vazia",
  EM_PROTOCOLO: "Em Protocolo", INSEMINADA: "Inseminada", DESCARTE: "Descarte",
}

function StatusBadge({ status }: { status: string }) {
  if (status === "GESTANTE")    return <Badge className="bg-blue-100 text-blue-700 border-blue-200">{STATUS_LABEL[status]}</Badge>
  if (status === "LACTANDO")    return <Badge className="bg-teal-100 text-teal-700 border-teal-200">{STATUS_LABEL[status]}</Badge>
  if (status === "VAZIA")       return <Badge variant="outline">{STATUS_LABEL[status]}</Badge>
  if (status === "EM_PROTOCOLO")return <Badge className="bg-purple-100 text-purple-700 border-purple-200">{STATUS_LABEL[status]}</Badge>
  if (status === "INSEMINADA")  return <Badge className="bg-amber-100 text-amber-700 border-amber-200">{STATUS_LABEL[status]}</Badge>
  if (status === "DESCARTE")    return <Badge variant="destructive">{STATUS_LABEL[status]}</Badge>
  return <Badge>{status}</Badge>
}

type FormState = {
  idEtiqueta: string; nome: string; loteId: string; status: string
  dataNascimento: string; dataUltimoParto: string; dataPartoEstimado: string
  emLactacao: boolean; pesoKg: string; raca: string
}

const EMPTY_FORM: FormState = {
  idEtiqueta: "", nome: "", loteId: "", status: "VAZIA",
  dataNascimento: "", dataUltimoParto: "", dataPartoEstimado: "",
  emLactacao: false, pesoKg: "", raca: "",
}

function animalToForm(a: Animal): FormState {
  return {
    idEtiqueta: a.idEtiqueta,
    nome: a.nome ?? "",
    loteId: a.loteId,
    status: a.status,
    dataNascimento: a.dataNascimento.toISOString().split("T")[0],
    dataUltimoParto: a.dataUltimoParto?.toISOString().split("T")[0] ?? "",
    dataPartoEstimado: a.dataPartoEstimado?.toISOString().split("T")[0] ?? "",
    emLactacao: a.emLactacao,
    pesoKg: a.pesoKg != null ? String(a.pesoKg) : "",
    raca: a.raca ?? "",
  }
}

function formToAnimal(form: FormState, lotes: Lote[]): Omit<Animal, "id"> {
  return {
    idEtiqueta: form.idEtiqueta.trim(),
    nome: form.nome.trim() || null,
    loteId: form.loteId,
    lote: lotes.find(l => l.id === form.loteId)?.nome ?? "",
    status: form.status,
    dataNascimento: new Date(form.dataNascimento + "T12:00:00"),
    dataUltimoParto: form.dataUltimoParto ? new Date(form.dataUltimoParto + "T12:00:00") : null,
    dataPartoEstimado: form.dataPartoEstimado ? new Date(form.dataPartoEstimado + "T12:00:00") : null,
    emLactacao: form.emLactacao,
    pesoKg: form.pesoKg ? Number(form.pesoKg) : null,
    raca: form.raca.trim() || null,
  }
}

const INPUT = "w-full border rounded-md px-3 py-1.5 text-sm bg-background"
const LABEL = "text-xs font-medium text-muted-foreground"

function AnimalForm({ form, setForm, lotes, onSubmit, onCancel, submitLabel }: {
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  lotes: Lote[]
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
          <label className={LABEL}>Etiqueta *</label>
          <input required value={form.idEtiqueta} onChange={f("idEtiqueta")} className={INPUT} placeholder="Ex: 0011" />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Nome</label>
          <input value={form.nome} onChange={f("nome")} className={INPUT} placeholder="Opcional" />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Lote *</label>
          <select required value={form.loteId} onChange={f("loteId")} className={INPUT}>
            <option value="">Selecione...</option>
            {lotes.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Status</label>
          <select value={form.status} onChange={f("status")} className={INPUT}>
            {ANIMAL_STATUS.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Nascimento *</label>
          <input required type="date" value={form.dataNascimento} onChange={f("dataNascimento")} className={INPUT} />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Raça</label>
          <input value={form.raca} onChange={f("raca")} className={INPUT} placeholder="Ex: Nelore" />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Último Parto</label>
          <input type="date" value={form.dataUltimoParto} onChange={f("dataUltimoParto")} className={INPUT} />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Parto Estimado</label>
          <input type="date" value={form.dataPartoEstimado} onChange={f("dataPartoEstimado")} className={INPUT} />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Peso (kg)</label>
          <input type="number" min="0" step="0.1" value={form.pesoKg} onChange={f("pesoKg")} className={INPUT} />
        </div>
        <div className="flex items-center gap-2 pt-4">
          <input
            id="lactacao"
            type="checkbox"
            checked={form.emLactacao}
            onChange={e => setForm(prev => ({ ...prev, emLactacao: e.target.checked }))}
            className="h-4 w-4"
          />
          <label htmlFor="lactacao" className="text-sm">Em lactação</label>
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-2 border-t border-border">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" size="sm">{submitLabel}</Button>
      </div>
    </form>
  )
}

export default function AnimaisPage() {
  const { animais, lotes, loading, addAnimal, updateAnimal, deleteAnimal } = useData()
  const [modal, setModal] = useState<"none" | "create" | "edit">("none")
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Carregando...</div>

  function openCreate() { setForm(EMPTY_FORM); setModal("create") }
  function openEdit(a: Animal) { setEditId(a.id); setForm(animalToForm(a)); setModal("edit") }
  function closeModal() { setModal("none"); setEditId(null) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = formToAnimal(form, lotes)
    if (modal === "create") await addAnimal(data)
    else if (modal === "edit" && editId) await updateAnimal(editId, data)
    closeModal()
  }

  async function handleDelete(id: string) {
    await deleteAnimal(id)
    setDeleteConfirmId(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Animais</h1>
          <p className="text-muted-foreground text-sm mt-1">{animais.length} animais cadastrados</p>
        </div>
        <Button size="sm" onClick={openCreate}>+ Novo Animal</Button>
      </div>

      <Modal open={modal !== "none"} onClose={closeModal} title={modal === "create" ? "Novo Animal" : "Editar Animal"}>
        <AnimalForm form={form} setForm={setForm} lotes={lotes} onSubmit={handleSubmit} onCancel={closeModal} submitLabel={modal === "create" ? "Criar Animal" : "Salvar"} />
      </Modal>

      <div className="rounded-xl ring-1 ring-foreground/10 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Etiqueta</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Nascimento</TableHead>
              <TableHead>Parto Estimado</TableHead>
              <TableHead>Lactando</TableHead>
              <TableHead className="w-36"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {animais.map((animal) => (
              <TableRow key={animal.id}>
                <TableCell><span className="font-mono font-medium">{animal.idEtiqueta}</span></TableCell>
                <TableCell>{animal.nome ?? "—"}</TableCell>
                <TableCell>{animal.lote}</TableCell>
                <TableCell><StatusBadge status={animal.status} /></TableCell>
                <TableCell>{format(animal.dataNascimento, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                <TableCell>{animal.dataPartoEstimado ? format(animal.dataPartoEstimado, "dd/MM/yyyy", { locale: ptBR }) : "—"}</TableCell>
                <TableCell>
                  {animal.emLactacao
                    ? <span className="text-teal-600 font-medium">✓</span>
                    : <span className="text-muted-foreground">—</span>}
                </TableCell>
                <TableCell>
                  {deleteConfirmId === animal.id ? (
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-muted-foreground">Excluir?</span>
                      <button onClick={() => handleDelete(animal.id)} className="text-red-600 font-medium px-1.5 py-0.5 rounded hover:bg-red-50">Sim</button>
                      <button onClick={() => setDeleteConfirmId(null)} className="text-muted-foreground px-1.5 py-0.5 rounded hover:bg-muted">Não</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <Link href={`/animais/${animal.id}`} className="text-green-600 hover:text-green-700 font-medium hover:underline">Ver</Link>
                      <button onClick={() => openEdit(animal)} className="text-blue-600 hover:text-blue-700">Editar</button>
                      <button onClick={() => setDeleteConfirmId(animal.id)} className="text-red-400 hover:text-red-600">✕</button>
                    </div>
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
