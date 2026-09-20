# Contexto de SolArch y del inventario de arquitectura de Grupo Rica

## Propósito de este paquete

SolArch apoya la práctica de Arquitectura de Soluciones de Grupo Rica mediante el registro y análisis de su portafolio de aplicaciones. Este documento y el archivo inventario-solarch.json se entregan como contexto para evaluar la arquitectura, detectar información pendiente y formular recomendaciones sustentadas.

La prioridad expresada es la Línea de acción 4, Modernización y retiro de soluciones obsoletas: evaluar soluciones de terceros para decidir si deben mantenerse, actualizarse, modernizarse, reemplazarse o retirarse. El inventario incluye también soluciones internas y desarrollos a medida por terceros para entender el ecosistema completo. No se asume que el inventario esté validado ni completo respecto de la operación real; se está solicitando su revisión al equipo.

## Fuente y vigencia

- Extracción actual: 2026-09-17T12:55:44.781Z (UTC).
- Fuente: base de datos de SolArch, consultada en una única transacción de solo lectura con aislamiento REPEATABLE READ.
- No se utilizó la copia del 15 de septiembre para esta exportación.
- Se conservaron todos los registros y columnas de las 16 tablas del modelo de negocio, sin resumir descripciones ni modificar valores. No se incluyen tablas internas de migraciones, credenciales de conexión ni archivos de entorno.
- Se verificaron las 22 relaciones de clave foránea y la coincidencia de los 18 enums de PostgreSQL con el modelo Prisma.
- Rica Insights existe en la base de datos con ese nombre, origen CUSTOM_THIRD y rol DATA_ANALYTICS. Sus demás campos se presentan tal como están registrados.
- El JSON es una fotografía del inventario, no una sincronización con la aplicación.

## Cómo leer el JSON

| Sección | Contenido |
|---|---|
| metadata | Fecha, alcance, cantidades y reglas de interpretación. |
| enums | Todos los códigos vigentes y etiquetas explicativas en español. Las variantes de etiquetas de interfaz incluyen su archivo de origen y se agrupan por código; un código compartido puede tener textos distintos según el campo. |
| selectionFields | Asociación entre modelo, campo y enum; obligatoriedad y valor predeterminado en la base de datos. |
| additionalSelections | Booleanos, niveles de capacidad, dirección de conexiones y fuentes de selecciones dinámicas. |
| catalogs | Dominios, áreas, capacidades y tecnologías completos, incluso si no están asociados a soluciones. |
| solutions | Todos los campos escalares de cada solución, sus tablas de asociación y sus ambientes, adjuntos, revisiones e historial. |
| connections | Conexiones completas con fromId y toId. Se guardan una sola vez para evitar duplicados. |
| dataDictionary | Columnas reales de la base de datos, claves foráneas y modelo Prisma completo. |
| validation | Comprobaciones de integridad y cantidades de valores faltantes por campo. |

Los identificadores son las claves para relacionar los datos. Por ejemplo, solutions[].domains[].domainId referencia catalogs.businessDomains[].id. Cada relación tecnológica conserva su versión específica. responsibleAreaId referencia el área principal; areas contiene las áreas relacionadas, que son un concepto distinto. similarSolutionId y replacementSolutionId apuntan a otras soluciones del mismo inventario. Las relaciones inversas se reconstruyen mediante estos identificadores sin copiar recursivamente las soluciones.

Las revisiones se almacenan en archReviews, con dimensions y actions anidadas. El historial se conserva en changelog, incluidos valores anteriores que pueden contener códigos ya retirados. Estos códigos históricos no son opciones vigentes. La exportación no interpreta ni reescribe el texto del historial.

## Interpretación de los datos

- null significa que no hay un valor registrado; no equivale a No.
- Una cadena vacía se mantiene distinta de null. Ambas pueden representar información pendiente.
- UNKNOWN es una opción explícita de información no determinada.
- Una lista vacía significa que no hay registros asociados; no demuestra ausencia real de usuarios, dependencias o integraciones.
- Los booleanos false se conservan como están. Algunos tienen false como valor predeterminado, por lo que no necesariamente provienen de una validación expresa del responsable.
- Los datos registrados no constituyen una certificación de exactitud. Las descripciones pueden mencionar integraciones aunque connections esté vacío.
- No se debe inferir tecnología, criticidad, soporte, alojamiento o estado únicamente por el nombre comercial de una solución.
- No se descargan documentos desde los enlaces de adjuntos. El JSON exporta sus metadatos y URL cuando existen.

## Conceptos y decisiones acordadas

### Estado arquitectónico y estado de uso

status indica el ciclo de vida arquitectónico: Activa, Solo mantenimiento, Obsoleta, En sustitución, En desarrollo o Retirada. Se ubica en Identificación en el formulario. usageStatus indica el uso actual: En uso, Uso limitado o Fuera de uso, dentro de Uso y responsabilidad.

