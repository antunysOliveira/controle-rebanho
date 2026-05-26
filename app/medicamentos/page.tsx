"use client"

import { useState } from "react"
import { format, differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useData } from "@/components/data-provider"
import { Modal } from "@/components/modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { Medicamento } from "@/lib/types"

const TIPO_MED = ["HORMONIO", "ANTIBIOTICO", "ANTIPARASITARIO", "VITAMINA", "OUTRO"] as const
const TIPO_LABEL: Record<string, string> = {
  HORMONIO: "Hormônio", ANTIBIOTICO: "Antibiótico",
  ANTIPARASITARIO: "Antiparasitário", VITAMINA: "Vitamina", OUTRO: "Outro",
}

function TipoBadge({ tipo }: { tipo: string }) {
  if (tipo === "HORMONIO")        return <Badge variant="outline" className="text-purple-700 border-purple-400">{TIPO_LABEL.HORMONIO}</Badge>
  if (tipo === "ANTIBIOTICO")     return <Badge variant="outline" className="text-blue-700 border-blue-400">{TIPO_LABEL.ANTIBIOTICO}</Badge>
  if (tipo === "ANTIPARASITARIO") return <Badge variant="outline" className="text-green-700 border-green-400">{TIPO_LABEL.ANTIPARASITARIO}</Badge>
  if (tipo === "VITAMINA")        return <Badge variant="outline" className="text-amber-700 border-amber-400">{TIPO_LABEL.VITAMINA}</Badge>
  return <Badge variant="secondary">{TIPO_LABEL.OUTRO}</Badge>
}

type FormState = {
  nome: string; principioAtivo: string; tipo: string; unidade: string
  dosePadrao: string; estoqueAtual: string; estoqueMinimo: string
  validade: string; fornecedor: string; ativo: boolean
}

const EMPTY_FORM: FormState = {
  nome: "", principioAtivo: "", tipo: "OUTRO", unidade: "doses",
  dosePadrao: "1", estoqueAtual: "0", estoqueMinimo: "5",
  validade: "", fornecedor: "", ativo: true,
}

function medToForm(m: Medicamento): FormState {
  return {
    nome: m.nome, principioAtivo: m.principioAtivo, tipo: m.tipo,
    unidade: m.unidade, dosePadrao: String(m.dosePadrao),
    estoqueAtual: String(m.estoqueAtual), estoqueMinimo: String(m.estoqueMinimo),
    validade: m.validade.toISOString().split("T")[0],
    fornecedor: m.fornecedor, ativo: m.ativo,
  }
}

function formToMed(form: FormState): Omit<Medicamento, "id"> {
  return {
    nome: form.nome.trim(),
    principioAtivo: form.principioAtivo.trim(),
    tipo: form.tipo,
    unidade: form.unidade.trim(),
    dosePadrao: Number(form.dosePadrao) || 1,
    estoqueAtual: Number(form.estoqueAtual) || 0,
    estoqueMinimo: Number(form.estoqueMinimo) || 0,
    validade: new Date(form.validade + "T12:00:00"),
    fornecedor: form.fornecedor.trim(),
    ativo: form.ativo,
  }
}

const INPUT = "w-full border rounded-md px-3 py-1.5 text-sm bg-background"
const LABEL = "text-xs font-medium text-muted-foreground"

