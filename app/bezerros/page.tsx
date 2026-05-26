"use client"

import { useState } from "react"
import { format, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useData } from "@/components/data-provider"
import { Modal } from "@/components/modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { Bezerro, Animal } from "@/lib/types"

const BEZERRO_STATUS = ["MAMANDO", "DESMAMADO", "VENDIDO", "MORTO"] as const
const STATUS_ORDER: Record<string, number> = { MAMANDO: 0, DESMAMADO: 1, VENDIDO: 2, MORTO: 3 }

function statusBadge(status: string) {
  switch (status) {
    case "MAMANDO":   return <Badge>Mamando</Badge>
    case "DESMAMADO": return <Badge variant="secondary">Desmamado</Badge>
    case "VENDIDO":   return <Badge variant="outline" className="border-blue-500 text-blue-600">Vendido</Badge>
    case "MORTO":     return <Badge variant="destructive">Morto</Badge>
    default:          return <Badge variant="outline">{status}</Badge>
  }
}

type FormState = {
  idEtiqueta: string; maeId: string; sexo: string
  dataNascimento: string; pesoNascimento: string; pesoAtual: string
  dataDesmameEstimada: string; status: string
}

const EMPTY_FORM: FormState = {
  idEtiqueta: "", maeId: "", sexo: "F",
  dataNascimento: "", pesoNascimento: "", pesoAtual: "",
  dataDesmameEstimada: "", status: "MAMANDO",
}

function bezerroToForm(b: Bezerro): FormState {
  return {
    idEtiqueta: b.idEtiqueta,
    maeId: b.maeId ?? "",
    sexo: b.sexo,
    dataNascimento: b.dataNascimento.toISOString().split("T")[0],
    pesoNascimento: String(b.pesoNascimento),
    pesoAtual: String(b.pesoAtual),
    dataDesmameEstimada: b.dataDesmameEstimada?.toISOString().split("T")[0] ?? "",
    status: b.status,
  }
}

function formToBezerro(form: FormState, animais: Animal[]): Omit<Bezerro, "id" | "diasVida"> {
  const mae = animais.find(a => a.id === form.maeId)
  const dataNasc = new Date(form.dataNascimento + "T12:00:00")
  return {
    idEtiqueta: form.idEtiqueta.trim(),
    maeId: form.maeId,
    maeEtiqueta: mae?.idEtiqueta ?? "",
    sexo: form.sexo,
    dataNascimento: dataNasc,
    pesoNascimento: Number(form.pesoNascimento) || 0,
    pesoAtual: Number(form.pesoAtual) || 0,
    dataDesmameEstimada: form.dataDesmameEstimada
      ? new Date(form.dataDesmameEstimada + "T12:00:00")
      : addDays(dataNasc, 210),
    status: form.status,
  }
}

const INPUT = "w-full border rounded-md px-3 py-1.5 text-sm bg-background"
const LABEL = "text-xs font-medium text-muted-foreground"

