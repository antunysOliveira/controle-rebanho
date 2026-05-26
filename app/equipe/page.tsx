"use client"

import { useState } from "react"
import { useData } from "@/components/data-provider"
import { Modal } from "@/components/modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import type { Veterinario, Encarregado } from "@/lib/types"

const CARGOS = ["GERENTE", "ENCARREGADO", "VAQUEIRO"] as const

function CargoBadge({ cargo }: { cargo: string }) {
  if (cargo === "GERENTE")     return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Gerente</Badge>
  if (cargo === "ENCARREGADO") return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Encarregado</Badge>
  return <Badge variant="secondary">Vaqueiro</Badge>
}

const INPUT = "w-full border rounded-md px-3 py-1.5 text-sm bg-background"
const LABEL = "text-xs font-medium text-muted-foreground"

// ─── Veterinário ─────────────────────────────────────────────────────────────

type VetForm = { nome: string; crmv: string; telefone: string; email: string; especialidade: string; ativo: boolean }
const EMPTY_VET: VetForm = { nome: "", crmv: "", telefone: "", email: "", especialidade: "", ativo: true }

function vetToForm(v: Veterinario): VetForm {
  return { nome: v.nome, crmv: v.crmv, telefone: v.telefone, email: v.email, especialidade: v.especialidade, ativo: v.ativo }
}

function VetForm({ form, setForm, onSubmit, onCancel, label }: {
  form: VetForm
  setForm: React.Dispatch<React.SetStateAction<VetForm>>
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  label: string
}) {
  const f = (field: keyof VetForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }))
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1 sm:col-span-2">
          <label className={LABEL}>Nome *</label>
          <input required value={form.nome} onChange={f("nome")} className={INPUT} placeholder="Dr. Nome Sobrenome" />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>CRMV</label>
          <input value={form.crmv} onChange={f("crmv")} className={INPUT} placeholder="CRMV-XX 00000" />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Especialidade</label>
          <input value={form.especialidade} onChange={f("especialidade")} className={INPUT} placeholder="Ex: Bovinos" />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Telefone</label>
          <input value={form.telefone} onChange={f("telefone")} className={INPUT} placeholder="(00) 00000-0000" />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>E-mail</label>
          <input type="email" value={form.email} onChange={f("email")} className={INPUT} placeholder="email@exemplo.com" />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <input id="vet-ativo" type="checkbox" checked={form.ativo} onChange={e => setForm(p => ({ ...p, ativo: e.target.checked }))} className="h-4 w-4" />
          <label htmlFor="vet-ativo" className="text-sm">Ativo</label>
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-2 border-t border-border">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" size="sm">{label}</Button>
      </div>
    </form>
  )
}

// ─── Encarregado ─────────────────────────────────────────────────────────────

type EncForm = { nome: string; cargo: string; telefone: string; lotesStr: string; ativo: boolean }
const EMPTY_ENC: EncForm = { nome: "", cargo: "ENCARREGADO", telefone: "", lotesStr: "", ativo: true }

function encToForm(e: Encarregado): EncForm {
  return { nome: e.nome, cargo: e.cargo, telefone: e.telefone, lotesStr: e.lotes.join(", "), ativo: e.ativo }
}

function parseLotes(s: string): string[] {
  return s.split(",").map(l => l.trim()).filter(Boolean)
}

