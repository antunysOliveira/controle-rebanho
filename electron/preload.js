// Context bridge for secure renderer access — extend as needed
const { contextBridge } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
})
