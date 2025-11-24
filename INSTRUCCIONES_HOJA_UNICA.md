# 📋 CONFIGURACIÓN DE GOOGLE SHEETS - HOJA ÚNICA

## ✅ Cambio Implementado

El sistema ahora usa **UNA SOLA HOJA** en lugar de dos. Esto es:
- ✅ Más simple
- ✅ Más rápido
- ✅ Menos errores
- ✅ Más fácil de gestionar

---

## 🔧 Pasos para Configurar

### 1. Renombrar la Hoja Actual

En tu Google Sheet, renombra la pestaña "Confirmadas" a:
```
Inscripciones
```

(Puedes eliminar la pestaña "Pendientes")

### 2. Verificar Encabezados

Asegúrate de que la fila 1 tenga estos encabezados:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Código | Nombres | Apellidos | Edad | DNI | Email | Teléfono | Iglesia | Necesidades | **Estado Pago** | Fecha Insc | Fecha Conf | Taller | Fecha Taller |

### 3. Configurar Validación de Datos (Dropdown)

#### Paso 1: Seleccionar columna J
- Haz clic en la letra **J** (columna "Estado Pago")
- Esto selecciona toda la columna

#### Paso 2: Crear la validación
1. Ve a menú **Datos** → **Validación de datos**
2. En "Criterios", selecciona: **Lista de elementos**
3. Escribe:
   ```
   Pendiente,Confirmado
   ```
4. ✅ Marca "Mostrar lista desplegable en la celda"
5. ✅ Marca "Rechazar entrada si los datos no son válidos"
6. Clic en **Guardar**

#### Paso 3: Aplicar a partir de la fila 2
- Asegúrate de que la validación se aplique desde J2 hacia abajo
- No debe aplicarse a J1 (encabezado)

### 4. Estilo Opcional (Recomendado)

Para hacer más visual el estado, puedes agregar formato condicional:

#### Para "Pendiente" (amarillo):
1. Selecciona columna J
2. Menú **Formato** → **Formato condicional**
3. Aplica a rango: `J2:J1000`
4. Condición: **El texto contiene** → `Pendiente`
5. Color de fondo: **Amarillo claro**

#### Para "Confirmado" (verde):
1. Agregar otra regla
2. Condición: **El texto contiene** → `Confirmado`
3. Color de fondo: **Verde claro**

---

## 🎯 Flujo Actualizado

### Antes (2 hojas - complicado):
```
1. Usuario se inscribe → Guarda en "Pendientes"
2. Admin verifica pago
3. Admin copia toda la fila
4. Admin pega en "Confirmadas"
5. Admin cambia estado a "Confirmado"
6. Admin elimina de "Pendientes"
❌ 6 pasos, propenso a errores
```

### Ahora (1 hoja - simple):
```
1. Usuario se inscribe → Guarda en "Inscripciones" (Estado: Pendiente)
2. Admin verifica pago
3. Admin abre el dropdown y cambia a "Confirmado"
✅ 3 pasos, sin errores
```

---

## 💡 Cómo Confirmar un Pago (Nuevo Proceso)

1. **Usuario se inscribe** → Aparece nueva fila con Estado Pago = "Pendiente"

2. **Usuario envía captura** → Por WhatsApp

3. **Admin verifica** → Revisa la captura

4. **Admin confirma** → 
   - Busca la fila del usuario por DNI
   - Haz clic en la celda de "Estado Pago" (columna J)
   - Se abre un dropdown
   - Selecciona "Confirmado"
   - Opcionalmente, agrega fecha en "Fecha Conf" (columna L)

5. **Usuario accede a talleres** → Ya puede ingresar con su DNI

---

## 🔍 Verificaciones del Sistema

El backend verifica automáticamente:

✅ **Verificar DNI existente:**
- Busca en toda la hoja "Inscripciones"

✅ **Verificar pago confirmado:**
- Busca DNI + Estado Pago = "Confirmado"

✅ **Verificar taller asignado:**
- Busca si columna M (Taller) tiene valor

✅ **Registrar en taller:**
- Actualiza columnas M y N

---

## 📊 Ejemplo de Datos

| Código | Nombres | Apellidos | Edad | DNI | Email | Teléfono | Iglesia | Necesidades | **Estado Pago** | Fecha Insc | Fecha Conf | Taller | Fecha Taller |
|--------|---------|-----------|------|-----|-------|----------|---------|-------------|-----------------|------------|------------|--------|--------------|
| 12345 | Juan | Pérez | 25 | 87654321 | juan@email.com | 987654321 | Iglesia A | N/A | **Pendiente** ⬇️ | 23/11/2025 | | | |
| 67890 | María | García | 22 | 12345678 | maria@email.com | 955195324 | Iglesia B | N/A | **Confirmado** ⬇️ | 23/11/2025 | 23/11/2025 | taller-1 | 23/11/2025 |

---

## ✅ Checklist de Configuración

- [ ] Renombrar hoja a "Inscripciones"
- [ ] Verificar encabezados en fila 1
- [ ] Configurar dropdown en columna J (Estado Pago)
- [ ] Probar dropdown: debe mostrar "Pendiente" y "Confirmado"
- [ ] (Opcional) Agregar formato condicional
- [ ] Eliminar hoja "Pendientes" si existe

---

## 🚀 Reiniciar Backend

Después de configurar la hoja, reinicia el backend:

```bash
# Detener el backend actual (Ctrl+C en la terminal)
# Luego iniciar de nuevo:
npm run server
```

O simplemente usa:

```bash
npm run dev:full
```

---

**¡Listo!** Ahora tienes un sistema mucho más simple y eficiente. 🎉
