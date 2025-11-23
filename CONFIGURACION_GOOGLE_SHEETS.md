# Configuración de Google Sheets para Inscripciones

## Paso 1: Crear tu Google Sheet

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Nómbrala como "Inscripciones Campamento 2025" (o el nombre que prefieras)

## Paso 2: Configurar las Hojas

### Hoja 1: Pendientes
1. Renombra la primera hoja (abajo) a **"Pendientes"** exactamente con ese nombre
2. En la fila 1, agrega estos encabezados:

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Código | Nombres | Apellidos | Edad | DNI | Email | Teléfono | Iglesia | Necesidades Especiales | Estado Pago | Fecha Inscripción | Fecha Confirmación |

### Hoja 2: Confirmadas
1. Crea una segunda hoja (botón + abajo)
2. Nómbrala **"Confirmadas"** exactamente con ese nombre
3. Copia los mismos encabezados de la hoja "Pendientes"

## Paso 3: Configurar Permisos

1. Haz clic en el botón **"Compartir"** (arriba a la derecha)
2. En "Acceso general", selecciona **"Cualquier persona con el enlace"**
3. Cambia el permiso a **"Editor"**
4. Haz clic en "Listo"

## Paso 4: Obtener el ID de la Hoja

1. Copia la URL de tu Google Sheet
2. La URL se ve así: `https://docs.google.com/spreadsheets/d/AQUI_ESTA_EL_ID/edit`
3. Copia solo la parte entre `/d/` y `/edit`
4. Ese es tu **SPREADSHEET_ID**

Ejemplo:
```
URL: https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit
ID:  1a2b3c4d5e6f7g8h9i0j
```

## Paso 5: Obtener API Key de Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. En el menú lateral, ve a **"APIs y servicios"** > **"Biblioteca"**
4. Busca **"Google Sheets API"**
5. Haz clic en ella y presiona **"Habilitar"**
6. Ve a **"APIs y servicios"** > **"Credenciales"**
7. Haz clic en **"Crear credenciales"** > **"Clave de API"**
8. Copia la clave generada (se ve como: `AIzaSyABC123def456GHI789jkl`)

## Paso 6: Configurar en tu Proyecto

Abre el archivo `src/config/campamento.ts` y actualiza:

```typescript
googleSheets: {
  apiKey: "TU_API_KEY_AQUI", // La API Key del paso 5
  spreadsheetId: "TU_SPREADSHEET_ID_AQUI", // El ID del paso 4
  rangePendientes: "Pendientes!A:L",
  rangeConfirmadas: "Confirmadas!A:L",
},
```

## Cómo Ver los Datos Registrados

### Opción 1: Directamente en Google Sheets
1. Abre tu Google Sheet
2. Ve a la hoja **"Pendientes"**
3. Ahí verás todas las inscripciones que se registren
4. Cada fila es una inscripción nueva

### Opción 2: Verificar Pagos
Cuando recibas un WhatsApp con una captura:

1. Busca el **código de inscripción** que te enviaron (ej: 12345678-1234)
2. Abre la hoja "Pendientes"
3. Usa Ctrl+F (Cmd+F en Mac) para buscar ese código
4. Verifica la captura de pago
5. Si es correcta:
   - Opción A: Copia toda la fila y pégala en la hoja "Confirmadas"
   - Opción B: Cambia la columna "Estado Pago" de "Pendiente" a "Confirmado"
   - Agrega la fecha actual en "Fecha Confirmación"

### Opción 3: Filtrar y Ordenar
- Haz clic en cualquier celda con datos
- Ve a **Datos** > **Crear un filtro**
- Ahora puedes filtrar por Estado, Fecha, Iglesia, etc.
- Ordena por fecha para ver las inscripciones más recientes

## Formato del Código de Inscripción

El código se genera automáticamente con el formato:
```
DNI-TIMESTAMP
Ejemplo: 12345678-9876
```

- Primera parte: DNI del participante
- Segunda parte: Últimos 4 dígitos del timestamp (identificador único)

Esto facilita identificar rápidamente a la persona por su DNI.

## Consejos

1. **Backup**: Haz copias periódicas de tu Google Sheet
2. **Notificaciones**: Puedes configurar Google Forms para recibir emails cuando haya nuevas entradas
3. **Estadísticas**: Usa fórmulas en otra hoja para contar:
   - `=COUNTIF(Pendientes!J:J,"Pendiente")` → Pagos pendientes
   - `=COUNTIF(Confirmadas!J:J,"Confirmado")` → Pagos confirmados
   - `=COUNTA(Pendientes!A:A)-1` → Total de inscripciones

## Solución de Problemas

### "No aparecen las inscripciones"
- Verifica que el API Key esté correctamente configurado
- Revisa que el Spreadsheet ID sea el correcto
- Comprueba que los permisos del Sheet sean "Editor" para cualquiera con el enlace

### "Error 403"
- Asegúrate de que la Google Sheets API esté habilitada en Google Cloud Console
- Verifica los permisos del documento

### "Error 400"
- Confirma que las hojas se llamen exactamente "Pendientes" y "Confirmadas"
- Verifica que el rango sea "A:L" en la configuración
