# 📸 Configurar Imagen Preview para WhatsApp

## ✅ Cambios Realizados

### 1. Meta Tags de Open Graph Agregados
Se agregaron meta tags en `index.html` para que WhatsApp y redes sociales muestren preview:

```html
<!-- Open Graph / Facebook / WhatsApp -->
<meta property="og:image" content="https://campamento2025.netlify.app/preview.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

### 2. Botón Flotante Removido
✅ Se eliminó el botón flotante "Ir a Talleres" de la página de inicio
✅ Solo queda el botón en el Hero Section al lado de "Inscríbete Ahora"

---

## 📋 Pasos para Activar la Imagen Preview

### Opción 1: Crear Imagen de Captura de Pantalla

1. **Tomar captura de tu página**:
   - Abre tu página web en el navegador
   - Toma una captura de pantalla de la sección principal (Hero)
   - Dimensiones recomendadas: **1200 x 630 píxeles**

2. **Editar la imagen** (opcional):
   - Usa Photoshop, Canva, o cualquier editor
   - Agrega texto como "Campamento Cristiano 2025"
   - Mantén proporción 1.91:1 (1200x630)

3. **Guardar como `preview.jpg`**:
   - Guarda la imagen en la carpeta `public/` de tu proyecto
   - Nombre exacto: `preview.jpg`
   - Formato: JPG o PNG
   - Peso: menos de 300KB (para carga rápida)

### Opción 2: Usar Imagen Diseñada

Crea una imagen atractiva con:
- Logo del campamento
- Fecha y lugar
- Call-to-action: "¡Inscríbete Ahora!"
- Colores del branding

---

## 📁 Estructura del Proyecto

```
campamento/
├── public/
│   └── preview.jpg          ← COLOCA TU IMAGEN AQUÍ
├── index.html               ← Meta tags configurados ✅
└── src/
```

---

## 🚀 Después de Agregar la Imagen

1. **Sube los cambios a Netlify**:
   ```bash
   git add .
   git commit -m "feat: agregar preview image para WhatsApp"
   git push origin master
   ```

2. **Verifica que la imagen esté accesible**:
   - Abre: `https://campamento2025.netlify.app/preview.jpg`
   - Deberías ver tu imagen

3. **Prueba en WhatsApp**:
   - Comparte el link: `https://campamento2025.netlify.app/`
   - WhatsApp mostrará la imagen preview automáticamente

4. **Limpiar caché de WhatsApp** (si no aparece):
   - WhatsApp cachea previews por 7 días
   - Usa esta herramienta: https://developers.facebook.com/tools/debug/
   - Pega tu URL y haz clic en "Scrape Again"

---

## 📐 Especificaciones Técnicas

### Imagen Preview Ideal:
- **Dimensiones**: 1200 x 630 píxeles
- **Proporción**: 1.91:1
- **Formato**: JPG o PNG
- **Peso**: < 300KB
- **Nombre**: `preview.jpg`

### Ubicación:
```
public/preview.jpg
```

### URL Final:
```
https://campamento2025.netlify.app/preview.jpg
```

---

## 🛠️ Actualizar URL del Preview (Opcional)

Si tu dominio de Netlify es diferente, actualiza en `index.html`:

```html
<!-- Cambiar esta URL -->
<meta property="og:image" content="https://TU-DOMINIO.netlify.app/preview.jpg" />
<meta property="og:url" content="https://TU-DOMINIO.netlify.app/" />
```

---

## ✨ Resultado Esperado

Cuando compartas el link en WhatsApp:

```
┌─────────────────────────────┐
│   [Imagen Preview Grande]   │
│                             │
│  Campamento Cristiano 2025  │
│  ¡Inscríbete Ahora!         │
│                             │
│  Únete al Campamento...     │
│                             │
│  campamento2025.netlify.app │
└─────────────────────────────┘
```

---

## 🎯 Checklist

- [ ] Crear imagen `preview.jpg` (1200 x 630 px)
- [ ] Colocar en carpeta `public/`
- [ ] Hacer commit y push a Netlify
- [ ] Verificar acceso: `https://tu-dominio.netlify.app/preview.jpg`
- [ ] Probar compartir en WhatsApp
- [ ] (Opcional) Limpiar caché en Facebook Debugger

---

## 📝 Notas Importantes

1. **La imagen DEBE estar en `public/preview.jpg`** - Netlify la servirá desde la raíz
2. **Usa JPG para menor peso** - Más rápida carga en WhatsApp
3. **Texto legible** - La imagen se ve pequeña en móviles
4. **Evita texto muy pequeño** - Debe leerse en miniatura
5. **WhatsApp cachea** - Cambios pueden tardar hasta 7 días en reflejarse

---

## 🔗 Recursos Útiles

- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Canva (diseño)**: https://www.canva.com/
- **Compresión de imágenes**: https://tinypng.com/
- **Guía Open Graph**: https://ogp.me/
