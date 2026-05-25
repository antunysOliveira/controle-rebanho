import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.rebanho.controle",
  appName: "Controle Rebanho",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
}

export default config