function EncForm({ form, setForm, onSubmit, onCancel, label }: {
  form: EncForm
  setForm: React.Dispatch<React.SetStateAction<EncForm>>
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  label: string
}) {
  const f = (field: keyof EncForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }))
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1 sm:col-span-2">
          <label className={LABEL}>Nome *</label>
          <input required value={form.nome} onChange={f("nome")} className={INPUT} placeholder="Nome completo" />
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Cargo</label>
          <select value={form.cargo} onChange={f("cargo")} className={INPUT}>
            {CARGOS.map(c => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className={LABEL}>Telefone</label>
          <input value={form.telefone} onChange={f("telefone")} className={INPUT} placeholder="(00) 00000-0000" />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className={LABEL}>Lotes (separados por vírgula)</label>
          <input value={form.lotesStr} onChange={f("lotesStr")} className={INPUT} placeholder="Ex: Lote A, Lote B" />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <input id="enc-ativo" type="checkbox" checked={form.ativo} onChange={e => setForm(p => ({ ...p, ativo: e.target.checked }))} className="h-4 w-4" />
          <label htmlFor="enc-ativo" className="text-sm">Ativo</label>
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-2 border-t border-border">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" size="sm">{label}</Button>
      </div>
    </form>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type ModalTarget = "none" | "vet-create" | "vet-edit" | "enc-create" | "enc-edit"

export default function EquipePage() {
  const {
    veterinarios, encarregados, loading,
    addVeterinario, updateVeterinario, deleteVeterinario,
    addEncarregado, updateEncarregado, deleteEncarregado,
  } = useData()

  const [modal,   setModal]   = useState<ModalTarget>("none")
  const [editId,  setEditId]  = useState<string | null>(null)
  const [vetForm, setVetForm] = useState<VetForm>(EMPTY_VET)
  const [encForm, setEncForm] = useState<EncForm>(EMPTY_ENC)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Carregando...</div>

  function openVetCreate() { setVetForm(EMPTY_VET); setModal("vet-create") }
  function openVetEdit(v: Veterinario) { setEditId(v.id); setVetForm(vetToForm(v)); setModal("vet-edit") }
  function openEncCreate() { setEncForm(EMPTY_ENC); setModal("enc-create") }
  function openEncEdit(e: Encarregado) { setEditId(e.id); setEncForm(encToForm(e)); setModal("enc-edit") }
  function closeModal() { setModal("none"); setEditId(null) }

  async function handleVetSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data: Omit<Veterinario, "id"> = {
      nome: vetForm.nome.trim(), crmv: vetForm.crmv.trim(),
      telefone: vetForm.telefone.trim(), email: vetForm.email.trim(),
      especialidade: vetForm.especialidade.trim(), ativo: vetForm.ativo,
    }
    if (modal === "vet-create") await addVeterinario(data)
    else if (editId) await updateVeterinario(editId, data)
    closeModal()
  }

  async function handleEncSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data: Omit<Encarregado, "id"> = {
      nome: encForm.nome.trim(), cargo: encForm.cargo,
      telefone: encForm.telefone.trim(), lotes: parseLotes(encForm.lotesStr), ativo: encForm.ativo,
    }
    if (modal === "enc-create") await addEncarregado(data)
    else if (editId) await updateEncarregado(editId, data)
    closeModal()
  }

  async function handleDeleteVet(id: string) { await deleteVeterinario(id); setDeleteConfirmId(null) }
  async function handleDeleteEnc(id: string) { await deleteEncarregado(id); setDeleteConfirmId(null) }

  function DeleteConfirm({ id, onConfirm }: { id: string; onConfirm: (id: string) => void }) {
    if (deleteConfirmId !== id) return null
    return (
      <div className="flex items-center gap-1 text-xs mt-2">
        <span className="text-muted-foreground">Excluir?</span>
        <button onClick={() => onConfirm(id)} className="text-red-600 font-medium px-1.5 py-0.5 rounded hover:bg-red-50">Sim</button>
        <button onClick={() => setDeleteConfirmId(null)} className="text-muted-foreground px-1.5 py-0.5 rounded hover:bg-muted">Não</button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Equipe</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {veterinarios.length} veterinários · {encarregados.length} funcionários
        </p>
      </div>

      {/* Modais */}
      <Modal open={modal === "vet-create" || modal === "vet-edit"} onClose={closeModal} title={modal === "vet-create" ? "Novo Veterinário" : "Editar Veterinário"}>
        <VetForm form={vetForm} setForm={setVetForm} onSubmit={handleVetSubmit} onCancel={closeModal} label={modal === "vet-create" ? "Criar" : "Salvar"} />
      </Modal>
      <Modal open={modal === "enc-create" || modal === "enc-edit"} onClose={closeModal} title={modal === "enc-create" ? "Novo Funcionário" : "Editar Funcionário"}>
        <EncForm form={encForm} setForm={setEncForm} onSubmit={handleEncSubmit} onCancel={closeModal} label={modal === "enc-create" ? "Criar" : "Salvar"} />
      </Modal>

      {/* Veterinários */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Veterinários</h2>
          <Button size="sm" onClick={openVetCreate}>+ Novo</Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {veterinarios.map((v) => (
            <Card key={v.id} className={v.ativo ? "border-l-4 border-l-blue-500" : "border-l-4 border-l-gray-300"}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-bold text-base">{v.nome}</CardTitle>
                  {v.ativo
                    ? <Badge className="bg-green-100 text-green-700 border-green-200 shrink-0">Ativo</Badge>
                    : <Badge variant="outline" className="text-muted-foreground shrink-0">Inativo</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5">
                <p className="font-mono text-xs text-muted-foreground">{v.crmv}</p>
                <p className="text-sm">{v.especialidade}</p>
                <div className="pt-1 space-y-0.5">
                  <p className="text-sm text-muted-foreground">{v.telefone}</p>
                  <p className="text-sm text-muted-foreground">{v.email}</p>
                </div>
              </CardContent>
              <CardFooter className="flex items-center gap-2 pt-0">
                <button onClick={() => openVetEdit(v)} className="text-sm text-blue-600 hover:text-blue-700">Editar</button>
                <button onClick={() => setDeleteConfirmId(v.id)} className="text-sm text-red-400 hover:text-red-600">Excluir</button>
                <DeleteConfirm id={v.id} onConfirm={handleDeleteVet} />
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Encarregados */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Encarregados / Funcionários</h2>
          <Button size="sm" onClick={openEncCreate}>+ Novo</Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {encarregados.map((e) => (
            <Card key={e.id} className={e.ativo ? "border-l-4 border-l-green-500" : "border-l-4 border-l-gray-300"}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-bold text-base">{e.nome}</CardTitle>
                  <CargoBadge cargo={e.cargo} />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{e.telefone}</p>
                {e.lotes.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Responsável por:</p>
                    <div className="flex flex-wrap gap-1">
                      {e.lotes.map((lote) => (
                        <Badge key={lote} variant="outline" className="text-xs">{lote}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex items-center gap-2 pt-0">
                <button onClick={() => openEncEdit(e)} className="text-sm text-blue-600 hover:text-blue-700">Editar</button>
                <button onClick={() => setDeleteConfirmId(e.id)} className="text-sm text-red-400 hover:text-red-600">Excluir</button>
                <DeleteConfirm id={e.id} onConfirm={handleDeleteEnc} />
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
