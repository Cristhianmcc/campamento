# 🚀 INICIO RÁPIDO - 5 Pasos

## ✅ CHECKLIST DE CONFIGURACIÓN

### Paso 1: Google Sheets
- [ ] Crear nueva hoja de cálculo en Google Sheets
- [ ] Renombrar primera hoja como "Pendientes"
- [ ] Crear segunda hoja llamada "Confirmadas"
- [ ] En AMBAS hojas, agregar estos encabezados en la fila 1:

```
A: Código
B: Nombres
C: Apellidos
D: Edad
E: DNI
F: Email
G: Teléfono
H: Iglesia
I: Necesidades Especiales
J: Estado Pago
K: Fecha Inscripción
L: Fecha Confirmación
M: Taller Asignado
N: Fecha Registro Taller
```

- [ ] Compartir hoja: "Cualquier persona con el enlace puede editar"
- [ ] Copiar ID de la hoja (está en la URL entre `/d/` y `/edit`)

### Paso 2: Google Cloud Console
- [ ] Ir a https://console.cloud.google.com
- [ ] Crear nuevo proyecto o seleccionar existente
- [ ] Ir a "APIs y servicios" > "Biblioteca"
- [ ] Buscar "Google Sheets API" y habilitar
- [ ] Ir a "Credenciales"
- [ ] Crear "Clave de API"
- [ ] Copiar la clave generada

### Paso 3: Configurar el Proyecto
Abrir `src/config/campamento.ts` y reemplazar:

```typescript
googleSheets: {
  apiKey: "TU_API_KEY_AQUI",           // ← Pegar tu API Key
  spreadsheetId: "TU_SPREADSHEET_ID",  // ← Pegar ID de tu hoja
  rangePendientes: "Pendientes!A:N",   // ✓ Ya está correcto
  rangeConfirmadas: "Confirmadas!A:N", // ✓ Ya está correcto
},
```

### Paso 4: Configurar Pagos
En el mismo archivo `src/config/campamento.ts`:

```typescript
// Información de Pago
yapeNumero: "+51 987 654 321",        // ← Tu número YAPE
yapeTitular: "Iglesia Nueva Vida",    // ← Nombre titular YAPE
plinNumero: "+51 987 654 321",        // ← Tu número PLIN
plinTitular: "Iglesia Nueva Vida",    // ← Nombre titular PLIN

// URL de imágenes QR (subir a Imgur, Cloudinary, etc.)
imagenQRYape: "URL_DE_TU_QR_YAPE",   // ← URL del QR YAPE
imagenQRPlin: "URL_DE_TU_QR_PLIN",   // ← URL del QR PLIN

// WhatsApp (SOLO NÚMEROS, sin + ni espacios)
contacto: {
  whatsapp: "51987654321",            // ← Tu WhatsApp
  // ... otros datos
}
```

### Paso 5: Ejecutar
```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Abrir navegador en:
# http://localhost:5173
```

## 🎯 VERIFICACIÓN RÁPIDA

### Probar Inscripción:
1. ✓ Llenar formulario con datos de prueba
2. ✓ Verificar que aparezca en Google Sheets > "Pendientes"
3. ✓ Adjuntar imagen de prueba
4. ✓ Clic en "Enviar WhatsApp"
5. ✓ Verificar que abra WhatsApp con mensaje correcto

### Probar Acceso a Talleres:
1. ✓ Mover manualmente la fila de "Pendientes" a "Confirmadas"
2. ✓ Cambiar estado a "Confirmado"
3. ✓ Agregar fecha en columna L
4. ✓ En la web, clic en "Ir a Talleres"
5. ✓ Ingresar DNI de prueba
6. ✓ Verificar que dé acceso

### Probar Selección de Taller:
1. ✓ Seleccionar un taller
2. ✓ Confirmar en el modal
3. ✓ Verificar que columnas M y N se actualicen en Sheets
4. ✓ Intentar acceder de nuevo
5. ✓ Verificar que muestre "Ya estás registrado"

## ⚡ COMANDOS ÚTILES

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview

# Linter
npm run lint
```

## 📱 DESPLEGAR EN NETLIFY

1. Crear cuenta en https://netlify.com
2. Conectar repositorio de GitHub
3. Configurar:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy!

## 🆘 PROBLEMAS COMUNES

### "Error al guardar en Google Sheets"
- ✓ Verificar API Key
- ✓ Verificar ID de la hoja
- ✓ Verificar que hoja esté compartida con permisos

### "No se adjunta imagen en WhatsApp"
- ⚠️ Normal: WhatsApp Web no permite adjuntar por URL
- ✓ Usuario debe adjuntar manualmente después

### "Usuario no puede acceder a talleres"
- ✓ Verificar que esté en hoja "Confirmadas"
- ✓ Verificar que columna J diga "Confirmado"
- ✓ Verificar que sea el DNI correcto

## 📞 SOPORTE

Para problemas técnicos, revisar:
- `README_COMPLETO.md` - Guía detallada
- `FLUJO_SISTEMA.md` - Diagrama completo
- `CONFIGURACION_TALLERES.md` - Estructura de Sheets

---

**¡Listo! Tu sistema de inscripciones está configurado.**
