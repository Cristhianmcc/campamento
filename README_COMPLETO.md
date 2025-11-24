# Sistema de Inscripciones y Talleres - Campamento

## 📋 Descripción General

Sistema web completo para la gestión de inscripciones a un campamento cristiano con las siguientes funcionalidades:

### ✨ Funcionalidades Principales

1. **Registro de Participantes**
   - Formulario de inscripción con validación
   - Verificación de DNI único
   - Almacenamiento automático en Google Sheets

2. **Proceso de Pago**
   - Visualización de métodos de pago (YAPE y PLIN con QR)
   - Carga de comprobante de pago (imagen)
   - Envío automático por WhatsApp con datos del usuario

3. **Sistema de Talleres**
   - Verificación de pago confirmado mediante DNI
   - Selección de taller (solo UNO por participante)
   - Modal de confirmación antes del registro
   - Control de capacidad por taller
   - Persistencia en Google Sheets

4. **Restricciones y Seguridad**
   - Un usuario solo puede registrarse una vez
   - Solo usuarios con pago confirmado acceden a talleres
   - No se puede cambiar de taller después del registro
   - Validaciones en tiempo real

## 🔄 Flujo Completo del Usuario

### Fase 1: Inscripción y Pago
```
1. Usuario entra a la página web
2. Llena el formulario de inscripción
3. Se valida que el DNI no esté registrado
4. Datos se guardan en Google Sheets (hoja "Pendientes")
5. Se abre modal de pago con QR de YAPE/PLIN
6. Usuario realiza el pago
7. Usuario adjunta captura del comprobante
8. Se envía por WhatsApp con su DNI incluido
9. Usuario espera confirmación del organizador
```

### Fase 2: Confirmación (Manual por el Organizador)
```
1. Organizador recibe comprobante por WhatsApp
2. Verifica el pago en su banco/app
3. Abre Google Sheets
4. Mueve la fila del usuario de "Pendientes" a "Confirmadas"
5. Cambia estado de "Pendiente" a "Confirmado"
6. Agrega fecha de confirmación
```

### Fase 3: Registro en Taller
```
1. Usuario hace clic en "Ir a Talleres"
2. Ingresa su DNI
3. Sistema verifica en Google Sheets (hoja "Confirmadas")
4. Si pago confirmado → acceso permitido
5. Si no confirmado → acceso denegado
6. Usuario ve lista de talleres disponibles
7. Selecciona un taller
8. Confirma en modal
9. Se registra (columna M y N se actualizan en Sheets)
10. Usuario es redirigido a pantalla de "Ya registrado"
11. No puede acceder a más talleres
```

## 🛠️ Configuración Técnica

### Requisitos Previos
- Node.js instalado
- Cuenta de Google con acceso a Google Sheets
- Cuenta de WhatsApp Business (recomendado)

### Instalación
```bash
npm install
```

### Configuración de Google Sheets

1. **Crear Google Sheet**
   - Crear nueva hoja de cálculo
   - Crear dos hojas: "Pendientes" y "Confirmadas"
   - Agregar encabezados en ambas (ver CONFIGURACION_TALLERES.md)

2. **Obtener API Key**
   - Ir a Google Cloud Console
   - Habilitar Google Sheets API
   - Crear clave de API
   - Copiar la clave

3. **Configurar en el Proyecto**
   - Abrir `src/config/campamento.ts`
   - Reemplazar `TU_API_KEY_DE_GOOGLE` con tu API key
   - Reemplazar `TU_SPREADSHEET_ID` con el ID de tu hoja

4. **Permisos**
   - Compartir la hoja con "Cualquier persona con el enlace puede editar"

### Configuración de Talleres

Editar `src/config/campamento.ts`:
```typescript
talleres: [
  {
    id: "taller-1",
    nombre: "Nombre del Taller",
    descripcion: "Descripción del taller",
    instructor: "Nombre del instructor",
    capacidadMaxima: 30,
    inscritos: 0,
    horario: "Horario",
    lugar: "Lugar"
  },
  // ... más talleres
]
```

### Configuración de Pagos

Actualizar en `src/config/campamento.ts`:
- `yapeNumero`: Número de YAPE
- `plinNumero`: Número de PLIN
- `imagenQRYape`: URL de imagen QR de YAPE
- `imagenQRPlin`: URL de imagen QR de PLIN
- `contacto.whatsapp`: Número de WhatsApp (solo números)

## 🚀 Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── FormularioInscripcion.tsx    # Formulario inicial
│   ├── ModalPago.tsx                # Modal de pago con carga de imagen
│   ├── TalleresAcceso.tsx          # Verificación de DNI
│   ├── SeleccionTaller.tsx         # Selección de talleres
│   └── ...otros componentes
├── config/
│   └── campamento.ts               # Configuración general
├── services/
│   └── googleSheets.ts             # Servicio de Google Sheets
└── App.tsx                         # Componente principal con navegación
```

## 📊 Estructura de Google Sheets

### Hoja "Pendientes"
| A | B | C | D | E | F | G | H | I | J | K | L | M | N |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Código | Nombres | Apellidos | Edad | DNI | Email | Teléfono | Iglesia | Necesidades | Estado | Fecha Insc. | Fecha Conf. | Taller | Fecha Taller |

### Hoja "Confirmadas"
| A | B | C | D | E | F | G | H | I | J | K | L | M | N |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Código | Nombres | Apellidos | Edad | DNI | Email | Teléfono | Iglesia | Necesidades | Estado | Fecha Insc. | Fecha Conf. | Taller | Fecha Taller |

**Diferencias:**
- Estado en "Confirmadas" debe ser "Confirmado"
- Columnas M y N se llenan cuando el usuario se registra en un taller

## 🎯 Características Importantes

### Validaciones Implementadas
- ✅ DNI único (no duplicados)
- ✅ Formato de email válido
- ✅ DNI de 8 dígitos
- ✅ Teléfono mínimo 9 dígitos
- ✅ Imagen del comprobante obligatoria
- ✅ Verificación de pago confirmado para talleres
- ✅ Un solo taller por usuario

### Seguridad
- ⚠️ API Key expuesta en frontend (solo para desarrollo/prototipo)
- ⚠️ Para producción: usar backend + OAuth 2.0
- ⚠️ Nunca exponer credenciales en repositorio público

## 📝 Notas para el Organizador

### Proceso Manual de Confirmación
1. Cuando recibas un comprobante por WhatsApp
2. Anota el DNI del usuario
3. Abre Google Sheets
4. Busca el DNI en "Pendientes"
5. Copia toda la fila
6. Pégala en "Confirmadas"
7. Cambia "Pendiente" a "Confirmado" en columna J
8. Agrega fecha en columna L
9. Elimina la fila de "Pendientes"

### Gestión de Talleres
- Para ver inscritos: filtrar columna M por ID de taller
- Para cambiar taller de alguien: borrar contenido de M y N
- Para aumentar capacidad: editar `campamento.ts`

## 🐛 Solución de Problemas

**"Usuario no puede acceder a talleres"**
- Verificar que esté en hoja "Confirmadas"
- Verificar que columna J diga "Confirmado"

**"Error al guardar en Google Sheets"**
- Verificar API Key
- Verificar ID de la hoja
- Verificar permisos de edición

**"No se adjunta imagen en WhatsApp"**
- Normal: WhatsApp Web no permite adjuntar archivos por URL
- Usuario debe adjuntar manualmente después de abrir WhatsApp

## 📞 Soporte

Para dudas o problemas, contactar con el desarrollador.

## 📄 Licencia

Este proyecto es de uso exclusivo para la iglesia/organización.
