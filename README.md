# Landing Page - Campamento Cristiano

Sistema de inscripciones para campamentos cristianos con integración a Google Sheets y WhatsApp.

## Características

- Formulario de inscripción con validación
- Integración con Google Sheets para almacenar inscripciones
- Sistema de verificación de DNI duplicado
- Envío automático de comprobantes por WhatsApp
- Sistema de estados: Pendientes y Confirmadas
- Diseño responsive para móviles, tablets y desktop
- Métodos de pago: YAPE y PLIN

## Instalación Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## Configuración

### 1. Google Sheets
Sigue la guía en `GUIA_API_GOOGLE_SHEETS.md` para:
- Obtener tu API Key de Google
- Crear y configurar tu Google Sheet

### 2. Configurar el Proyecto
Edita `src/config/campamento.ts` con tus datos

## Deployment en Netlify

### Deploy desde GitHub

1. Sube tu proyecto a GitHub
2. Ve a [Netlify](https://app.netlify.com)
3. Importa tu repositorio
4. Netlify detectará automáticamente la configuración
5. Haz clic en "Deploy"

### Deploy Manual

```bash
npm run build
```

Arrastra la carpeta `dist` a Netlify.

## Documentación

- **Google Sheets API**: Ver `GUIA_API_GOOGLE_SHEETS.md`
- **Configuración de Sheets**: Ver `CONFIGURACION_GOOGLE_SHEETS.md`