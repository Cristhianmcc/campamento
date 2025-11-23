# 🏕️ Landing Page Campamento Cristiano

## 📋 Descripción
Landing page profesional y reutilizable para campamentos cristianos con formulario de inscripción, integración con Google Sheets y sistema de pagos mediante YAPE/PLIN.

## ✨ Características
- ✅ Banner hero grande y personalizable
- ✅ Diseño responsivo con colores sólidos cristianos
- ✅ Formulario de inscripción con validación
- ✅ Modal de pago con QR de YAPE y PLIN
- ✅ Integración con Google Sheets API
- ✅ Completamente reutilizable para nuevos campamentos

## 🎨 Paleta de Colores
- **Azul (#1e3a8a, #2563eb)**: Representa la fe y la espiritualidad
- **Amarillo/Dorado (#facc15)**: Simboliza la luz divina
- **Naranja (#f97316)**: Llamado a la acción (CTA)
- **Blanco**: Pureza y claridad

## 🚀 Configuración Rápida para Nuevos Campamentos

### 1. Actualizar Información del Campamento
Edita el archivo `/config/campamento.ts` con los datos de tu nuevo campamento:

\`\`\`typescript
export const campamentoConfig = {
  nombre: "Campamento Esperanza 2025",          // Nombre del campamento
  lema: "Renovando nuestra fe en Cristo",      // Lema o tema
  fechas: "15 - 20 de Enero 2025",             // Fechas del evento
  lugar: "Centro Recreacional Valle Verde",     // Ubicación
  precio: "S/ 250.00",                         // Precio de inscripción
  
  // ... actualiza todos los campos según tu campamento
};
\`\`\`

### 2. Actualizar Imágenes

#### Banner Principal
Reemplaza la URL en \`imagenHero\` con la imagen de tu campamento:
\`\`\`typescript
imagenHero: "TU_URL_DE_IMAGEN_AQUI"
\`\`\`

#### Códigos QR de Pago
1. Genera tus códigos QR de YAPE y PLIN
2. Súbelos a un servicio de imágenes (Imgur, Cloudinary, etc.)
3. Actualiza las URLs:
\`\`\`typescript
imagenQRYape: "URL_DEL_QR_YAPE",
imagenQRPlin: "URL_DEL_QR_PLIN"
\`\`\`

### 3. Configurar Google Sheets API

#### Paso 1: Crear Proyecto en Google Cloud
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. En el menú lateral, ve a "APIs y servicios" → "Biblioteca"
4. Busca "Google Sheets API"
5. Haz clic en "Habilitar"

#### Paso 2: Crear Credenciales
1. Ve a "APIs y servicios" → "Credenciales"
2. Haz clic en "Crear credenciales" → "Clave de API"
3. Copia la clave generada
4. Pégala en \`/config/campamento.ts\` en el campo \`googleSheets.apiKey\`

#### Paso 3: Crear y Configurar Google Sheet
1. Crea una nueva [Google Sheet](https://sheets.google.com)
2. Nombra la primera hoja como **"Inscripciones"**
3. Agrega estos encabezados en la fila 1:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Nombres | Apellidos | Edad | DNI | Email | Teléfono | Iglesia | Necesidades Especiales | Fecha Inscripción |

4. Haz clic en "Compartir" (esquina superior derecha)
5. Cambia los permisos a: **"Cualquier persona con el enlace puede editar"**
6. Copia el ID de la hoja de cálculo (está en la URL):
   - URL ejemplo: `https://docs.google.com/spreadsheets/d/`**`1ABC123xyz...`**`/edit`
   - El ID es la parte resaltada
7. Pégalo en \`/config/campamento.ts\` en el campo \`googleSheets.spreadsheetId\`

#### Configuración Final en campamento.ts:
\`\`\`typescript
googleSheets: {
  apiKey: "AIzaSyD...",                    // Tu API Key
  spreadsheetId: "1ABC123xyz...",          // ID de tu Sheet
  range: "Inscripciones!A:I",              // Rango de datos
}
\`\`\`

### 4. Información de Pago
Actualiza los números de YAPE y PLIN:
\`\`\`typescript
yapeNumero: "+51 987 654 321",
yapeTitular: "Iglesia Nueva Vida",
plinNumero: "+51 987 654 321",
plinTitular: "Iglesia Nueva Vida",
\`\`\`

### 5. Información de Contacto y Redes Sociales
\`\`\`typescript
contacto: {
  email: "campamento@tuiglesia.org",
  telefono: "+51 987 654 321",
  whatsapp: "+51987654321",
  direccion: "Tu dirección aquí",
},
redesSociales: {
  facebook: "https://facebook.com/tuiglesia",
  instagram: "https://instagram.com/tuiglesia",
  youtube: "https://youtube.com/tuiglesia",
}
\`\`\`

## 📱 Funcionalidades

### Formulario de Inscripción
- Validación de campos en tiempo real
- Campos obligatorios marcados con *
- Validación de email, DNI y teléfono
- Campo opcional para necesidades especiales

### Modal de Pago
- Tabs para YAPE y PLIN
- Códigos QR escaneables
- Botón para copiar números al portapapeles
- Instrucciones claras de pago

### Integración Google Sheets
- Guarda automáticamente las inscripciones
- Incluye timestamp de inscripción
- Maneja errores de forma elegante
- Modo demo si no está configurado

## 🔧 Modo Demo
Si no has configurado Google Sheets aún, la aplicación funcionará en modo demo:
- Los datos se mostrarán en la consola del navegador
- No se guardará en Google Sheets
- Todas las demás funciones trabajarán normalmente

## 📊 Ver Inscripciones
Para ver las inscripciones, simplemente abre tu Google Sheet. Los datos se agregarán automáticamente cada vez que alguien se inscriba.

## 🎯 Mejores Prácticas

### Seguridad
- ⚠️ **IMPORTANTE**: En producción, no expongas tu API key
- Considera usar una cuenta de servicio
- Usa variables de entorno para credenciales
- Implementa un backend para mayor seguridad

### Reutilización
1. Duplica el proyecto para cada nuevo campamento
2. Actualiza solo el archivo \`/config/campamento.ts\`
3. Cambia las imágenes
4. Crea un nuevo Google Sheet para cada campamento
5. ¡Listo! Tu nueva landing page está lista

## 🎨 Personalización Adicional

### Cambiar Colores
Los colores están aplicados directamente en los componentes usando clases de Tailwind:
- **Azul**: \`bg-blue-600\`, \`text-blue-900\`, etc.
- **Amarillo**: \`bg-yellow-400\`, \`text-yellow-300\`, etc.
- **Naranja**: \`bg-orange-500\`, \`hover:bg-orange-600\`, etc.

Para cambiar la paleta de colores, busca y reemplaza estas clases en los componentes.

### Agregar Secciones
Puedes agregar nuevas secciones creando componentes en \`/components\` e importándolos en \`App.tsx\`.

## 📞 Soporte
Para preguntas sobre configuración, consulta:
- Documentación de Google Sheets API
- Archivo \`/services/googleSheets.ts\` (incluye instrucciones detalladas)

## ✅ Checklist Pre-Lanzamiento
- [ ] Actualizar información del campamento en \`/config/campamento.ts\`
- [ ] Subir y actualizar imagen del banner principal
- [ ] Generar y subir códigos QR de YAPE y PLIN
- [ ] Configurar Google Sheets API
- [ ] Crear y configurar Google Sheet con encabezados
- [ ] Actualizar información de contacto
- [ ] Actualizar enlaces de redes sociales
- [ ] Probar el formulario de inscripción
- [ ] Probar que los datos se guarden en Google Sheets
- [ ] Verificar diseño en móvil y desktop

---

**¡Tu landing page está lista para recibir inscripciones! 🎉**
