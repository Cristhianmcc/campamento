# 🚀 Guía: Migración a Producción - Mantener Sheets de Prueba y Producción

## 📋 Tabla de Contenidos
1. [Preparación](#preparación)
2. [Crear Sheet de Producción](#crear-sheet-de-producción)
3. [Configurar Service Account](#configurar-service-account)
4. [Actualizar Código Local](#actualizar-código-local)
5. [Desplegar a Render (Backend)](#desplegar-a-render-backend)
6. [Desplegar a Netlify (Frontend)](#desplegar-a-netlify-frontend)
7. [Verificación Final](#verificación-final)
8. [Mantenimiento](#mantenimiento)

---

## ✅ Preparación

### Antes de Comenzar
- [ ] Tienes acceso a Google Sheets
- [ ] Tienes cuenta en Render.com
- [ ] Tienes cuenta en Netlify
- [ ] Tienes Git instalado
- [ ] Tu código está en GitHub

### Información que Necesitarás
```
📝 Anota estos datos:

Service Account Email: campa-730@music-477314.iam.gserviceaccount.com
Sheet de Prueba ID: 1hCbcC82oeY4auvQ6TC4FdmWcfr35Cnw-EJcPg8B8MCg
Sheet de Producción ID: [LO OBTENDRÁS EN PASO 2]
```

---

## 📊 PASO 1: Crear Sheet de Producción

### 1.1 Duplicar Sheet de Prueba

1. **Abre tu sheet de prueba:**
   ```
   https://docs.google.com/spreadsheets/d/1hCbcC82oeY4auvQ6TC4FdmWcfr35Cnw-EJcPg8B8MCg
   ```

2. **Hacer una copia:**
   - Clic en `Archivo` → `Hacer una copia`
   - Nombre sugerido: **"Campamento 2025 - PRODUCCIÓN"**
   - Ubicación: Mantén en "Mi unidad" o carpeta específica
   - Clic en `Hacer una copia`

3. **Copiar el ID del nuevo sheet:**
   - Se abrirá el nuevo sheet
   - Copia el ID de la URL (la parte entre `/d/` y `/edit`)
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit
   ```
   - 📝 **Guarda este ID**, lo necesitarás después

### 1.2 Limpiar Datos de Prueba

1. **En el nuevo sheet de producción:**
   - Selecciona todas las filas desde la **Fila 2** hacia abajo (los datos de prueba)
   - Clic derecho → `Eliminar filas 2-X`
   - ⚠️ **NO elimines la Fila 1** (encabezados)

2. **Verificar estructura:**
   ```
   Columna A: Código
   Columna B: Nombres
   Columna C: Apellidos
   Columna D: Edad
   Columna E: DNI
   Columna F: Email
   Columna G: Teléfono
   Columna H: Iglesia
   Columna I: Necesidades
   Columna J: Estado Pago
   Columna K: Fecha Inscripción
   Columna L: Fecha Confirmación
   Columna M: (vacía - sistema antiguo)
   Columna N: (vacía - sistema antiguo)
   Columna O: Día 1 - Taller 1
   Columna P: Día 1 - Taller 2
   Columna Q: Día 2 - Taller 1
   Columna R: Día 2 - Taller 2
   Columna S: Día 3 - Taller 1
   Columna T: Día 3 - Taller 2
   Columna U: Día 4 - Taller 1
   Columna V: Día 4 - Taller 2
   ```

3. **Configurar Columna J (Estado Pago):**
   - Selecciona toda la columna J (desde J2 hacia abajo)
   - Clic en `Datos` → `Validación de datos`
   - Criterios: `Lista de un rango`
   - Lista de opciones: `Pendiente, Confirmado`
   - Clic en `Guardar`

### 1.3 Proteger Sheet de Producción (Opcional)

1. **Proteger encabezados:**
   - Selecciona Fila 1
   - Clic derecho → `Ver más opciones de celda` → `Proteger rango`
   - Descripción: "Encabezados - No modificar"
   - Clic en `Definir permisos`
   - Selecciona "Solo tú"
   - Clic en `Listo`

---

## 🔑 PASO 2: Configurar Service Account

### 2.1 Compartir Sheet con Service Account

1. **En el sheet de PRODUCCIÓN:**
   - Clic en `Compartir` (botón superior derecha)
   - En "Agregar personas, grupos y eventos de calendario"
   - Pega este email:
   ```
   campa-730@music-477314.iam.gserviceaccount.com
   ```
   - Rol: **Editor**
   - Desmarca "Notificar a las personas"
   - Clic en `Compartir`

2. **Verificar permisos:**
   - Verifica que el service account aparezca en la lista de colaboradores
   - Debe tener rol de "Editor"

---

## 💻 PASO 3: Actualizar Código Local

### 3.1 Crear Archivo .env.production

1. **En la raíz del proyecto**, crea un nuevo archivo `.env.production`:

```bash
# Archivo: .env.production

# ID del Sheet de PRODUCCIÓN (reemplaza con tu ID real)
VITE_SPREADSHEET_ID=PEGA_AQUI_EL_ID_DE_PRODUCCION

# Backend de Producción (Render)
VITE_API_URL=https://campamento-nz0r.onrender.com/api

# WhatsApp (verifica que sea el número correcto)
VITE_WHATSAPP_NUMBER=51955195324
```

2. **Mantén tu archivo .env para desarrollo:**

```bash
# Archivo: .env (para desarrollo/pruebas)

# ID del Sheet de PRUEBAS
VITE_SPREADSHEET_ID=1hCbcC82oeY4auvQ6TC4FdmWcfr35Cnw-EJcPg8B8MCg

# Backend local
VITE_API_URL=http://localhost:3002/api

# WhatsApp
VITE_WHATSAPP_NUMBER=51955195324
```

### 3.2 Actualizar .gitignore

Asegúrate de que `.env` y `.env.production` estén en `.gitignore`:

```bash
# Archivo: .gitignore

node_modules
dist
.env
.env.local
.env.production
.env.development
service-account.json
```

### 3.3 Actualizar package.json (Scripts)

Agrega scripts para construir con diferentes entornos:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:production": "tsc && vite build --mode production",
    "preview": "vite preview",
    "server": "node server/index.js"
  }
}
```

### 3.4 Actualizar server/index.js

Verifica que el backend lea el SPREADSHEET_ID de variables de entorno:

```javascript
// Línea ~72 en server/index.js
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '1hCbcC82oeY4auvQ6TC4FdmWcfr35Cnw-EJcPg8B8MCg';
```

✅ **Este código ya está correcto**, solo verifica que esté así.

---

## 🌐 PASO 4: Desplegar a Render (Backend)

### 4.1 Actualizar Variables de Entorno en Render

1. **Ir a Render Dashboard:**
   ```
   https://dashboard.render.com
   ```

2. **Seleccionar tu servicio:**
   - Clic en tu servicio de backend (campamento-nz0r)

3. **Actualizar variables de entorno:**
   - En el menú izquierdo, clic en `Environment`
   - Busca la variable `SPREADSHEET_ID`
   - Clic en editar (lápiz)
   - **Reemplaza el valor con el ID del sheet de PRODUCCIÓN**
   - Clic en `Save Changes`

4. **Variables que debe tener:**
   ```
   SPREADSHEET_ID = [ID_DEL_SHEET_DE_PRODUCCION]
   NODE_VERSION = 18
   ```

5. **Service Account en Render:**
   - En `Secret Files`, verifica que exista `/etc/secrets/service-account.json`
   - Si no existe, agrégalo:
     - Clic en `Add Secret File`
     - Filename: `service-account.json`
     - Contents: Pega el contenido completo de tu archivo local `service-account.json`
     - Clic en `Save`

### 4.2 Redesplegar Backend

1. **Opción A - Redespliegue Manual:**
   - En tu servicio de Render
   - Clic en `Manual Deploy` → `Deploy latest commit`

2. **Opción B - Redespliegue Automático:**
   - Haz un push a tu repositorio:
   ```bash
   git add .
   git commit -m "feat: configurar sheet de producción"
   git push origin master
   ```
   - Render detectará el cambio y redesplegará automáticamente

### 4.3 Verificar Deploy

1. **Espera a que termine el deploy** (1-3 minutos)
2. **Verifica los logs:**
   - Busca estas líneas:
   ```
   ✅ Google Sheets API configurada correctamente
   🚀 Servidor backend corriendo en http://...
   📊 Conectado a Google Sheets: [TU_NUEVO_ID]
   ```
3. **Prueba el endpoint:**
   ```bash
   curl https://campamento-nz0r.onrender.com
   ```
   Debe retornar:
   ```json
   {
     "message": "Backend de Campamento Cristiano funcionando",
     "status": "OK",
     "spreadsheetId": "[TU_NUEVO_ID]"
   }
   ```

---

## 🚀 PASO 5: Desplegar a Netlify (Frontend)

### 5.1 Actualizar Variables de Entorno en Netlify

1. **Ir a Netlify Dashboard:**
   ```
   https://app.netlify.com
   ```

2. **Seleccionar tu sitio:**
   - Clic en tu sitio (campamento2025)

3. **Configurar variables de entorno:**
   - Clic en `Site settings`
   - En el menú izquierdo: `Environment variables`
   - Clic en `Add a variable` → `Add a single variable`

4. **Agregar/actualizar estas variables:**

   | Key | Value | Scopes |
   |-----|-------|--------|
   | `VITE_SPREADSHEET_ID` | [ID_SHEET_PRODUCCION] | Production |
   | `VITE_API_URL` | `https://campamento-nz0r.onrender.com/api` | Production |
   | `VITE_WHATSAPP_NUMBER` | `51955195324` | Production |

5. **Guardar cambios:**
   - Clic en `Save` para cada variable

### 5.2 Redesplegar Frontend

1. **Opción A - Redespliegue Manual:**
   - En Netlify Dashboard
   - Clic en `Deploys`
   - Clic en `Trigger deploy` → `Deploy site`

2. **Opción B - Redespliegue Automático:**
   ```bash
   git add .
   git commit -m "feat: variables de producción configuradas"
   git push origin master
   ```

### 5.3 Verificar Deploy

1. **Espera a que termine** (30-60 segundos)
2. **Abre tu sitio:**
   ```
   https://campamento2025.netlify.app
   ```
3. **Verifica en consola del navegador (F12):**
   - No debe haber errores de conexión
   - Busca: "Google Sheets API configurada"

---

## ✅ PASO 6: Verificación Final

### 6.1 Checklist de Verificación

- [ ] **Sheet de Producción:**
  - [ ] Está limpio (solo encabezados)
  - [ ] Service account tiene permisos de Editor
  - [ ] Columna J tiene validación de datos
  - [ ] ID copiado correctamente

- [ ] **Backend (Render):**
  - [ ] Variable `SPREADSHEET_ID` actualizada
  - [ ] Service account JSON configurado
  - [ ] Deploy exitoso sin errores
  - [ ] Endpoint de health check responde

- [ ] **Frontend (Netlify):**
  - [ ] Variables de entorno configuradas
  - [ ] Deploy exitoso
  - [ ] Sitio accesible

### 6.2 Prueba End-to-End

1. **Registrar una inscripción de prueba:**
   - Nombre: TEST PRODUCCIÓN
   - DNI: 99999999
   - Completa el formulario

2. **Verificar en Google Sheets:**
   - Abre el sheet de PRODUCCIÓN
   - Debe aparecer la nueva fila
   - Estado: "Pendiente"

3. **Simular confirmación de pago:**
   - En el sheet, cambia "Pendiente" a "Confirmado"

4. **Acceder a talleres:**
   - Ingresa con DNI: 99999999
   - Debe permitir acceso
   - Selecciona 8 talleres (2 por día)
   - Confirma inscripción

5. **Verificar talleres en Sheet:**
   - Columnas O-V deben tener los nombres de talleres
   - NO deben ser IDs, sino nombres completos

6. **Verificar cupos:**
   - Registra otro usuario
   - Los talleres del primer usuario deben mostrar "1/17 inscritos"

7. **Limpiar datos de prueba:**
   - Elimina las filas de prueba del sheet de producción

### 6.3 Solución de Problemas

**Problema: "Error 403 Forbidden"**
```
Solución: Verifica que service account tenga permisos de Editor
```

**Problema: "Error al conectar con Google Sheets"**
```
Solución: Verifica que SPREADSHEET_ID esté correcto en Render
```

**Problema: "No se guardan los talleres"**
```
Solución: Verifica que las columnas O-V existan en el sheet
```

**Problema: "Cupos no se actualizan"**
```
Solución: Limpia caché del navegador y recarga la página
```

---

## 🔄 PASO 7: Mantenimiento

### 7.1 Volver a Modo Pruebas (Desarrollo Local)

Cuando necesites probar cambios sin afectar producción:

```bash
# 1. Usa tu .env con el sheet de pruebas
# Ya está configurado por defecto

# 2. Ejecuta en local
npm run dev
npm run server

# 3. Usa localhost:3000 para pruebas
```

### 7.2 Monitorear Producción

**Revisar logs en Render:**
```
Dashboard → Tu servicio → Logs
```

**Revisar analytics en Netlify:**
```
Dashboard → Tu sitio → Analytics
```

**Revisar Google Sheets:**
- Revisa periódicamente las inscripciones
- Confirma pagos manualmente cambiando columna J
- Exporta backups semanales: `Archivo → Descargar → Excel (.xlsx)`

### 7.3 Backups Automáticos

**Configurar backup semanal:**

1. **Google Sheets tiene historial automático:**
   - `Archivo → Historial de versiones → Ver historial de versiones`

2. **Backup manual (recomendado semanalmente):**
   - `Archivo → Descargar → Microsoft Excel (.xlsx)`
   - Guarda con fecha: `campamento-backup-2025-01-15.xlsx`

### 7.4 Actualizar Datos de Contacto

Si necesitas actualizar números de WhatsApp, YAPE, etc:

**Archivo: `src/config/campamento.ts`**

```typescript
contacto: {
  email: "campamento@iglesianvida.org",
  telefono: "+51 955 195 324",
  whatsapp: "51955195324", // Solo números
  direccion: "Av. Principal 123, Lima, Perú",
},
```

Luego:
```bash
git add .
git commit -m "fix: actualizar datos de contacto"
git push origin master
```

---

## 📊 PASO 8: Resumen de IDs

### Guarda estos datos para referencia futura:

```
╔═══════════════════════════════════════════════════════════════╗
║                    DATOS DE PRODUCCIÓN                        ║
╠═══════════════════════════════════════════════════════════════╣
║ Sheet de PRUEBAS:                                             ║
║ ID: 1hCbcC82oeY4auvQ6TC4FdmWcfr35Cnw-EJcPg8B8MCg             ║
║ URL: https://docs.google.com/spreadsheets/d/[ID]/edit        ║
║                                                               ║
║ Sheet de PRODUCCIÓN:                                          ║
║ ID: [PEGA_TU_NUEVO_ID_AQUI]                                   ║
║ URL: https://docs.google.com/spreadsheets/d/[ID]/edit        ║
║                                                               ║
║ Service Account:                                              ║
║ Email: campa-730@music-477314.iam.gserviceaccount.com       ║
║                                                               ║
║ Backend (Render):                                             ║
║ URL: https://campamento-nz0r.onrender.com                    ║
║                                                               ║
║ Frontend (Netlify):                                           ║
║ URL: https://campamento2025.netlify.app                       ║
║                                                               ║
║ WhatsApp: +51 955 195 324                                     ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 🎉 ¡Listo!

Tu sistema ahora tiene:

✅ Sheet de pruebas para desarrollo
✅ Sheet de producción limpio y protegido
✅ Ambos entornos funcionando independientemente
✅ Backups y auditoría completa
✅ Sistema de cupos funcionando
✅ Prevención de doble inscripción
✅ Nombres de talleres (no IDs)

---

## 📞 Soporte

Si tienes problemas durante la migración, revisa:

1. **Logs de Render**: Dashboard → Servicio → Logs
2. **Logs de Netlify**: Dashboard → Sitio → Deploys → View logs
3. **Consola del navegador**: F12 → Console
4. **Google Sheets**: Verifica permisos y estructura

---

**Fecha de creación:** 15 de Diciembre, 2025
**Última actualización:** 15 de Diciembre, 2025
**Versión:** 1.0
