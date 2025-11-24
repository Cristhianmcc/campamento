# Configuración de Google Sheets para Talleres

## Estructura de las Hojas

### Hoja "Pendientes"
Esta hoja almacena las inscripciones que aún no han sido confirmadas.

**Columnas (A-N):**
- A: Código (DNI)
- B: Nombres
- C: Apellidos
- D: Edad
- E: DNI
- F: Email
- G: Teléfono
- H: Iglesia
- I: Necesidades Especiales
- J: Estado Pago
- K: Fecha Inscripción
- L: Fecha Confirmación
- M: Taller Asignado (ID del taller)
- N: Fecha Registro Taller

### Hoja "Confirmadas"
Esta hoja almacena las inscripciones con pago confirmado.

**Columnas (A-N):**
- A: Código (DNI)
- B: Nombres
- C: Apellidos
- D: Edad
- E: DNI
- F: Email
- G: Teléfono
- H: Iglesia
- I: Necesidades Especiales
- J: Estado Pago (debe ser "Confirmado")
- K: Fecha Inscripción
- L: Fecha Confirmación
- M: Taller Asignado (ID del taller - se llena cuando el usuario se registra)
- N: Fecha Registro Taller (se llena automáticamente)

## Flujo de Trabajo

### 1. Inscripción Inicial
- El usuario completa el formulario en la web
- Los datos se guardan automáticamente en la hoja "Pendientes"
- Estado Pago: "Pendiente"

### 2. Proceso de Pago
- El usuario sube la captura del comprobante
- Envía el comprobante por WhatsApp con su DNI
- El organizador verifica el pago

### 3. Confirmación de Pago (MANUAL)
**El organizador debe hacer esto manualmente en Google Sheets:**
1. Abrir la hoja "Pendientes"
2. Localizar la fila del usuario que pagó
3. Copiar toda la fila (A-L)
4. Ir a la hoja "Confirmadas"
5. Pegar la fila
6. En la columna J, cambiar "Pendiente" a "Confirmado"
7. En la columna L, poner la fecha de confirmación
8. Volver a "Pendientes" y eliminar la fila del usuario

### 4. Registro en Talleres
- El usuario ingresa con su DNI en la sección de talleres
- El sistema verifica en la hoja "Confirmadas" que su pago esté confirmado
- Si está confirmado, puede acceder a la selección de talleres
- Al seleccionar un taller:
  - Se actualiza la columna M con el ID del taller
  - Se actualiza la columna N con la fecha de registro
  - El usuario NO puede registrarse en otro taller

### 5. Restricciones
- Un usuario solo puede registrarse en UN taller
- Solo pueden acceder a talleres los usuarios con pago confirmado
- Una vez registrado en un taller, no puede cambiarlo

## IDs de Talleres

Los IDs de talleres configurados son:
- `taller-1`: Adoración y Música
- `taller-2`: Evangelismo y Misiones
- `taller-3`: Liderazgo Juvenil
- `taller-4`: Estudio Bíblico Profundo
- `taller-5`: Ministerio Infantil
- `taller-6`: Consejería Cristiana

## Importante

⚠️ **SEGURIDAD:**
- Nunca compartas tu API Key públicamente
- Asegúrate de que los permisos de la hoja permitan edición desde la aplicación
- Para producción, considera usar OAuth 2.0 o una cuenta de servicio

⚠️ **PROCESO MANUAL:**
- La confirmación de pagos debe hacerse MANUALMENTE
- El organizador es responsable de mover las filas de "Pendientes" a "Confirmadas"
- Verificar siempre que el estado sea "Confirmado" antes de que el usuario acceda

## Consultas Frecuentes

**P: ¿Por qué el usuario no puede acceder a talleres?**
R: Verifica que su fila esté en "Confirmadas" y que el estado sea "Confirmado"

**P: ¿Cómo cambio el taller de un usuario?**
R: Borra el contenido de las columnas M y N en su fila de "Confirmadas"

**P: ¿Puedo aumentar la capacidad de un taller?**
R: Sí, edita el valor en `src/config/campamento.ts` en la propiedad `capacidadMaxima`