Una solución obsoleta puede seguir utilizándose. Retirada representa una solución cuyo retiro del ecosistema se ha realizado; cualquier contradicción con su estado de uso debe validarse. En sustitución pertenece al estado arquitectónico, no al estado de uso. legacyUsageStatus conserva información histórica de la transición y no es un campo de selección vigente.

### Rol arquitectónico

- CORE_TRANSACTIONAL: sistema de registro que ejecuta procesos críticos y mantiene datos oficiales maestros o transaccionales.
- SATELLITE: solución que complementa al core con funciones de negocio o acceso e interacción para usuarios.
- INTEGRATION: solución cuya responsabilidad principal es comunicar sistemas o facilitar el intercambio de información.
- DATA_ANALYTICS: solución orientada al análisis y reporte de información.

Canal dejó de ser un rol independiente. Su alcance se integra en Satélite y INTERACTION_CHANNEL fue retirado del enum vigente. La migración convierte registros de ese rol a SATELLITE y conserva la trazabilidad del cambio. No recomendar restablecer Canal sin plantearlo expresamente como una nueva decisión de arquitectura.

Tipo y rol describen dimensiones diferentes. Una aplicación programada puede clasificarse por su funcionamiento como BATCH y desempeñar un rol de INTEGRATION; la tecnología con la que se construyó no determina por sí sola su rol. Estas son pautas de interpretación, no reclasificaciones automáticas de los registros exportados.

### Origen, alojamiento y administración

origin identifica si la solución es interna, un producto externo o un desarrollo a medida por tercero. hostingMode indica dónde opera; managementModel indica quién administra la plataforma. No inferir los últimos dos campos a partir del origen.

Alojamiento: ON_PREMISE, CLOUD_COMPANY, EXTERNAL, HYBRID y UNKNOWN. Administración: COMPANY_MANAGED, PROVIDER_MANAGED, SHARED_MANAGEMENT y UNKNOWN. No se creó un campo adicional para SaaS.

La separación migró ON_PREMISE a alojamiento interno y administración interna; CLOUD_COMPANY a nube de la empresa y administración desconocida; SAAS y PROVIDER_HOSTED a alojamiento externo y administración del proveedor; HYBRID a híbrido y administración desconocida; UNKNOWN a ambos desconocidos. Los valores actuales del inventario pueden haber sido actualizados después.

Advertencia de documentación: los comentarios históricos de SolutionOrigin en Prisma vinculan EXTERNAL con alojamiento del proveedor y CUSTOM_THIRD con infraestructura propia. Esa redacción es más restrictiva que la separación actual de dimensiones; no debe usarse para sobrescribir los valores explícitos de alojamiento y administración.

## Información que registra una solución

| Grupo | Campos |
|---|---|
| Identificación | id, name, description, version, status, type, role, criticality, origin. |
| Responsabilidad y uso | owner, techOwner, responsibleAreaId, businessProcess, userGroups, usageStatus, legacyUsageStatus, usageFrequency. |
| Proveedor y vigencia | vendor, supportStatus, receivesUpdates, licenseStatus. |
| Operación | hostingMode, managementModel, knownDependencies, failureImpact, failureImpactDetails. |
| Riesgos y similitudes | hasSimilarSolution, similarSolutionId, hasProblems, problemDetails. |
| Sustitución | hasReplacementInitiative, replacementSolutionId, proposedReplacementName. |
| Información complementaria | repoUrl, lastDeploy, tags, additionalNotes, createdAt, updatedAt. |
| Asociaciones y seguimiento | technologies, domains, capabilities, areas, environments, attachments, archReviews, changelog y connections en la colección global. |

owner es el responsable funcional y techOwner el técnico. businessProcess describe el proceso soportado y userGroups los grupos de usuarios. criticality representa la criticidad de negocio; failureImpact y failureImpactDetails registran el nivel y las consecuencias de una falla. knownDependencies permite información narrativa adicional a las conexiones estructuradas. Los nombres, tipos, nulabilidad y valores predeterminados exactos están en dataDictionary.

## Funcionalidad observada en el código

SolArch incluye catálogo de soluciones, creación, edición y detalle; catálogos de áreas, dominios, capacidades y tecnologías; visualización del ecosistema mediante D3; mapa de capacidades; revisiones de arquitectura y seguimiento de acciones. Las entidades del modelo también soportan ambientes, enlaces documentales, conexiones e historial.

El catálogo de soluciones realiza búsqueda textual y filtros de estado arquitectónico, criticidad, rol, estado de uso, alojamiento, administración, soporte, problemas e iniciativas de sustitución. Esos filtros se ejecutan en el frontend sobre las soluciones cargadas.

