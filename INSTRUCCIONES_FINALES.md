# 📝 INSTRUCCIONES FINALES DE CONFIGURACIÓN

## ✅ Lo que ya se configuró automáticamente:

1. ✅ Archivo `.env` creado con tu API Key
2. ✅ Configuración actualizada en `src/config/campamento.ts`
3. ✅ `.gitignore` actualizado para proteger credenciales

## 🔧 Lo que DEBES hacer ahora:

### Paso 1: Obtener el ID de tu Google Sheet

1. Abre tu hoja de Google Sheets (o crea una nueva)
2. Mira la URL, se verá así:
   ```
   https://docs.google.com/spreadsheets/d/1abc123XYZ_ESTE_ES_EL_ID_456/edit
   ```
3. Copia la parte entre `/d/` y `/edit`
4. Abre el archivo `.env` en la raíz del proyecto
5. Reemplaza `TU_ID_DE_HOJA_AQUI` con tu ID real

### Paso 2: Configurar las hojas en Google Sheets

En tu Google Sheet, crea 2 pestañas (hojas):

**Pestaña 1: "Pendientes"**
```
Fila 1 - Encabezados:
A1: Código
B1: Nombres
C1: Apellidos
D1: Edad
E1: DNI
F1: Email
G1: Teléfono
H1: Iglesia
I1: Necesidades Especiales
J1: Estado Pago
K1: Fecha Inscripción
L1: Fecha Confirmación
M1: Taller Asignado
N1: Fecha Registro Taller
```

**Pestaña 2: "Confirmadas"**
```
(Los mismos encabezados que "Pendientes")
```

### Paso 3: Hacer pública tu Google Sheet

1. En tu Google Sheet, clic en **"Compartir"** (esquina superior derecha)
2. En **"Acceso general"**, selecciona **"Cualquier persona con el enlace"**
3. Cambia el permiso a **"Editor"**
4. Clic en **"Listo"**

### Paso 4: Restringir tu API Key (SEGURIDAD)

1. Ve a Google Cloud Console → Credenciales
2. Haz clic en el ícono de editar (lápiz) en tu API Key
3. En **"Restricciones de aplicación"**:
   - Selecciona **"Referentes HTTP (sitios web)"**
   - Agrega estos referentes:
     ```
     http://localhost:*
     http://127.0.0.1:*
     ```
4. En **"Restricciones de API"**:
   - Selecciona **"Restringir clave"**
   - Marca SOLO **"Google Sheets API"**
5. **Guardar**

### Paso 5: Configurar WhatsApp (Opcional)

En el archivo `.env`, actualiza:
```
VITE_WHATSAPP_NUMBER=51999999999
```
Reemplaza con tu número de WhatsApp (solo números, sin + ni espacios)

### Paso 6: Iniciar el proyecto

```bash
npm run dev
```

## 🎯 Para Probar que Funciona:

1. Abre http://localhost:5173
2. Llena el formulario con datos de prueba
3. Verifica que aparezca en Google Sheets → pestaña "Pendientes"
4. Manualmente mueve la fila a "Confirmadas"
5. Cambia el "Estado Pago" a "Confirmado"
6. En la web, clic en "Ir a Talleres"
7. Ingresa el DNI de prueba
8. Deberías ver la lista de talleres

## ⚠️ RECORDATORIO IMPORTANTE:

- **NUNCA** subas el archivo `.env` a GitHub
- El `.gitignore` ya está configurado para protegerlo
- Cuando despliegues en producción, configura las variables de entorno en tu plataforma de hosting

---

**¡Todo listo!** Solo falta que completes los pasos 1-5 arriba y podrás empezar a usar tu sistema.