function MedForm({ form, setForm, onSubmit, onCancel, submitLabel }: {
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
        <div className="space-y-1 sm:col-span-2">
          <label className={LABEL}>Nome *</label>
          <input required value={form.nome} onChange={f("nome")} className={INPUT} placeholder="Ex: Ivermectina 1%" />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Princípio Ativo</label>
          <input value={form.principioAtivo} onChange={f("principioAtivo")} className={INPUT} placeholder="Ex: Ivermectina" />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Tipo</label>
          <select value={form.tipo} onChange={f("tipo")} className={INPUT}>
            {TIPO_MED.map(t => <option key={t} value={t}>{TIPO_LABEL[t]}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Unidade</label>
          <input value={form.unidade} onChange={f("unidade")} className={INPUT} placeholder="doses, ml, frascos..." />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Dose Padrão</label>
          <input type="number" min="0" step="0.1" value={form.dosePadrao} onChange={f("dosePadrao")} className={INPUT} />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Estoque Atual</label>
          <input type="number" min="0" value={form.estoqueAtual} onChange={f("estoqueAtual")} className={INPUT} />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Estoque Mínimo</label>
          <input type="number" min="0" value={form.estoqueMinimo} onChange={f("estoqueMinimo")} className={INPUT} />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Validade *</label>
          <input required type="date" value={form.validade} onChange={f("validade")} className={INPUT} />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className={LABEL}>Fornecedor</label>
          <input value={form.fornecedor} onChange={f("fornecedor")} className={INPUT} placeholder="Nome do fornecedor" />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="ativo"
            type="checkbox"
            checked={form.ativo}
            onChange={e => setForm(prev => ({ ...prev, ativo: e.target.checked }))}
            className="h-4 w-4"
          />
          <label htmlFor="ativo" className="text-sm">Ativo</label>
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-2 border-t border-border">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" size="sm">{submitLabel}</Button>
      </div>
    </form>
  )
}

export default function MedicamentosPage() {
  const { medicamentos, loading, addMedicamento, updateMedicamento, deleteMedicamento } = useData()
  const [modal, setModal] = useState<"none" | "create" | "edit">("none")
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const hoje = new Date()

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Carregando...</div>

  function openCreate() { setForm(EMPTY_FORM); setModal("create") }
  function openEdit(m: Medicamento) { setEditId(m.id); setForm(medToForm(m)); setModal("edit") }
  function closeModal() { setModal("none"); setEditId(null) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = formToMed(form)
    if (modal === "create") await addMedicamento(data)
    else if (modal === "edit" && editId) await updateMedicamento(editId, data)
    closeModal()
  }

  async function handleDelete(id: string) {
    await deleteMedicamento(id)
    setDeleteConfirmId(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Medicamentos</h1>
          <p className="text-muted-foreground text-sm mt-1">{medicamentos.length} medicamentos cadastrados</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/medicamentos/aplicacoes" className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline">
            Ver Aplicações →
          </Link>
          <Button size="sm" onClick={openCreate}>+ Novo</Button>
        </div>
      </div>

      <Modal open={modal !== "none"} onClose={closeModal} title={modal === "create" ? "Novo Medicamento" : "Editar Medicamento"}>
        <MedForm form={form} setForm={setForm} onSubmit={handleSubmit} onCancel={closeModal} submitLabel={modal === "create" ? "Criar" : "Salvar"} />
      </Modal>

      <div className="rounded-xl border border-l-4 border-l-rose-500 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Estoque</TableHead>
              <TableHead className="w-28">Nível</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead className="w-32"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicamentos.map((med) => {
              const baixoEstoque     = med.estoqueAtual < med.estoqueMinimo
              const daysToExpiry     = differenceInDays(med.validade, hoje)
              const expirandoEmBreve = daysToExpiry >= 0 && daysToExpiry <= 30
              const progressValue    = Math.min((med.estoqueAtual / med.estoqueMinimo) * 100, 100)
              const progressClass    = baixoEstoque
                ? "[&>div]:bg-red-500"
                : progressValue >= 100 ? "[&>div]:bg-green-500" : "[&>div]:bg-amber-500"

              return (
                <TableRow key={med.id} className={cn(baixoEstoque && "bg-red-50")}>
                  <TableCell className="font-medium">{med.nome}</TableCell>
                  <TableCell><TipoBadge tipo={med.tipo} /></TableCell>
                  <TableCell className="text-right">
                    <span className={cn("font-mono font-medium", baixoEstoque && "text-destructive")}>{med.estoqueAtual}</span>
                    <span className="text-muted-foreground font-mono"> / {med.estoqueMinimo} {med.unidade}</span>
                  </TableCell>
                  <TableCell>
                    <Progress value={progressValue} className={cn("h-2", progressClass)} />
                  </TableCell>
                  <TableCell>
                    <span className={cn(expirandoEmBreve && "text-yellow-600 font-medium")}>
                      {expirandoEmBreve && "⚠ "}
                      {format(med.validade, "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{med.fornecedor}</TableCell>
                  <TableCell>
                    {deleteConfirmId === med.id ? (
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-muted-foreground">Excluir?</span>
                        <button onClick={() => handleDelete(med.id)} className="text-red-600 font-medium px-1.5 py-0.5 rounded hover:bg-red-50">Sim</button>
                        <button onClick={() => setDeleteConfirmId(null)} className="text-muted-foreground px-1.5 py-0.5 rounded hover:bg-muted">Não</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        <button onClick={() => openEdit(med)} className="text-blue-600 hover:text-blue-700">Editar</button>
                        <button onClick={() => setDeleteConfirmId(med.id)} className="text-red-400 hover:text-red-600">✕</button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
