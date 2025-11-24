# 🚀 GUÍA DE INICIO - Backend + Frontend

## ✅ Todo está Configurado

Ya tienes:
- ✅ Service Account creada y compartida con Google Sheet
- ✅ Backend Node.js listo (`server/index.js`)
- ✅ Frontend actualizado para usar el backend
- ✅ Dependencias instaladas

## 🎯 Cómo Ejecutar

### Opción 1: Ejecutar Todo de Una Vez (Recomendado)

```bash
npm run dev:full
```

Esto iniciará:
- Frontend en http://localhost:3000
- Backend en http://localhost:3001

### Opción 2: Ejecutar por Separado

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 🧪 Probar el Flujo Completo

1. **Abrir la aplicación**: http://localhost:5173

2. **Inscripción**:
   - Llena el formulario (usa DNI: `12345678`)
   - Clic en "Continuar al Pago"
   - Los datos se guardan en Google Sheets → Pestaña "Pendientes"

3. **Verificar en Google Sheets**:
   - Abre tu Google Sheet
   - Ve a la pestaña "Pendientes"
   - Deberías ver una nueva fila con los datos

4. **Confirmar Pago (MANUAL)**:
   - En Google Sheets, selecciona toda la fila del usuario
   - Cópiala (Ctrl+C)
   - Ve a la pestaña "Confirmadas"
   - Pega la fila (Ctrl+V)
   - En la columna J (Estado Pago), cambia "Pendiente" a "Confirmado"
   - En la columna L (Fecha Confirmación), escribe la fecha actual
   - Vuelve a "Pendientes" y elimina esa fila

5. **Acceder a Talleres**:
   - En la web, clic en "Ir a Talleres"
   - Ingresa el DNI: `12345678`
   - Clic en "Verificar y Continuar"
   - Deberías ver los talleres disponibles

6. **Registrar en Taller**:
   - Selecciona un taller
   - Confirma
   - Ve a Google Sheets → "Confirmadas"
   - En la columna M deberías ver el ID del taller
   - En la columna N la fecha de registro

7. **Verificar Bloqueo**:
   - Intenta acceder nuevamente a "Ir a Talleres"
   - Ingresa el mismo DNI
   - Deberías ver "Ya estás registrado en un taller"

## 📊 Estructura de Google Sheets

Asegúrate de que tus hojas tengan estos encabezados:

**Ambas pestañas ("Pendientes" y "Confirmadas"):**

| A | B | C | D | E | F | G | H | I | J | K | L | M | N |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Código | Nombres | Apellidos | Edad | DNI | Email | Teléfono | Iglesia | Necesidades | Estado Pago | Fecha Insc | Fecha Conf | Taller | Fecha Taller |

## 🔧 Solución de Problemas

### Error: "Cannot connect to backend"
- Verifica que el backend esté corriendo en http://localhost:3001
- Revisa que `service-account.json` esté en la raíz del proyecto

### Error: "Unauthorized" en Google Sheets
- Verifica que compartiste la hoja con el email de la service account
- Email: `campa-730@music-477314.iam.gserviceaccount.com`

### Error: "Module not found"
- Ejecuta: `npm install`

## 📝 Notas Importantes

- El backend DEBE estar corriendo para que funcione
- La Service Account debe tener permisos de "Editor" en el Google Sheet
- El archivo `service-account.json` está en `.gitignore` (no se subirá a GitHub)

---

**¡Todo listo para probar!** 🎉

Ejecuta `npm run dev:full` y ve a http://localhost:3000
