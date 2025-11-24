# ⚠️ MODO DEMO ACTIVADO

## 🔵 Estado Actual

Tu aplicación está funcionando en **MODO DEMO** usando **localStorage** del navegador para almacenar datos.

### ¿Por qué?

Google Sheets API **NO permite escritura con API Keys** desde el navegador. Solo permite lectura.

Para escribir datos necesitas:
- **OAuth 2.0** (requiere autenticación del usuario cada vez)
- **Service Account** (requiere un backend/servidor)
- **Apps Script** (alternativa sencilla)

## ✅ Cómo Funciona el Modo Demo

1. **Inscripciones** → Se guardan en `localStorage` del navegador
2. **Verificación de DNI** → Busca en `localStorage`
3. **Talleres** → Se guardan en `localStorage`

### Para Probar:

1. Llena el formulario
2. Los datos se guardan en tu navegador (abre DevTools → Application → Local Storage)
3. Para simular confirmación de pago:
   - Abre la consola del navegador (F12)
   - Ejecuta este código:

```javascript
// Ver inscripciones pendientes
console.table(JSON.parse(localStorage.getItem('inscripciones_pendientes')));

// Mover una inscripción a confirmadas
const pendientes = JSON.parse(localStorage.getItem('inscripciones_pendientes') || '[]');
const confirmadas = JSON.parse(localStorage.getItem('inscripciones_confirmadas') || '[]');

// Tomar la primera inscripción pendiente
const inscripcion = pendientes[0];
inscripcion.estadoPago = 'Confirmado';
inscripcion.fechaConfirmacion = new Date().toLocaleString('es-PE');

// Moverla a confirmadas
confirmadas.push(inscripcion);
pendientes.shift();

localStorage.setItem('inscripciones_confirmadas', JSON.stringify(confirmadas));
localStorage.setItem('inscripciones_pendientes', JSON.stringify(pendientes));

console.log('✅ Inscripción confirmada manualmente');
```

## 🚀 Soluciones para Producción

### Opción 1: Google Apps Script (RECOMENDADO - Más Fácil)

1. Abre tu Google Sheet
2. Ve a **Extensiones** → **Apps Script**
3. Copia el código de `CONFIGURACION_APPS_SCRIPT.md`
4. Despliega como Web App
5. Usa la URL generada en tu aplicación

**Ventajas:**
- ✅ Gratis
- ✅ No requiere backend
- ✅ Fácil de configurar
- ✅ Funciona desde el navegador

### Opción 2: Backend (Node.js + Express)

Crear un servidor que maneje las peticiones a Google Sheets.

### Opción 3: Firebase/Supabase

Usar una base de datos alternativa que sí permite escritura desde el navegador.

---

## 📝 Próximos Pasos

**¿Quieres continuar en modo DEMO o implementar Google Apps Script?**

Si quieres Apps Script, te creo el archivo de configuración ahora mismo.
