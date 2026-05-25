import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"

interface EventoMock {
  id: string
  tipo: string
  data: Date
  resultado?: string | null
  obs?: string | null
}

interface AplicacaoMock {
  id: string
  medicamento: string
  doseAplicada: number
  via: string
  data: Date
  motivo?: string | null
  carenciaDias: number
}

type TimelineItem =
  | { kind: "evento"; id: string; data: Date; tipo: string; resultado?: string | null; obs?: string | null }
  | { kind: "aplicacao"; id: string; data: Date; medicamento: string; doseAplicada: number; via: string; motivo?: string | null; carenciaDias: number }

const eventoLabel: Record<string, string> = {
  IMPLANTE_HORMONAL:   "Implante Hormonal",
  INSEMINACAO_IATF:    "Inseminação IATF",
  ENTRADA_TOURO:       "Entrada do Touro",
  DIAGNOSTICO_PRENHEZ: "Diagnóstico de Prenhez",
  PARTO:               "Parto",
  DESMAME:             "Desmame",
  SECAGEM:             "Secagem",
  DESCARTE:            "Descarte",
}

const viaLabel: Record<string, string> = {
  INTRAMUSCULAR: "IM",
  SUBCUTANEA:    "SC",
  ORAL:          "Oral",
  TOPICA:        "Tópica",
}

function dotColor(item: TimelineItem): string {
  if (item.kind === "aplicacao") return "bg-rose-500"
  switch (item.tipo) {
    case "PARTO":               return "bg-green-500"
    case "DESMAME":             return "bg-teal-500"
    case "INSEMINACAO_IATF":    return "bg-blue-500"
    case "IMPLANTE_HORMONAL":   return "bg-purple-500"
    case "DIAGNOSTICO_PRENHEZ": return item.resultado === "POSITIVO" ? "bg-green-500" : item.resultado === "NEGATIVO" ? "bg-red-500" : "bg-amber-400"
    case "ENTRADA_TOURO":       return "bg-amber-500"
    case "DESCARTE":            return "bg-red-500"
    default:                    return "bg-gray-400"
  }
}

interface AnimalTimelineProps {
  eventos: EventoMock[]
  aplicacoes: AplicacaoMock[]
}

export function AnimalTimeline({ eventos, aplicacoes }: AnimalTimelineProps) {
  const items: TimelineItem[] = [
    ...eventos.map(e => ({ kind: "evento" as const, id: e.id, data: e.data, tipo: e.tipo, resultado: e.resultado, obs: e.obs })),
    ...aplicacoes.map(a => ({ kind: "aplicacao" as const, id: a.id, data: a.data, medicamento: a.medicamento, doseAplicada: a.doseAplicada, via: a.via, motivo: a.motivo, carenciaDias: a.carenciaDias })),
  ].sort((a, b) => b.data.getTime() - a.data.getTime())

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum evento registrado.</p>
  }

  return (
    <div className="relative pl-6">
      {/* vertical line */}
      <div className="absolute left-2.5 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-5">
        {items.map((item) => (
          <div key={`${item.kind}-${item.id}`} className="relative">
            {/* dot */}
            <div className={`absolute -left-[15px] top-1 w-3 h-3 rounded-full border-2 border-background ${dotColor(item)}`} />

            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground tabular-nums">
                  {format(item.data, "dd/MM/yyyy", { locale: ptBR })}
                </span>
                {item.kind === "evento" && item.resultado && (
                  <Badge
                    className={`text-xs ${
                      item.resultado === "POSITIVO"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    }`}
                    variant="outline"
                  >
                    {item.resultado === "POSITIVO" ? "Positivo" : "Negativo"}
                  </Badge>
                )}
              </div>

              {item.kind === "evento" ? (
                <div>
                  <p className="text-sm font-medium">{eventoLabel[item.tipo] ?? item.tipo}</p>
                  {item.obs && <p className="text-xs text-muted-foreground italic">{item.obs}</p>}
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium">{item.medicamento}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.doseAplicada} · {viaLabel[item.via] ?? item.via}
                    {item.motivo ? ` · ${item.motivo}` : ""}
                  </p>
                  {item.carenciaDias > 0 && (
                    <p className="text-xs text-amber-600">Carência: {item.carenciaDias} dias</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
