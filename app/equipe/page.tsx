"use client"

import { useData } from "@/components/data-provider"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

function CargoBadge({ cargo }: { cargo: string }) {
  if (cargo === "GERENTE")      return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Gerente</Badge>
  if (cargo === "ENCARREGADO")  return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Encarregado</Badge>
  return <Badge variant="secondary">Vaqueiro</Badge>
}

export default function EquipePage() {
  const { veterinarios, encarregados, loading } = useData()

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Carregando...</div>

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Equipe</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {veterinarios.length} veterinários · {encarregados.length} funcionários
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Veterinários</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {veterinarios.map((v) => (
            <Card key={v.id} className={v.ativo ? "border-l-4 border-l-blue-500" : "border-l-4 border-l-gray-300"}>
              <CardHeader>
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
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Encarregados / Funcionários</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {encarregados.map((e) => (
            <Card key={e.id} className={e.ativo ? "border-l-4 border-l-green-500" : "border-l-4 border-l-gray-300"}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-bold text-base">{e.nome}</CardTitle>
                  <CargoBadge cargo={e.cargo} />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{e.telefone}</p>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Responsável por:</p>
                  <div className="flex flex-wrap gap-1">
                    {e.lotes.map((lote) => (
                      <Badge key={lote} variant="outline" className="text-xs">{lote}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