function BezerroForm({ form, setForm, animais, onSubmit, onCancel, submitLabel }: {
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  animais: Animal[]
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
          <input required value={form.idEtiqueta} onChange={f("idEtiqueta")} className={INPUT} placeholder="Ex: B-401" />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Sexo</label>
          <select value={form.sexo} onChange={f("sexo")} className={INPUT}>
            <option value="F">♀ Fêmea</option>
            <option value="M">♂ Macho</option>
          </select>
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className={LABEL}>Mãe</label>
          <select value={form.maeId} onChange={f("maeId")} className={INPUT}>
            <option value="">Sem mãe registrada</option>
            {animais.map(a => (
              <option key={a.id} value={a.id}>
                #{a.idEtiqueta}{a.nome ? ` — ${a.nome}` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Nascimento *</label>
          <input required type="date" value={form.dataNascimento} onChange={f("dataNascimento")} className={INPUT} />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Status</label>
          <select value={form.status} onChange={f("status")} className={INPUT}>
            {BEZERRO_STATUS.map(s => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Peso Nasc. (kg)</label>
          <input type="number" min="0" step="0.1" value={form.pesoNascimento} onChange={f("pesoNascimento")} className={INPUT} />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Peso Atual (kg)</label>
          <input type="number" min="0" step="0.1" value={form.pesoAtual} onChange={f("pesoAtual")} className={INPUT} />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className={LABEL}>Desmame Estimado (deixe vazio para +210 dias)</label>
          <input type="date" value={form.dataDesmameEstimada} onChange={f("dataDesmameEstimada")} className={INPUT} />
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-2 border-t border-border">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" size="sm">{submitLabel}</Button>
      </div>
    </form>
  )
}

export default function BezerrosPage() {
  const { bezerros, animais, loading, addBezerro, updateBezerro, deleteBezerro } = useData()
  const [modal, setModal] = useState<"none" | "create" | "edit">("none")
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  if (loading) return <div className="p-4 md:p-6 text-sm text-muted-foreground">Carregando...</div>

  const sorted = [...bezerros].sort((a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99))

  function openCreate() { setForm(EMPTY_FORM); setModal("create") }
  function openEdit(b: Bezerro) { setEditId(b.id); setForm(bezerroToForm(b)); setModal("edit") }
  function closeModal() { setModal("none"); setEditId(null) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = formToBezerro(form, animais)
    if (modal === "create") await addBezerro(data)
    else if (modal === "edit" && editId) await updateBezerro(editId, data)
    closeModal()
  }

  async function handleDelete(id: string) {
    await deleteBezerro(id)
    setDeleteConfirmId(null)
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bezerros</h1>
          <p className="text-muted-foreground text-sm">{bezerros.length} bezerros</p>
        </div>
        <Button size="sm" onClick={openCreate}>+ Novo Bezerro</Button>
      </div>

      <Modal open={modal !== "none"} onClose={closeModal} title={modal === "create" ? "Novo Bezerro" : "Editar Bezerro"}>
        <BezerroForm form={form} setForm={setForm} animais={animais} onSubmit={handleSubmit} onCancel={closeModal} submitLabel={modal === "create" ? "Criar Bezerro" : "Salvar"} />
      </Modal>

      <Card className="border-l-4 border-l-teal-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Registro de Bezerros</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Etiqueta</TableHead>
                <TableHead>Sexo</TableHead>
                <TableHead>Mãe</TableHead>
                <TableHead>Nascimento</TableHead>
                <TableHead className="text-right">Dias</TableHead>
                <TableHead className="text-right">Peso Nasc.</TableHead>
                <TableHead className="text-right">Peso Atual</TableHead>
                <TableHead>Desmame</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((b) => {
                const dataDesmame = b.dataDesmameEstimada ?? addDays(b.dataNascimento, 210)
                return (
                  <TableRow key={b.id} className={cn(b.status === "DESMAMADO" && "opacity-60")}>
                    <TableCell className="font-mono font-medium">{b.idEtiqueta}</TableCell>
                    <TableCell>{b.sexo === "M" ? "♂ Macho" : "♀ Fêmea"}</TableCell>
                    <TableCell><span className="font-mono text-sm">#{b.maeEtiqueta}</span></TableCell>
                    <TableCell>{format(b.dataNascimento, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                    <TableCell className="text-right">{b.diasVida}</TableCell>
                    <TableCell className="text-right">{b.pesoNascimento} kg</TableCell>
                    <TableCell className="text-right">{b.pesoAtual} kg</TableCell>
                    <TableCell>{format(dataDesmame, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                    <TableCell>{statusBadge(b.status)}</TableCell>
                    <TableCell>
                      {deleteConfirmId === b.id ? (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-muted-foreground">Excluir?</span>
                          <button onClick={() => handleDelete(b.id)} className="text-red-600 font-medium px-1.5 py-0.5 rounded hover:bg-red-50">Sim</button>
                          <button onClick={() => setDeleteConfirmId(null)} className="text-muted-foreground px-1.5 py-0.5 rounded hover:bg-muted">Não</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm">
                          <button onClick={() => openEdit(b)} className="text-blue-600 hover:text-blue-700">Editar</button>
                          <button onClick={() => setDeleteConfirmId(b.id)} className="text-red-400 hover:text-red-600">✕</button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
