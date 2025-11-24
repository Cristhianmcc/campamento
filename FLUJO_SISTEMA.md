# Diagrama de Flujo - Sistema de Inscripciones y Talleres

## 🔄 FLUJO COMPLETO DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FASE 1: INSCRIPCIÓN Y PAGO                        │
└─────────────────────────────────────────────────────────────────────┘

1. [USUARIO] Entra a la página web
        ↓
2. [USUARIO] Llena formulario de inscripción
        ↓
3. [SISTEMA] Valida que DNI no exista en "Pendientes" ni "Confirmadas"
        ↓
        ├─→ SI EXISTE → Mensaje de error "DNI ya registrado"
        │
        └─→ NO EXISTE
                ↓
4. [SISTEMA] Guarda datos en Google Sheets (hoja "Pendientes")
   Columnas: A-L (Estado = "Pendiente")
        ↓
5. [SISTEMA] Abre Modal de Pago
        ↓
6. [USUARIO] Ve QR de YAPE o PLIN
        ↓
7. [USUARIO] Realiza el pago en su app
        ↓
8. [USUARIO] Toma captura de pantalla del comprobante
        ↓
9. [USUARIO] En la web: clic en "Adjuntar Comprobante"
        ↓
10. [SISTEMA] Valida que sea imagen (PNG, JPG, JPEG)
    Valida tamaño máximo 5MB
        ↓
11. [USUARIO] Clic en "Enviar por WhatsApp"
        ↓
12. [SISTEMA] Genera mensaje pre-llenado:
    "Hola, he realizado el pago para el campamento.
     DNI: *[DNI del usuario]*
     Nombre: [Nombre completo]
     Monto: S/ 250.00
     Adjunto captura del comprobante de pago."
        ↓
13. [SISTEMA] Abre WhatsApp Web con el mensaje
        ↓
14. [USUARIO] Adjunta manualmente la captura y envía
        ↓
15. [USUARIO] Espera confirmación del organizador


┌─────────────────────────────────────────────────────────────────────┐
│              FASE 2: CONFIRMACIÓN MANUAL (ORGANIZADOR)               │
└─────────────────────────────────────────────────────────────────────┘

16. [ORGANIZADOR] Recibe mensaje por WhatsApp
        ↓
17. [ORGANIZADOR] Verifica el pago en banco/app
        ↓
        ├─→ PAGO INCORRECTO → Contacta al usuario
        │
        └─→ PAGO CORRECTO
                ↓
18. [ORGANIZADOR] Abre Google Sheets
        ↓
19. [ORGANIZADOR] Busca DNI en hoja "Pendientes" (columna E)
        ↓
20. [ORGANIZADOR] Copia toda la fila (A-L)
        ↓
21. [ORGANIZADOR] Pega en hoja "Confirmadas"
        ↓
22. [ORGANIZADOR] Edita columna J: "Pendiente" → "Confirmado"
        ↓
23. [ORGANIZADOR] Edita columna L: agrega fecha de confirmación
        ↓
24. [ORGANIZADOR] Elimina la fila de "Pendientes"
        ↓
25. [ORGANIZADOR] Notifica al usuario (opcional)


┌─────────────────────────────────────────────────────────────────────┐
│                  FASE 3: ACCESO A TALLERES                           │
└─────────────────────────────────────────────────────────────────────┘

26. [USUARIO] En la web, clic en "Ir a Talleres"
        ↓
27. [SISTEMA] Muestra pantalla "Acceso a Talleres"
        ↓
28. [USUARIO] Ingresa su DNI (8 dígitos)
        ↓
29. [SISTEMA] Busca DNI en hoja "Confirmadas" (columna E)
        ↓
        ├─→ NO ENCONTRADO → "Pago no confirmado"
        │
        └─→ ENCONTRADO
                ↓
30. [SISTEMA] Verifica columna J = "Confirmado"
        ↓
        ├─→ NO CONFIRMADO → "Acceso denegado"
        │
        └─→ CONFIRMADO
                ↓
31. [SISTEMA] Verifica columna M (Taller Asignado)
        ↓
        ├─→ YA TIENE TALLER → Pantalla "Ya estás registrado"
        │                      No puede acceder
        │
        └─→ NO TIENE TALLER
                ↓
32. [SISTEMA] Muestra pantalla "Selección de Talleres"


