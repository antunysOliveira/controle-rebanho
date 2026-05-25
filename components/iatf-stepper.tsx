import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

type EtapaProtocolo = "implante_hormonal" | "inseminacao_iatf" | "aguardando_diagnostico"

const steps: { key: EtapaProtocolo; label: string }[] = [
  { key: "implante_hormonal",     label: "Implante"    },
  { key: "inseminacao_iatf",      label: "Inseminação" },
  { key: "aguardando_diagnostico",label: "Diagnóstico" },
]

interface IATFStepperProps {
  etapaAtual: EtapaProtocolo
  dataImplante: Date
  dataInseminacao: Date
  dataDiagnostico: Date
}

export function IATFStepper({ etapaAtual, dataImplante, dataInseminacao, dataDiagnostico }: IATFStepperProps) {
  const currentIndex = steps.findIndex(s => s.key === etapaAtual)
  const dates = [dataImplante, dataInseminacao, dataDiagnostico]

  return (
    <div className="flex items-start gap-0 mt-2">
      {steps.map((step, i) => {
        const done   = i < currentIndex
        const active = i === currentIndex
        return (
          <div key={step.key} className="flex items-start flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div
                    className="flex-1 h-0.5 mt-3.5"
                    style={{ background: done || active ? "var(--sidebar-primary)" : "var(--border)" }}
                  />
                )}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0"
                  style={
                    done
                      ? { background: "var(--sidebar-primary)", borderColor: "var(--sidebar-primary)", color: "#fff" }
                      : active
                      ? { background: "oklch(0.55 0.18 148)", borderColor: "oklch(0.55 0.18 148)", color: "#fff" }
                      : { background: "var(--muted)", borderColor: "var(--border)", color: "var(--muted-foreground)" }
                  }
                >
                  {done ? "✓" : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="flex-1 h-0.5 mt-0"
                    style={{ background: done ? "var(--sidebar-primary)" : "var(--border)", marginTop: "14px" }}
                  />
                )}
              </div>
              <div className="flex flex-col items-center mt-1.5 gap-0.5 px-1">
                <span
                  className="text-xs font-medium text-center leading-tight"
                  style={{ color: active ? "var(--foreground)" : "var(--muted-foreground)" }}
                >
                  {step.label}
                </span>
                <span className="text-xs text-center" style={{ color: "var(--muted-foreground)" }}>
                  {format(dates[i], "dd/MM", { locale: ptBR })}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
