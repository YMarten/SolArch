# Complementación documental de aplicaciones internas

2026-09-17T14:49:56.345Z

Se actualizaron 22 soluciones, completando 100 campos vacíos o UNKNOWN y 80 asociaciones tecnológicas. Se crearon 19 entradas del catálogo de tecnologías. Los cambios se realizaron mediante la API y se comprobaron por lectura posterior. No se sobrescribieron campos ya informados.

## Cambios realizados

| Solución | Campos completados | Tecnologías asociadas |
|---|---|---:|
| Aplicaciones de Interfaz | knownDependencies | 4 |
| ServicioRica | businessProcess, knownDependencies, hostingMode, usageFrequency, additionalNotes | 4 |
| WebServiceRica | businessProcess, knownDependencies, hostingMode, additionalNotes | 3 |
| CargarOrdenCarga | businessProcess, knownDependencies, hostingMode, userGroups, additionalNotes | 4 |
| Download Expendio | businessProcess, knownDependencies, hostingMode, usageFrequency, userGroups, additionalNotes | 4 |
| Genera Orden Hana | businessProcess, knownDependencies, hostingMode, additionalNotes | 3 |
| GeoRica | businessProcess, knownDependencies, userGroups, additionalNotes | 5 |
| Lotería Rica | businessProcess, knownDependencies, userGroups, additionalNotes | 4 |
| Menú Rica | businessProcess, knownDependencies, hostingMode, userGroups, additionalNotes | 4 |
| Portal Proveedores | businessProcess, knownDependencies, userGroups, additionalNotes | 6 |
| App Recolección | businessProcess, knownDependencies, usageFrequency, userGroups, additionalNotes | 3 |
| Reportes SQL | businessProcess, knownDependencies, hostingMode, userGroups, additionalNotes | 3 |
| Servicio Mail (SendMail) | businessProcess, hostingMode, additionalNotes | 4 |
| WS_BAVEL_S4 | businessProcess, knownDependencies, hostingMode, additionalNotes | 3 |
| WS_PUNTO_VENTA | businessProcess, knownDependencies, hostingMode, additionalNotes | 3 |
| WS_SYNAGRO | businessProcess, knownDependencies, hostingMode, additionalNotes | 5 |
| Update_RNC | businessProcess, techOwner, knownDependencies, hostingMode, userGroups, additionalNotes | 3 |
| ITS - Estacion de muestras | businessProcess, techOwner, knownDependencies, userGroups, additionalNotes | 3 |
| ITS - PickingPro | businessProcess, techOwner, knownDependencies, userGroups, additionalNotes, responsibleAreaId | 3 |
| ITS - CombuSys | businessProcess, techOwner, knownDependencies, userGroups, additionalNotes | 3 |
| ITS - LiquiProd | businessProcess, techOwner, knownDependencies, userGroups, additionalNotes | 3 |
| ITS - Control de seguridad | businessProcess, techOwner, knownDependencies, userGroups, additionalNotes, responsibleAreaId | 3 |

## Fuentes y decisiones por solución

### Aplicaciones de Interfaz

Fuente: Aplicativos Rica  1\Plantila - Aplicaciones de Interfaz .docx

- knownDependencies: 4. Dependencias.

Pendiente: La ficha indica Activo y SolArch DEPRECATED. Se conserva el estado actual del inventario.


### ServicioRica

Fuente: Aplicativos Rica  1\Plantila - ServicioRica .docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- knownDependencies: 4. Dependencias.
- hostingMode: 3. Tecnologías, declaración de alojamiento.
- usageFrequency: 2. Descripción: supervisión constante de tareas.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.

### WebServiceRica

Fuente: Aplicativos Rica  1\Plantila - WebServiceRica .docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- knownDependencies: 4. Dependencias.
- hostingMode: 3. Tecnologías, declaración de alojamiento.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.

### CargarOrdenCarga

Fuente: Aplicativos Rica  1\Plantilla - CargarOrdenCarga.docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- knownDependencies: 4. Dependencias.
- hostingMode: 3. Tecnologías, declaración de alojamiento.
- userGroups: 2. Descripción y 6. Equipo responsable.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.

Pendiente: La ficha indica .NET 4.0 y una ruta de DownloadExpendios; Excel indica .NET 4.5+ y una ruta propia de CargarOrdenCarga. Confirmar versión y repositorio.


### Download Expendio

Fuente: Aplicativos Rica  1\Plantilla - Donwload Expendios.docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- knownDependencies: 4. Dependencias.
- hostingMode: 3. Tecnologías, declaración de alojamiento.
- usageFrequency: 2. Descripción: ejecución o registro diario.
- userGroups: 2. Descripción y 6. Equipo responsable.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.

