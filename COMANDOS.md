# ⚡ COMANDOS RÁPIDOS

## 🚀 Iniciar Todo

```bash
npm run dev:full
```

## 🔧 Comandos Separados

### Iniciar solo el backend
```bash
npm run server
```

### Iniciar solo el frontend
```bash
npm run dev
```

## 🧪 Probar Backend

```bash
node test-backend.js
```

## 📦 Instalar Dependencias

```bash
npm install
```

## 🏗️ Build para Producción

```bash
npm run build
```

## 👀 Preview de Producción

```bash
npm run preview
```

## 🔍 Verificar Errores

```bash
npm run type-check
```

## 📊 Accesos Rápidos

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
- **Google Sheet:** https://docs.google.com/spreadsheets/d/1hCbcC82oeY4auvQ6TC4FdmWcfr35Cnw-EJcPg8B8MCg/edit

## 🐛 Solución Rápida de Errores

### Backend no arranca
```bash
# Verifica que service-account.json existe
ls service-account.json

# Si no existe, cópialo de nuevo
Copy-Item "C:\Users\Cris\Downloads\service-account.json" .
```

### Frontend no se conecta al backend
```bash
# Verifica que el backend esté corriendo
curl http://localhost:3001/

# Si no responde, reinicia
npm run server
```

### Módulos no encontrados
```bash
npm install
```

## 📝 DNI de Prueba

Para pruebas rápidas después de confirmar un pago:
- **DNI:** `12345678` (si lo usaste en la inscripción)
- **DNI:** `87654321` (si ejecutaste test-backend.js)

## 🔄 Reiniciar Todo

```bash
# Detener todos los procesos (Ctrl+C)
# Luego:
npm run dev:full
```

## 📋 Checklist Rápido

- [ ] Backend corriendo en puerto 3001
- [ ] Frontend corriendo en puerto 5173
- [ ] Google Sheet compartida con service account
- [ ] service-account.json en raíz del proyecto

---

**Comando más usado:** `npm run dev:full`

Eso inicia todo y ya puedes empezar a trabajar. 🚀
