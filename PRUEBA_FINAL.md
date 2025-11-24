# 🧪 PRUEBA FINAL DEL SISTEMA

## Estado Actual
✅ Backend configurado con Service Account
✅ Frontend actualizado para usar API del backend
✅ Scripts de ejecución creados

## Pasos para Probar

### 1️⃣ Iniciar el Sistema

```bash
npm run dev:full
```

Deberías ver:
```
> campamento-cristiano@0.0.0 dev:full
> concurrently "npm run server" "npm run dev"

[0] > campamento-cristiano@0.0.0 server
[0] > node server/index.js
[1] > campamento-cristiano@0.0.0 dev
[1] > vite
[0] ✅ Servidor corriendo en http://localhost:3001
[1] VITE v6.x.x ready in X ms
[1] ➜ Local: http://localhost:3000/
```

### 2️⃣ Verificar Backend

Abre en tu navegador o usa curl:
```bash
curl http://localhost:3001/
```

Deberías ver:
```json
{"message":"Backend de Campamento Cristiano funcionando"}
```

### 3️⃣ Probar Inscripción

1. Ve a http://localhost:3000
2. Llena el formulario con datos de prueba:
   - Código: `TEST001`
   - Nombres: `Juan`
   - Apellidos: `Pérez`
   - Edad: `25`
   - DNI: `12345678`
   - Email: `juan@test.com`
   - Teléfono: `987654321`
   - Iglesia: `Iglesia Prueba`
   
3. Clic en "Continuar al Pago"
4. Sube una imagen de prueba (cualquier PNG/JPG)
5. Clic en "Enviar Inscripción"

### 4️⃣ Verificar en Google Sheets

1. Abre tu Google Sheet: https://docs.google.com/spreadsheets/d/1hCbcC82oeY4auvQ6TC4FdmWcfr35Cnw-EJcPg8B8MCg/edit
2. Ve a la pestaña "Pendientes"
3. Deberías ver una nueva fila con:
   - A: TEST001
   - B: Juan
   - C: Pérez
   - D: 25
   - E: 12345678
   - F: juan@test.com
   - G: 987654321
   - H: Iglesia Prueba
   - I: (necesidades especiales si pusiste)
   - J: Pendiente
   - K: (fecha actual)
   - L-N: (vacío)

### 5️⃣ Confirmar Pago (Manual)

1. En Google Sheets, selecciona TODA la fila del usuario (clic en el número de fila)
2. Copia (Ctrl+C)
3. Ve a la pestaña "Confirmadas"
4. Clic en la fila 2 (debajo del encabezado)
5. Pega (Ctrl+V)
6. Edita la columna J: cambia "Pendiente" → "Confirmado"
7. Edita la columna L: escribe la fecha actual (ej: 27/01/2025)
8. Vuelve a "Pendientes" y elimina la fila del usuario

### 6️⃣ Acceder a Talleres

1. En la web, clic en el botón "Ir a Talleres" (debajo del hero)
2. Ingresa DNI: `12345678`
3. Clic en "Verificar y Continuar"

**Qué debería pasar:**
- ✅ Si hiciste bien el paso 5: "Verificando..." → Pantalla de talleres disponibles
- ❌ Si no confirmaste el pago: "No se encontró registro con pago confirmado"

### 7️⃣ Registrar en un Taller

1. Verás 6 talleres con cupos disponibles
2. Selecciona uno (ej: "Adoración y Alabanza")
3. Aparece un modal de confirmación
4. Clic en "Confirmar Registro"

**Verificar en Google Sheets:**
1. Ve a pestaña "Confirmadas"
2. En la fila del usuario:
   - Columna M: Debería tener "taller-1" (ID del taller)
   - Columna N: Fecha y hora del registro

### 8️⃣ Verificar Bloqueo (Un Solo Taller)

1. Recarga la página
2. Clic en "Ir a Talleres"
3. Ingresa DNI: `12345678`
4. Clic en "Verificar y Continuar"

**Qué debería pasar:**
- Mensaje: "Ya estás registrado en un taller"
- NO te deja seleccionar otro

## ✅ Checklist de Funcionamiento

- [ ] Backend arranca sin errores
- [ ] Frontend arranca sin errores
- [ ] Formulario de inscripción funciona
- [ ] Upload de imagen funciona
- [ ] Datos se guardan en Google Sheets → Pendientes
- [ ] Verificación de DNI funciona
- [ ] Acceso a talleres funciona (después de confirmar pago)
- [ ] Registro en taller actualiza Google Sheets
- [ ] Bloqueo de segundo taller funciona

## 🐛 Si Algo Falla

### Error: "Cannot connect to backend"
**Solución:** Verifica que el backend esté corriendo en puerto 3001
```bash
# En una terminal:
npm run server
```

### Error: "Unauthorized" en Google Sheets
**Solución:** Verifica que compartiste la hoja con:
`campa-730@music-477314.iam.gserviceaccount.com`

### Error: No se guarda en Google Sheets
**Solución:** 
1. Verifica que `service-account.json` esté en la raíz del proyecto
2. Revisa la consola del backend (terminal donde corre `npm run server`)
3. Debería mostrar el error específico

### Error: "Module not found"
**Solución:**
```bash
npm install
```

## 📹 Consola del Navegador

Abre DevTools (F12) → Console

Deberías ver logs como:
```
🔵 Enviando inscripción al backend...
✅ Inscripción guardada: {success: true, ...}

🔵 Verificando DNI...
✅ Usuario encontrado con pago confirmado

🔵 Registrando en taller...
✅ Registrado en taller
```

---

**¡Todo listo!** 🎉

Si todos los pasos funcionan, el sistema está completo y operativo.
