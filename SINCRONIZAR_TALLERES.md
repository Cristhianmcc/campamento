# 📊 Sincronización Automática de Talleres

## ✨ Nueva Funcionalidad

El sistema ahora puede crear automáticamente hojas separadas para cada taller con la lista de participantes.

---

## 🎯 ¿Qué Hace?

Cuando ejecutas la sincronización, el sistema:

1. **Lee** todos los usuarios que tienen un taller asignado (columna M de "Inscripciones")
2. **Agrupa** a los usuarios por taller
3. **Crea hojas** separadas con el nombre del taller (si no existen)
4. **Lista** a todos los participantes de cada taller

---

## 📋 Hojas que se Crean

Se crean 6 hojas automáticamente (una por cada taller):

1. **Taller - Adoración y Alabanza**
2. **Taller - Evangelismo Creativo**
3. **Taller - Liderazgo Juvenil**
4. **Taller - Multimedia y Diseño**
5. **Taller - Teatro y Drama**
6. **Taller - Servicio y Misiones**

Cada hoja contiene:

| Código | Nombres | Apellidos | Edad | DNI | Email | Teléfono | Iglesia | Fecha Registro |
|--------|---------|-----------|------|-----|-------|----------|---------|----------------|
| 12345678 | Juan | Pérez | 25 | 12345678 | juan@email.com | 987654321 | Iglesia A | 23/11/2025 |

---

## 🚀 Cómo Sincronizar

### Opción 1: Desde PowerShell (Manual)

```powershell
curl -Method POST http://localhost:3002/api/sincronizar-talleres
```

### Opción 2: Desde el Navegador (Manual)

Abre en tu navegador (con el backend corriendo):
```
http://localhost:3002/api/sincronizar-talleres
```

(Nota: Necesitarás cambiar el método a POST, se recomienda usar Postman o la terminal)

### Opción 3: Automatizar cada vez que alguien se registra

Puedes modificar el código para que sincronice automáticamente después de cada registro en taller.

---

## 📝 Ejemplo de Uso

1. **Varios usuarios se registran en talleres**

2. **Ejecutas sincronización:**
   ```powershell
   curl -Method POST http://localhost:3002/api/sincronizar-talleres
   ```

3. **Ves el resultado:**
   ```json
   {
     "success": true,
     "message": "Talleres sincronizados",
     "talleres": 3,
     "participantes": 15
   }
   ```

4. **Verificas en Google Sheets:**
   - Nuevas pestañas creadas con nombres de talleres
   - Cada pestaña tiene la lista de participantes

---

## 🔄 Cuándo Sincronizar

### Recomendado sincronizar:

- ✅ Al final de cada día
- ✅ Antes de las sesiones de talleres
- ✅ Cuando necesites enviar listas a los instructores
- ✅ Para imprimir listas de asistencia

### NO es necesario sincronizar:

- ❌ Después de cada registro individual
- ❌ Cada minuto (sobrecarga innecesaria)

---

## ⚙️ Automatización (Opcional)

Si quieres que se sincronice automáticamente cada hora, puedes usar:

### Windows Task Scheduler

1. Crear archivo `sincronizar.ps1`:
```powershell
curl -Method POST http://localhost:3002/api/sincronizar-talleres
```

2. Programar tarea en Windows para ejecutar cada hora

### O modificar el backend

Agregar en `server/index.js`:
```javascript
// Sincronizar cada hora
setInterval(async () => {
  console.log('🔄 Sincronizando talleres automáticamente...');
  // Llamar a la función de sincronización
}, 60 * 60 * 1000); // 1 hora
```

---

## 💡 Ventajas

- ✅ **Organizado:** Cada taller tiene su propia hoja
- ✅ **Actualizable:** Puedes sincronizar cuando quieras
- ✅ **Imprimible:** Fácil de imprimir listas
- ✅ **Compartible:** Puedes compartir solo una hoja con un instructor
- ✅ **Claro:** Ves cuántos hay en cada taller

---

## 📱 Para Instructores

Puedes compartir cada hoja individualmente con los instructores:

1. Abre Google Sheets
2. Click derecho en la pestaña del taller
3. "Copiar a otra hoja de cálculo"
4. Comparte esa nueva hoja con el instructor

O simplemente dale acceso de "solo lectura" a tu hoja principal.

---

## 🐛 Solución de Problemas

### Error: "Hoja ya existe"
- Normal, el sistema actualiza la hoja existente

### Error: "No se encontraron talleres"
- Nadie ha seleccionado talleres aún
- Verifica columna M en "Inscripciones"

### Error: "Backend no responde"
- Asegúrate de que el backend esté corriendo:
  ```bash
  npm run server
  ```

---

**¡Listo!** Ahora tienes hojas organizadas por taller. 📊