Las opciones no son todas catálogos editables en base de datos: los enums están en Prisma y PostgreSQL, mientras sus etiquetas y varias listas están definidas en el frontend. Áreas, dominios, capacidades y tecnologías sí se obtienen de sus catálogos. Etiquetas y grupos de usuarios son listas libres. Environment.name es texto, no un enum.

No se observó control de acceso por rol en las rutas de soluciones revisadas. La presencia de dependencias de autenticación en package.json no demuestra que exista autorización aplicada. No asumir que el estado arquitectónico está restringido a Arquitectura.

## Arquitectura técnica observada

Backend TypeScript con Fastify, Prisma 7 y PostgreSQL; separación entre rutas, servicios y DTO. Frontend Next.js 16.2.9, React 19.2.4, Mantine 9 y D3, según los manifiestos actuales. Hay documentación anterior que menciona Next.js 14 y Mantine anteriores; para esta descripción se priorizaron los manifiestos vigentes. Prisma utiliza el adaptador PostgreSQL.

Las entidades centrales son Solution, Technology, BusinessDomain, BusinessCapability, BusinessArea, Connection, Attachment, Environment, ArchReview y ChangeLog. Las relaciones múltiples usan tablas explícitas; las revisiones contienen ReviewDimension y ReviewAction. Los dominios y las capacidades pueden ser jerárquicos.

Las rutas principales son /api/solutions, /api/technologies, /api/domains, /api/areas, /api/capabilities, /api/connections, /api/attachments, /api/environments y /api/reviews. La exportación se obtuvo mediante lectura directa para cubrir tablas y columnas que no devuelve el listado simplificado de soluciones.

## Cobertura del inventario exportado

| Entidad | Registros |
|---|---:|
| Solution | 52 |
| Technology | 0 |
| TechnologyOnSolution | 0 |
| BusinessDomain | 11 |
| DomainOnSolution | 34 |
| BusinessCapability | 1 |
| CapabilityOnSolution | 0 |
| BusinessArea | 15 |
| AreaOnSolution | 56 |
| Connection | 0 |
| Attachment | 0 |
| Environment | 0 |
| ArchReview | 0 |
| ReviewDimension | 0 |
| ReviewAction | 0 |
| ChangeLog | 25 |

Orígenes: 26 internas, 24 externas y 2 a medida por terceros. Estados arquitectónicos: 40 activas, 4 obsoletas, 4 en sustitución, 3 en desarrollo y 1 retirada.

Hay 34 asociaciones con dominios y 56 con áreas; son relaciones, no cantidades de soluciones únicas. Existen 25 registros de historial, lo que no demuestra una auditoría completa de todas las modificaciones del inventario.

## Vacíos relevantes para la evaluación

- 26 soluciones no tienen área responsable principal, proceso de negocio ni estado de uso registrados.
- 26 tienen dueño funcional vacío y 26 no tienen dueño técnico registrado.
- 51 no tienen versión informada y 51 tienen la lista de grupos de usuarios vacía.
- 26 tienen alojamiento UNKNOWN; 27 tienen administración UNKNOWN.
- 28 tienen soporte UNKNOWN; 27 no tienen determinada la recepción de actualizaciones; 32 tienen licenciamiento UNKNOWN.
- 29 tienen impacto de falla UNKNOWN.
- No hay conexiones, tecnologías, ambientes, adjuntos ni revisiones registrados. La capacidad existente no está asociada a soluciones.

Estos son faltantes del registro, no conclusiones sobre las condiciones operativas. Se recomienda contrastar con los responsables funcionales y técnicos antes de decidir retiros o sustituciones.

## Instrucciones para el proyecto de Arquitectura en ChatGPT

Actúa como apoyo a la práctica de Arquitectura de Soluciones de Grupo Rica. Usa este contexto y el JSON adjunto como evidencia fechada. Distingue en cada recomendación entre hechos registrados, inferencias, inconsistencias y preguntas por resolver. Referencia las soluciones por nombre e identificador cuando propongas acciones concretas.

Primero evalúa la cobertura y calidad del inventario. Después identifica posibles inconsistencias de clasificación, solapamientos funcionales y dependencias que necesiten confirmación. Propón un plan priorizado para completar el levantamiento y evaluar las alternativas de mantener, actualizar, modernizar, reemplazar o retirar cada solución, indicando la evidencia necesaria y el responsable que debería validarla.

No inventes integraciones ni capacidades. No interpretes valores vacíos como No y no conviertas booleanos predeterminados en verificaciones confirmadas. No asumas que obsolescencia implica ausencia de uso ni que el origen determina el alojamiento. No cambies clasificaciones sin explicar la evidencia y proponer su validación. Las sugerencias son recomendaciones pendientes de decisión del equipo, no cambios ya realizados en SolArch.