┌─────────────────────────────────────────────────────────────────────┐
│                  FASE 4: SELECCIÓN DE TALLER                         │
└─────────────────────────────────────────────────────────────────────┘

33. [USUARIO] Ve grid con todos los talleres disponibles
        ↓
34. [USUARIO] Revisa información de cada taller:
    - Nombre, descripción
    - Instructor
    - Horario, lugar
    - Cupos disponibles (con barra de progreso)
        ↓
35. [USUARIO] Clic en "Seleccionar Taller"
        ↓
36. [SISTEMA] Verifica si hay cupos disponibles
        ↓
        ├─→ LLENO → Mensaje "Taller lleno"
        │
        └─→ HAY CUPOS
                ↓
37. [SISTEMA] Abre Modal de Confirmación
        ↓
38. [USUARIO] Revisa información del taller seleccionado
        ↓
        ├─→ Clic en "Cancelar" → Vuelve a lista de talleres
        │
        └─→ Clic en "Confirmar Registro"
                ↓
39. [SISTEMA] Verifica nuevamente que usuario no tenga taller
        ↓
40. [SISTEMA] Busca fila del usuario en "Confirmadas" (columna E = DNI)
        ↓
41. [SISTEMA] Actualiza columna M: ID del taller (ej: "taller-3")
        ↓
42. [SISTEMA] Actualiza columna N: Fecha y hora de registro
        ↓
43. [SISTEMA] Muestra mensaje "¡Registro exitoso!"
        ↓
44. [SISTEMA] Redirige a pantalla "Ya estás registrado en un taller"
        ↓
45. [USUARIO] No puede acceder a más talleres


┌─────────────────────────────────────────────────────────────────────┐
│                  INTENTOS POSTERIORES                                │
└─────────────────────────────────────────────────────────────────────┘

46. [USUARIO] Intenta acceder nuevamente a "Ir a Talleres"
        ↓
47. [USUARIO] Ingresa su DNI
        ↓
48. [SISTEMA] Verifica columna M en "Confirmadas"
        ↓
49. [SISTEMA] Detecta que ya tiene taller asignado
        ↓
50. [SISTEMA] Muestra pantalla "Ya estás registrado en un taller"
    No permite acceso a selección
```

## 📊 ESTADO DE DATOS EN CADA FASE

### DESPUÉS DE INSCRIPCIÓN (Hoja "Pendientes")
```
DNI: 12345678
Estado (J): Pendiente
Fecha Inscripción (K): 23/11/2025 10:30
Fecha Confirmación (L): [vacío]
Taller Asignado (M): [vacío]
Fecha Registro Taller (N): [vacío]
```

### DESPUÉS DE CONFIRMACIÓN (Hoja "Confirmadas")
```
DNI: 12345678
Estado (J): Confirmado ✅
Fecha Inscripción (K): 23/11/2025 10:30
Fecha Confirmación (L): 23/11/2025 15:45 ✅
Taller Asignado (M): [vacío]
Fecha Registro Taller (N): [vacío]
```

### DESPUÉS DE REGISTRO EN TALLER (Hoja "Confirmadas")
```
DNI: 12345678
Estado (J): Confirmado ✅
Fecha Inscripción (K): 23/11/2025 10:30
Fecha Confirmación (L): 23/11/2025 15:45 ✅
Taller Asignado (M): taller-3 ✅
Fecha Registro Taller (N): 23/11/2025 18:20 ✅
```

## 🔒 RESTRICCIONES Y VALIDACIONES

1. **DNI Único**: No permite duplicados en Pendientes ni Confirmadas
2. **Pago Confirmado**: Solo puede acceder a talleres si está en "Confirmadas" con estado "Confirmado"
3. **Un Solo Taller**: Una vez registrado en un taller, no puede cambiar ni registrarse en otro
4. **Capacidad**: Respeta el límite de cupos por taller
5. **Imagen Obligatoria**: Debe adjuntar comprobante antes de enviar WhatsApp

## 🎯 PUNTOS CLAVE PARA EL ORGANIZADOR

- ✅ Mover manualmente de "Pendientes" a "Confirmadas"
- ✅ Cambiar estado a "Confirmado"
- ✅ Agregar fecha de confirmación
- ✅ No tocar columnas M y N (se actualizan automáticamente)
- ✅ Para reasignar taller: borrar contenido de M y N
