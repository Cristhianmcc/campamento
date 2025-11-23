# Guía Completa: Obtener API Key de Google Sheets

Esta guía te mostrará paso a paso cómo obtener tu API Key de Google para conectar tu landing page con Google Sheets.

## Requisitos Previos

- Una cuenta de Google (Gmail)
- Navegador web

---

## PASO 1: Acceder a Google Cloud Console

1. Abre tu navegador
2. Ve a: **https://console.cloud.google.com**
3. Inicia sesión con tu cuenta de Google
4. Si es tu primera vez, acepta los Términos de Servicio

---

## PASO 2: Crear un Nuevo Proyecto

1. En la parte superior, verás "Selecciona un proyecto" o el nombre de un proyecto
2. Haz clic en el nombre del proyecto
3. Se abrirá un modal, haz clic en **"NUEVO PROYECTO"** (arriba a la derecha)
4. Dale un nombre a tu proyecto, por ejemplo: `Campamento-Inscripciones`
5. Haz clic en **"CREAR"**
6. Espera unos segundos mientras se crea el proyecto
7. Selecciona el proyecto recién creado

---

## PASO 3: Habilitar la API de Google Sheets

1. En el menú lateral izquierdo (☰), ve a:
   - **APIs y servicios** → **Biblioteca**
   
   O usa este enlace directo: https://console.cloud.google.com/apis/library

2. En el buscador, escribe: **Google Sheets API**

3. Haz clic en **"Google Sheets API"** en los resultados

4. Haz clic en el botón azul **"HABILITAR"**

5. Espera unos segundos mientras se habilita

---

## PASO 4: Crear la API Key

1. En el menú lateral izquierdo (☰), ve a:
   - **APIs y servicios** → **Credenciales**
   
   O usa este enlace: https://console.cloud.google.com/apis/credentials

2. Haz clic en **"+ CREAR CREDENCIALES"** (arriba)

3. Selecciona **"Clave de API"**

4. Se generará automáticamente tu API Key

5. Aparecerá un modal con tu clave que se ve así:
   ```
   AIzaSyABC123DEF456GHI789JKL012MNO345PQR
   ```

6. Haz clic en **"COPIAR"** para copiar la clave

---

## PASO 5: Configurar Restricciones de la API Key (Opcional pero Recomendado)

Para mayor seguridad, restringe el uso de tu API Key:

1. En el modal de la API Key, haz clic en **"EDITAR CLAVE DE API"**
   
   O en la lista de credenciales, haz clic en el nombre de tu API Key

2. En "Restricciones de la clave":
   - Selecciona **"Restringir clave"**
   - Marca solo **"Google Sheets API"**

3. En "Restricciones de aplicación" (opcional):
   - Selecciona **"Referencias de HTTP"**
   - Agrega tu dominio cuando subas la página a producción
   - Para desarrollo local, déjalo sin restricciones

4. Haz clic en **"GUARDAR"**

---

## PASO 6: Obtener el ID de tu Google Sheet

1. Ve a Google Sheets: https://sheets.google.com

2. Abre el Google Sheet que creaste para las inscripciones

3. Observa la URL en la barra de direcciones:
   ```
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t/edit
   ```

4. Copia la parte entre `/d/` y `/edit`:
   ```
   1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
   ```
   Ese es tu **SPREADSHEET_ID**

---

## PASO 7: Configurar en tu Proyecto

1. Abre tu proyecto en VS Code

2. Navega al archivo: `src/config/campamento.ts`

3. Busca la sección `googleSheets` y reemplaza:

```typescript
googleSheets: {
  apiKey: "AIzaSyABC123DEF456GHI789JKL012MNO345PQR", // Tu API Key
  spreadsheetId: "1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t", // Tu Spreadsheet ID
  rangePendientes: "Pendientes!A:L",
  rangeConfirmadas: "Confirmadas!A:L",
},
```

4. Guarda el archivo (Ctrl + S)

---

## PASO 8: Verificar que Funciona

1. Asegúrate de que tu Google Sheet tenga los permisos correctos:
   - Abre tu Google Sheet
   - Haz clic en **"Compartir"**
   - En "Acceso general", selecciona **"Cualquier persona con el enlace"**
   - Permisos: **"Editor"**

2. Ejecuta tu proyecto:
   ```bash
   npm run dev
   ```

3. Prueba registrando una inscripción de prueba

4. Verifica en tu Google Sheet que aparezca la inscripción

---

## Solución de Problemas

### Error: "API key not valid"
- Verifica que copiaste la API Key completa
- Asegúrate de que la Google Sheets API esté habilitada
- Revisa que no haya espacios extras al pegar la clave

### Error: "The caller does not have permission"
- Verifica que el Google Sheet tenga permisos de "Editor" para cualquiera con el enlace
- Confirma que la API esté habilitada en Google Cloud Console

### Error: "Unable to parse range"
- Verifica que las hojas se llamen exactamente "Pendientes" y "Confirmadas"
- Confirma que el rango sea "A:L" en la configuración

### Error 429: "Quota exceeded"
- Hay límite de 100 solicitudes por 100 segundos
- Para producción, considera implementar un backend

---

## Límites de la API

**Cuota gratuita de Google Sheets API:**
- 500 solicitudes por 100 segundos por proyecto
- 100 solicitudes por 100 segundos por usuario

**Esto significa:**
- Hasta 500 inscripciones simultáneas cada 100 segundos
- Más que suficiente para un campamento

---

## Seguridad: Importante para Producción

⚠️ **NUNCA subas tu API Key a repositorios públicos de GitHub**

Para producción, considera:

1. **Usar variables de entorno:**
   ```typescript
   apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY
   ```

2. **Implementar un backend:**
   - El backend maneja la API Key de forma segura
   - El frontend solo se comunica con tu backend
   - Más seguro pero requiere servidor

3. **Restricciones de dominio:**
   - En Google Cloud Console, restringe la API Key a tu dominio específico

---

## Resumen Rápido

```bash
1. Ve a: console.cloud.google.com
2. Crea un proyecto nuevo
3. Habilita "Google Sheets API"
4. Crea credencial tipo "Clave de API"
5. Copia la API Key
6. Pégala en src/config/campamento.ts
7. Copia el ID de tu Google Sheet
8. Pégalo también en la configuración
9. ¡Listo!
```

---

## Enlaces Útiles

- **Google Cloud Console**: https://console.cloud.google.com
- **Google Sheets API Docs**: https://developers.google.com/sheets/api
- **Límites y cuotas**: https://developers.google.com/sheets/api/limits

---

Si tienes problemas, revisa la consola del navegador (F12) para ver mensajes de error detallados.
