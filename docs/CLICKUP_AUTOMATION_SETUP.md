# ✅ COPILOT INSTRUCTIONS UPDATED - ClickUp Task Automation

## 📋 Cambios Realizados

### 1. ✅ Actualizado `.github/copilot-instructions.md`

Se agregó una **nueva sección completa** de "ClickUp Task Management" con:
- Instrucciones para crear tareas de sprint
- Métodos de creación (personalizados y en lote)
- Funciones disponibles de los scripts helper
- Convención de tags
- Ejemplos de flujo de trabajo

### 2. ✅ Creado Script de Sprint 5-6

**Archivo**: `backlog/create-sprint-5-6-tasks.sh`

Características:
- 16 tareas de Sprint 5-6 (Nov 13-24, 2025)
- 80 horas totales (58h TIER 1 + 22h TIER 2)
- TIER 1: Dark Mode (14h ⭐ PRIORITY #1), Extension, Favoritos, Historia
- TIER 2: 7 tareas de optimización UX (22h)
- Todas las subtareas y criterios de aceptación incluidos
- Color-coded output (Magenta TIER 1, Yellow TIER 2)
- Código listo para ejecutar con API key de ClickUp

**Uso**:
```bash
export CLICKUP_MCP_API_KEY="tu-api-key"
source backlog/create-sprint-5-6-tasks.sh
```

### 3. ✅ Creado README de Scripts de ClickUp

**Archivo**: `backlog/CLICKUP_SCRIPTS_README.md`

Contiene:
- Quick start guide
- Descripción de todos los scripts
- Configuración de API key
- Convención de tags
- Niveles de prioridad
- Instrucciones para crear tareas personalizadas
- Flujo de trabajo para sprints futuros
- Troubleshooting

### 4. ✅ Documentación de Copilot Actualizada

La sección agregada a `copilot-instructions.md` incluye:

```markdown
## ClickUp Task Management

### Creating Sprint Tasks

When instructed to create ClickUp tasks for a sprint, use the existing automation scripts located in `backlog/`:

**Environment Setup** (One-time):
export CLICKUP_MCP_API_KEY="your-api-key-here"

**Method 1: Create Custom Sprint Tasks** (Recommended for new sprints)
- Create task preview document
- Run creation script with helper functions
- Helper Functions Available

**Method 2: Bulk Task Creation from JSON**
- Use pre-built scripts for standard sprints

**Key Files**:
- backlog/clickup-helpers.sh
- backlog/create-clickup-tasks.sh
- docs/SPRINT_X_Y_CLICKUP_PREVIEW.md

**Workflow Example**
```

## 🎯 Cómo Usar Ahora

### Opción 1: Crear Tareas con el Script (Recomendado)

```bash
# 1. Configurar API key
export CLICKUP_MCP_API_KEY="tu-api-key"

# 2. Ejecutar el script de Sprint 5-6
source backlog/create-sprint-5-6-tasks.sh

# O usar funciones helper para tareas individuales
source backlog/clickup-helpers.sh
clickup_feature "Feature Name" "Description" client effort-large
```

### Opción 2: Decirle a Copilot

Simplemente puedes decirme:
> "Crea las tareas en ClickUp para Sprint 5-6"

Y yo usaré automáticamente:
1. El preview que ya existe: `docs/SPRINT_5_6_CLICKUP_PREVIEW.md`
2. El script de creación: `backlog/create-sprint-5-6-tasks.sh`
3. Los helper functions para crear las tareas

## 📊 Tareas Preparadas para Sprint 5-6

✅ **16 tareas totales** | 80 horas | Nov 13-24, 2025

**TIER 1: MUST HAVE** (58 horas)
1. Dark Mode Implementation (14h) ⭐ PRIORITY #1
2. Conversion Preview (10h)
3. Favorites/Bookmarks (10h)
4. User Menu Position Review (6h)
5. Conversion History (10h)
6. Right-Click Context Menu (8h)
7. Auto URL Detection (8h)
8. Settings Panel (8h)
9. Notifications & Feedback (6h)

**TIER 2: SHOULD HAVE** (22 horas)
10. Error Handling & Highlighting (4h)
11. Login Modal (5h)
12. Link Cursor & Hover Effects (4h)
13. Database Persistence (8h)
14. Security - URL Sanitization (4h)
15. CORS Configuration (3h)
16. Additional UX Polish (4h)

## 🔑 Información Importante

**ClickUp List ID**: `901111127909` (ya configurado en scripts)

**Tags Automáticos**:
- Sprint: `sprint-5-6`
- Type: `feat`, `fix`, `perf`, etc.
- Scope: `client`, `api`, `extension`, etc.
- Effort: `effort-small`, `effort-medium`, `effort-large`
- Status: `Q4-2025`

**Prioridades**:
- Priority 1 (🔥 HIGHEST) - TIER 1 critical
- Priority 2 (🟠 HIGH) - TIER 1 important
- Priority 3 (🟡 MEDIUM) - TIER 2
- Priority 4 (🟢 LOW) - Future

## 📁 Archivos Creados/Modificados

1. ✅ `.github/copilot-instructions.md` - Actualizado con sección ClickUp
2. ✅ `backlog/create-sprint-5-6-tasks.sh` - Script ejecutable para Sprint 5-6
3. ✅ `backlog/CLICKUP_SCRIPTS_README.md` - Documentación completa
4. ✅ `docs/SPRINT_5_6_CLICKUP_PREVIEW.md` - Preview de tareas (existente)

## ✨ Beneficios

✅ **Automatización Completa**: No necesitas API manual, los scripts manejan todo
✅ **Consistencia**: Tags, prioridades, y estructura están estandarizados
✅ **Documentación Clara**: Cada script está bien documentado
✅ **Reutilizable**: Los helper functions sirven para cualquier sprint
✅ **Fácil de Extender**: Puedo crear nuevos sprints rápidamente

## 🚀 Próximos Pasos

Para crear las tareas de Sprint 5-6 en ClickUp:

1. **Opción A** - Usar script directamente:
   ```bash
   export CLICKUP_MCP_API_KEY="tu-api-key"
   source backlog/create-sprint-5-6-tasks.sh
   ```

2. **Opción B** - Decirme que lo haga (necesitas API key configurada)

3. **Opción C** - Usar helper functions para crear tareas individuales

## 📌 Importante

Los scripts necesitan tu **ClickUp API Key** en la variable de entorno:
```bash
export CLICKUP_MCP_API_KEY="pk_..."
```

Obtén tu API key en: https://app.clickup.com/account/settings

---

**Generado**: Nov 14, 2025  
**Sprint Actual**: 5-6 (Nov 13-24, 2025)  
**Release Target**: v2.5.0
