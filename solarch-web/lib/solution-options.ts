import type { SolutionType, SolutionOrigin, SolutionRole, UsageFrequency, Criticality, FailureImpact, AnswerStatus } from "@/types/solution"

type Option<T extends string> = { value: T; label: string; description: string }

export const solutionTypeOptions: Option<SolutionType>[] = [
  {
    "value": "WEB",
    "label": "Web",
    "description": "Se utiliza desde un navegador, incluso si se adapta a dispositivos móviles."
  },
  {
    "value": "DESKTOP",
    "label": "Escritorio",
    "description": "Se instala y utiliza como aplicación de escritorio."
  },
  {
    "value": "MOBILE",
    "label": "Móvil",
    "description": "Se instala como aplicación en teléfonos o tabletas."
  },
  {
    "value": "API",
    "label": "API",
    "description": "Expone funciones o datos para que otros sistemas los consulten o utilicen."
  },
  {
    "value": "BATCH",
    "label": "Procesamiento por lotes",
    "description": "Ejecuta tareas automáticas programadas o por lotes, sin interacción habitual de usuarios."
  },
  {
    "value": "INTEGRATION",
    "label": "Integración",
    "description": "Implementa flujos de intercambio o transformación de datos entre sistemas."
  },
  {
    "value": "INFRASTRUCTURE",
    "label": "Infraestructura",
    "description": "Proporciona recursos o servicios técnicos que soportan otras soluciones."
  },
  {
    "value": "OTHER",
    "label": "Otro",
    "description": "Su forma de operación no corresponde a los tipos anteriores."
  }
]

export const solutionOriginOptions: Option<SolutionOrigin>[] = [
  {
    "value": "INTERNAL",
    "label": "Interna",
    "description": "Desarrollada por el equipo interno de Grupo Rica."
  },
  {
    "value": "EXTERNAL",
    "label": "Externa",
    "description": "Producto de un proveedor; su alojamiento se registra por separado."
  },
  {
    "value": "CUSTOM_THIRD",
    "label": "A medida por tercero",
    "description": "Desarrollada por un tercero para necesidades específicas de Grupo Rica."
  }
]

export const solutionRoleOptions: Option<SolutionRole>[] = [
  {
    "value": "CORE_TRANSACTIONAL",
    "label": "Core transaccional",
    "description": "Ejecuta procesos centrales y mantiene datos oficiales maestros o transaccionales."
  },
  {
    "value": "SATELLITE",
    "label": "Satélite",
    "description": "Complementa al core con funciones de negocio o acceso e interacción para usuarios."
  },
  {
    "value": "INTEGRATION",
    "label": "Integración",
    "description": "Su responsabilidad principal es comunicar sistemas e intercambiar información."
  },
  {
    "value": "DATA_ANALYTICS",
    "label": "Datos / Analítica e IA",
    "description": "Gestiona, consolida o analiza datos para generar indicadores, reportes y apoyar decisiones, o aplica inteligencia artificial para realizar predicciones, recomendaciones y automatizar tareas."
  }
]

export const usageFrequencyOptions: Option<UsageFrequency>[] = [
  {
    "value": "CONTINUOUS",
    "label": "Continua",
    "description": "Opera de forma permanente o atiende eventos durante la jornada. Estar encendida no basta."
  },
  {
    "value": "DAILY",
    "label": "Diaria",
    "description": "Se utiliza o ejecuta en momentos específicos cada día, como una sincronización nocturna."
  },
  {
    "value": "WEEKLY",
    "label": "Semanal",
    "description": "Se utiliza o ejecuta en momentos específicos cada semana."
  },
  {
    "value": "MONTHLY",
    "label": "Mensual",
    "description": "Se utiliza o ejecuta en momentos específicos cada mes."
  },
  {
    "value": "OCCASIONAL",
    "label": "Ocasional",
    "description": "Se utiliza cuando surge una necesidad, sin periodicidad fija."
  },
  {
    "value": "UNKNOWN",
    "label": "No determinada",
    "description": "Aún no se ha confirmado su frecuencia de uso."
  }
]

export const criticalityOptions: Option<Criticality>[] = [
  {
    "value": "HIGH",
    "label": "Alta",
    "description": "Su interrupción compromete procesos esenciales y exige atención prioritaria."
  },
  {
    "value": "MEDIUM",
    "label": "Media",
    "description": "Su interrupción afecta la operación, pero existen alternativas temporales."
  },
  {
    "value": "LOW",
    "label": "Baja",
    "description": "Su interrupción tiene un efecto acotado y permite continuar los procesos principales."
  }
]

export const failureImpactOptions: Option<FailureImpact>[] = [
  {
    "value": "HIGH",
    "label": "Alto",
    "description": "Una falla detiene o afecta gravemente procesos o sistemas dependientes."
  },
  {
    "value": "MEDIUM",
    "label": "Medio",
    "description": "Una falla causa retrasos o trabajo manual, con continuidad parcial."
  },
  {
    "value": "LOW",
    "label": "Bajo",
    "description": "Una falla provoca molestias limitadas, sin detener procesos principales."
  },
  {
    "value": "UNKNOWN",
    "label": "No determinado",
    "description": "Aún no se han evaluado las consecuencias de una falla."
  }
]

export const supportStatusOptions: Option<AnswerStatus>[] = [
  {
    "value": "YES",
    "label": "Sí",
    "description": "Existe soporte activo del fabricante, proveedor o implementador."
  },
  {
    "value": "NO",
    "label": "No",
    "description": "Se confirmó que no hay soporte vigente."
  },
  {
    "value": "UNKNOWN",
    "label": "No determinado",
    "description": "No se ha confirmado la vigencia del soporte."
  }
]

export const updatesOptions: Option<AnswerStatus>[] = [
  {
    "value": "YES",
    "label": "Sí",
    "description": "La versión instalada sigue recibiendo parches o actualizaciones."
  },
  {
    "value": "NO",
    "label": "No",
    "description": "La versión instalada ya no recibe parches ni actualizaciones."
  },
  {
    "value": "UNKNOWN",
    "label": "No determinado",
    "description": "No se ha confirmado si la versión recibe actualizaciones."
  }
]

export const licenseStatusOptions: Option<AnswerStatus>[] = [
  {
    "value": "YES",
    "label": "Sí",
    "description": "El uso está respaldado por una licencia o contrato válido."
  },
  {
    "value": "NO",
    "label": "No",
    "description": "Se confirmó que no existe una licencia o contrato vigente que respalde el uso."
  },
  {
    "value": "UNKNOWN",
    "label": "No determinado",
    "description": "La situación de la licencia o contrato está pendiente de verificar."
  }
]

export const similarOptions: Option<"true" | "false">[] = [
  {
    "value": "false",
    "label": "No",
    "description": "No se ha identificado otra solución con funciones similares."
  },
  {
    "value": "true",
    "label": "Sí",
    "description": "Existe otra solución que cubre total o parcialmente la misma necesidad."
  }
]

export const problemOptions: Option<"true" | "false">[] = [
  {
    "value": "false",
    "label": "No",
    "description": "No se han identificado problemas o limitaciones conocidos."
  },
  {
    "value": "true",
    "label": "Sí",
    "description": "Hay dificultades funcionales, técnicas, operativas o contractuales que deben describirse."
  }
]

export const replacementOptions: Option<"true" | "false">[] = [
  {
    "value": "false",
    "label": "No",
    "description": "No se ha identificado un esfuerzo formal o planificado de sustitución o retiro."
  },
  {
    "value": "true",
    "label": "Sí",
    "description": "Existe un esfuerzo formal o planificado para reemplazar o retirar la solución."
  }
]
