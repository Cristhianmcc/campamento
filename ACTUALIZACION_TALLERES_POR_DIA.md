# 🔄 ACTUALIZACIÓN: Sistema de Talleres por Día

## 📋 Cambios Importantes

### Sistema Anterior
- ❌ 1 solo taller por persona
- ❌ 6 talleres fijos

### Sistema Nuevo
- ✅ 4 días de campamento
- ✅ 3 talleres por día (12 talleres en total)
- ✅ Cada persona puede elegir **2 talleres máximo por día**
- ✅ Total: 8 talleres por persona (2 por día x 4 días)
- ✅ Capacidad: 17 personas por taller

---

## 📊 Actualizar Google Sheets

### Paso 1: Agregar Nuevas Columnas

En tu hoja "Inscripciones", agrega estas columnas después de la columna N:

| Columna | Nombre | Descripción |
|---------|--------|-------------|
| O | Día 1 - Taller 1 | ID del taller (ej: dia1-taller1) |
| P | Día 1 - Taller 2 | ID del taller (ej: dia1-taller2) |
| Q | Día 2 - Taller 1 | ID del taller |
| R | Día 2 - Taller 2 | ID del taller |
| S | Día 3 - Taller 1 | ID del taller |
| T | Día 3 - Taller 2 | ID del taller |
| U | Día 4 - Taller 1 | ID del taller |
| V | Día 4 - Taller 2 | ID del taller |

### Paso 2: Estructura Final de la Hoja

```
A: Código
B: Nombres
C: Apellidos
D: Edad
E: DNI
F: Email
G: Teléfono
H: Iglesia
I: Necesidades
J: Estado Pago
K: Fecha Inscripción
L: Fecha Confirmación
M: [ELIMINAR - Ya no se usa]
N: [ELIMINAR - Ya no se usa]
O: Día 1 - Taller 1
P: Día 1 - Taller 2
Q: Día 2 - Taller 1
R: Día 2 - Taller 2
S: Día 3 - Taller 1
T: Día 3 - Taller 2
U: Día 4 - Taller 1
V: Día 4 - Taller 2
```

---

## 🎯 Talleres por Día

### Día 1: "El me llama por mi nombre"
- `dia1-taller1`: Resiliencia y esperanza
- `dia1-taller2`: Amistad, enamoramiento y noviazgo
- `dia1-taller3`: Identidad en la era digital

### Día 2: "El transforma mi manera de vivir"
- `dia2-taller1`: Finanzas inteligentes
- `dia2-taller2`: Música y contenido
- `dia2-taller3`: Verdad vs relativismo

### Día 3: "El guía mi vocación"
- `dia3-taller1`: Propósito y vocación
- `dia3-taller2`: Misiones
- `dia3-taller3`: Orientación vocacional y elección de carrera

### Día 4: "El me envía al mundo"
- `dia4-taller1`: Impacto comunitario
- `dia4-taller2`: Comunicación y redes sociales
- `dia4-taller3`: Proyecto de vida recargado

---

## 📝 Ejemplo de Registro

| DNI | Día 1 - T1 | Día 1 - T2 | Día 2 - T1 | Día 2 - T2 | Día 3 - T1 | Día 3 - T2 | Día 4 - T1 | Día 4 - T2 |
|-----|------------|------------|------------|------------|------------|------------|------------|------------|
| 12345678 | dia1-taller1 | dia1-taller3 | dia2-taller2 | dia2-taller3 | dia3-taller1 | dia3-taller2 | dia4-taller1 | dia4-taller3 |

Este usuario eligió:
- Día 1: Talleres 1 y 3
- Día 2: Talleres 2 y 3
- Día 3: Talleres 1 y 2
- Día 4: Talleres 1 y 3

---

## ⚠️ Validaciones del Sistema

1. **Mínimo por día**: Al menos 1 taller por día
2. **Máximo por día**: Máximo 2 talleres por día
3. **Capacidad**: 17 personas por taller
4. **Cupos llenos**: Si un taller está lleno, se marca como "No disponible"

---

## 🔧 Próximos Pasos

1. ✅ Actualizar estructura de Google Sheets (agregar columnas O-V)
2. ⏳ Actualizar backend para guardar múltiples talleres
3. ⏳ Actualizar componentes del frontend
4. ⏳ Implementar validación de cupos
5. ⏳ Actualizar sincronización de talleres

---

## 📌 Notas Importantes

- Las columnas M y N (antiguo sistema de 1 taller) se pueden eliminar después de migrar
- El sistema valida automáticamente que no excedas 2 talleres por día
- Si todos los talleres de un día están llenos, se mostrará un mensaje de error
- Los datos antiguos se mantendrán para referencia