Pendiente: La dependencia WS_SEND_MAILJI8[ contiene un posible error de transcripción; se conserva literalmente para validación.


### Genera Orden Hana

Fuente: Aplicativos Rica  1\Plantilla - Genera orden hana .docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- knownDependencies: 4. Dependencias.
- hostingMode: 3. Tecnologías, declaración de alojamiento.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.

Pendiente: La ficha declara .NET 3.5 y Excel .NET 4.5+. Confirmar versión.


### GeoRica

Fuente: Aplicativos Rica  1\Plantilla - GeoRica .docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- knownDependencies: 2. Descripción.
- userGroups: 2. Descripción y 6. Equipo responsable.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.

Pendiente: La ficha indica On Premise y aplicación Android. Confirmar el alcance del alojamiento de sus servicios antes de clasificar la solución completa.


### Lotería Rica

Fuente: Aplicativos Rica  1\Plantilla - Loteria Rica.docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- knownDependencies: 4. Dependencias.
- userGroups: 2. Descripción y 6. Equipo responsable.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.

Pendiente: La ficha menciona .NET 3.5 y 4.0; Excel indica 3.5. Figura Obsoleto en la ficha y RETIRED en SolArch; se conserva RETIRED.


### Menú Rica

Fuente: Aplicativos Rica  1\Plantilla - Menu Rica.docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- knownDependencies: 4. Dependencias.
- hostingMode: 3. Tecnologías, declaración de alojamiento.
- userGroups: 2. Descripción y 6. Equipo responsable.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.

Pendiente: La ficha declara .NET 4.0 y Excel .NET 4.5+. Confirmar versión.


### Portal Proveedores

Fuente: Aplicativos Rica  1\Plantilla - Portal de Proveedores .docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- knownDependencies: 4. Dependencias.
- userGroups: 2. Descripción y 6. Equipo responsable.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.

Pendiente: La ficha indica Cloud, sin identificar si la cuenta es de Grupo Rica o del proveedor. Alojamiento y administración pendientes.


### App Recolección

Fuente: Aplicativos Rica  1\Plantilla - Recoleccion.docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- knownDependencies: 4. Dependencias.
- usageFrequency: 2. Descripción: ejecución o registro diario.
- userGroups: 2. Descripción y 6. Equipo responsable.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.

Pendiente: La ficha documenta riesgos de compilación con Android Gradle Plugin 3.5.3 en IDEs de 2025. Confirmar si fueron resueltos antes de cambiar hasProblems. La aplicación móvil no permite concluir por sí sola el alojamiento de sus servicios.


### Reportes SQL

Fuente: Aplicativos Rica  1\Plantilla - Reportes SQL.docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- knownDependencies: 2. Descripción y 3. Tecnologías.
- hostingMode: 3. Tecnologías, declaración de alojamiento.
- userGroups: 2. Descripción y 6. Equipo responsable.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.

### Servicio Mail (SendMail)

Fuente: Aplicativos Rica  1\Plantilla - Servicio Mail.docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- hostingMode: 3. Tecnologías, declaración de alojamiento.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.

Pendiente: La ficha declara .NET 4.0 y Excel .NET 4.5+. Confirmar versión.


### WS_BAVEL_S4

Fuente: Aplicativos Rica  1\Plantilla - WS_BAVEL_S4 .docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- knownDependencies: 4. Dependencias.
- hostingMode: 3. Tecnologías, declaración de alojamiento.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.

Pendiente: La ficha declara C# y Excel Visual Basic. Se omite asignar lenguaje hasta confirmar.


### WS_PUNTO_VENTA

Fuente: Aplicativos Rica  1\Plantilla - WS_PUNTO_VENTA.docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- knownDependencies: 4. Dependencias.
- hostingMode: 3. Tecnologías, declaración de alojamiento.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.

### WS_SYNAGRO

Fuente: Aplicativos Rica  1\Plantilla - WS_SYNAGRO .docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- knownDependencies: 2. Descripción.
- hostingMode: 3. Tecnologías, declaración de alojamiento.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.

Pendiente: La ficha declara .NET 4.0 y Excel .NET 4.5+. Se menciona SQL Server y también entornos Sybase; confirmar arquitectura de datos.


### Update_RNC

Fuente: Plantilla - Aplicativos Faltantes 2\Plantilla - UpdateRNC.docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- techOwner: 6. Contactos.
- knownDependencies: 2. Descripción y 4. Dependencias.
- hostingMode: 3. Tecnologías, declaración de alojamiento.
- userGroups: 2. Descripción y 6. Equipo responsable.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.

### ITS - Estacion de muestras

Fuente: Plantilla - Aplicativos Faltantes 2\Plantilla - Extraccion de muestras.docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- techOwner: 6. Contactos.
- knownDependencies: 3. Tecnologías.
- userGroups: 2. Descripción y 6. Equipo responsable.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.

Pendiente: La ficha declara On Premise pero publica una URL de SAP HEC. No se asigna alojamiento sin confirmar la cuenta y el alcance de infraestructura.


### ITS - PickingPro

Fuente: Plantilla - Aplicativos Faltantes 2\Plantilla - PickingPro.docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- techOwner: 6. Contactos.
- knownDependencies: 3. Tecnologías.
- userGroups: 2. Descripción y 6. Equipo responsable.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.
- responsibleAreaId: Área responsable y equipo responsable — Correspondencia con la dirección existente en el catálogo: DIRECCION GESTION LOGISTICA.

Pendiente: La ficha declara On Premise pero publica una URL de SAP HEC. No se asigna alojamiento sin confirmar la cuenta y el alcance de infraestructura.


### ITS - CombuSys

Fuente: Plantilla - Aplicativos Faltantes 2\Plantilla - CombuSys.docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- techOwner: 6. Contactos.
- knownDependencies: 3. Tecnologías.
- userGroups: 2. Descripción y 6. Equipo responsable.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.

Pendiente: La ficha declara On Premise pero publica una URL de SAP HEC. No se asigna alojamiento sin confirmar la cuenta y el alcance de infraestructura.


### ITS - LiquiProd

Fuente: Plantilla - Aplicativos Faltantes 2\Plantilla - LiquiProd.docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- techOwner: 6. Contactos.
- knownDependencies: 3. Tecnologías.
- userGroups: 2. Descripción y 6. Equipo responsable.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.

Pendiente: La ficha declara On Premise pero publica una URL de SAP HEC. No se asigna alojamiento sin confirmar la cuenta y el alcance de infraestructura.


### ITS - Control de seguridad

Fuente: Plantilla - Aplicativos Faltantes 2\Plantilla - Control de seguridad .docx

- businessProcess: 2. Descripción — Síntesis del proceso descrito.
- techOwner: 6. Contactos.
- knownDependencies: 3. Tecnologías.
- userGroups: 2. Descripción y 6. Equipo responsable.
- additionalNotes: 3. Tecnologías, 5. Información operativa y 7. Notas.
- responsibleAreaId: Área responsable y equipo responsable — Correspondencia con la dirección existente en el catálogo: DIRECCION DE SEGURIDAD.

Pendiente: La ficha declara On Premise pero publica una URL de SAP HEC. No se asigna alojamiento sin confirmar la cuenta y el alcance de infraestructura.


## Información pendiente de confirmar

- Scania Refresh Token y WS_SCANIA: Excel menciona “Scania Services”, sin distinguir ambos componentes. No se trasladaron sus tecnologías automáticamente.
- Latirica - Kiosko y Captacion de clientes: no se encontró una ficha propia en el directorio.
- No se confundió versión de framework con versión de aplicación. Las versiones tecnológicas documentadas se conservaron en observaciones cuando ese campo estaba vacío.
- Las rutas C:\desarollo son ubicaciones locales, no URLs de repositorio verificadas. Se conservaron en observaciones, sin poblar repoUrl con rutas de archivos. CargarOrdenCarga tiene rutas contradictorias.
- Las URLs se guardaron como evidencia en observaciones; no se crearon ambientes PROD sin confirmación expresa del ambiente.
- El alojamiento ITS requiere aclarar la declaración On Premise frente a las URLs de SAP HEC. Portal Proveedores declara Cloud sin especificar titularidad de la cuenta. Las aplicaciones móviles requieren aclarar el alojamiento de sus servicios.
- La asignación de área principal se limitó a PickingPro → Dirección Gestión Logística y Control de seguridad → Dirección de Seguridad. Almacén, Liquidación e Ingeniería de Rutas no se vincularon a una dirección por suposición; Estación de Muestras menciona dos áreas sin señalar cuál es la principal.
- No se derivaron estados de uso de la palabra Activo ni se cambiaron estados arquitectónicos actuales con fichas históricas. No se completaron soporte, licencias, administración, impacto o responsables funcionales sin evidencia suficiente.
- App Recolección contiene un riesgo documentado sobre Gradle e IDEs de 2025, guardado como pendiente en observaciones; confirmar vigencia antes de cambiar hasProblems.
- Los campos booleanos previamente guardados se conservaron; false no se trató como un campo vacío.
- Las dependencias se registraron como texto. No se crearon conexiones con tipos o direcciones supuestos.
- Los archivos ZIP no contienen documentos adicionales respecto de las carpetas extraídas. Los documentos y PDFs de proveedores no se usaron para atribuir características a soluciones internas distintas.

## Trazabilidad

plan-con-fuentes.json contiene cada valor propuesto y su fuente; resultado.json conserva los valores anteriores, los cambios enviados y la lectura posterior; respaldo-antes.json conserva la fotografía anterior del modelo de negocio. No se modificaron los documentos fuente ni el código de SolArch.
