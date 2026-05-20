import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { protocolosAtivos } from "@/lib/mock/data"
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

const diagnosticosPendentes = [
  { idEtiqueta: "0011", nome: null,     lote: "Lote 2025-B", dataInseminacao: new Date(2025, 0, 18), diasAguardando: 28 },
  { idEtiqueta: "0029", nome: "Boneca", lote: "Lote 2025-B", dataInseminacao: new Date(2025, 0, 14), diasAguardando: 32 },
  { idEtiqueta: "0047", nome: null,     lote: "Lote 2025-A", dataInseminacao: new Date(2025, 0, 21), diasAguardando: 25 },
]

export default function ReproducaoPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Controle Reprodutivo</h1>
        <p className="text-muted-foreground text-sm mt-1">Protocolos, diagnósticos e repasse de touro</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Protocolos IATF Ativos */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle>Protocolos IATF Ativos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {protocolosAtivos.map((p) => (
              <div key={p.id} className="rounded-lg border p-3 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-semibold text-sm">{p.etiqueta}</span>
                  {p.nome && <span className="text-sm text-muted-foreground">{p.nome}</span>}
                  <span className="text-xs text-muted-foreground">{p.lote}</span>
                  <EtapaBadge etapa={p.etapaAtual} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Implante</p>
                    <p className="font-medium">
                      {p.dataImplante ? format(p.dataImplante, "dd/MM", { locale: ptBR }) : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Inseminação</p>
                    <p className="font-medium">
                      {p.dataInseminacao ? format(p.dataInseminacao, "dd/MM", { locale: ptBR }) : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Diagnóstico</p>
                    <p className="font-medium">
                      {p.dataDiagnostico ? format(p.dataDiagnostico, "dd/MM", { locale: ptBR }) : "—"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{p.veterinario}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Diagnósticos Pendentes */}
        <Card className="border-l-4 border-l-violet-500">
          <CardHeader>
            <CardTitle>Diagnósticos Pendentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {diagnosticosPendentes.map((d) => (
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
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Repasse de Touro */}
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader>
          <CardTitle>Repasse de Touro</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4 space-y-1">
            <p className="font-semibold">Brutus 520</p>
            <p className="text-sm text-muted-foreground">Lote 2025-B</p>
            <p className="text-sm">
              Desde <span className="font-medium">15/01/2025</span>
            </p>
            <p className="text-sm">
              Encerra em <span className="font-medium">30/06/2025</span>
            </p>
            <Badge className="bg-green-100 text-green-700 border-green-200 mt-1">Ativo</Badge>
          </div>
          <div className="rounded-lg border p-4 space-y-1">
            <p className="font-semibold">Imperador 450</p>
            <p className="text-sm text-muted-foreground">Lote 2025-A</p>
            <p className="text-sm">
              Desde <span className="font-medium">01/08/2024</span>
            </p>
            <p className="text-sm">
              Encerrado em <span className="font-medium">30/06/2025</span>
            </p>
            <Badge variant="outline" className="mt-1">Encerrado</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
