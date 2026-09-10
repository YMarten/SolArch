import type { HostingMode, ManagementModel } from "@/types/solution"

export const hostingModeOptions: { value: HostingMode; label: string; description: string }[] = [
  { value: "ON_PREMISE", label: "Infraestructura interna", description: "Opera en infraestructura interna de Grupo Rica." },
  { value: "CLOUD_COMPANY", label: "Nube de la empresa", description: "Opera en una cuenta de nube de Grupo Rica." },
  { value: "EXTERNAL", label: "Infraestructura externa", description: "Opera fuera de la infraestructura de Grupo Rica." },
  { value: "HYBRID", label: "Híbrida", description: "Combina ambientes internos y externos." },
  { value: "UNKNOWN", label: "No determinada", description: "No se conoce dónde opera." },
]

export const managementModelOptions: { value: ManagementModel; label: string; description: string }[] = [
  { value: "COMPANY_MANAGED", label: "Administrada internamente", description: "Grupo Rica administra la plataforma." },
  { value: "PROVIDER_MANAGED", label: "Administrada por el proveedor", description: "El proveedor administra la plataforma." },
  { value: "SHARED_MANAGEMENT", label: "Administración compartida", description: "Las responsabilidades son compartidas." },
  { value: "UNKNOWN", label: "No determinado", description: "No se conoce quién la administra." },
]
