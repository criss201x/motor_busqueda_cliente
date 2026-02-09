# Motor de Búsqueda de Horarios Académicos

Sistema de búsqueda y visualización de horarios académicos construido con Svelte.

## 🚀 Características

- ✅ Búsqueda de espacios académicos
- ✅ Filtrado por grupos
- ✅ Visualización de horarios en tabla interactiva
- ✅ Detección de conflictos de horarios
- ✅ Datos cargados desde archivo JSON local (sin dependencia de Firebase Database)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 🔐 Seguridad

Para información sobre el manejo seguro de credenciales y secretos, consulta [SECURITY.md](SECURITY.md).

**Importante:** Este proyecto ya NO utiliza Firebase Database. Los datos se cargan desde `data/horarios_2026-1_actualizado.json`.

## 📁 Estructura de Datos

Los datos se almacenan en formato JSON en la carpeta `data/`. Ver `modelo_de_datos.json` para la estructura completa.

## 🚀 CI/CD

El proyecto usa GitHub Actions para deploy automático a Firebase Hosting:
- **Push a main**: Deploy a producción
- **Pull requests**: Deploy preview


## Licencia
This file is part of Motor_busqueda_ETL

Motor_busqueda_ETL is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

Motor_busqueda_ETL is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Motor_busqueda_ETL. If not, see https://www.gnu.org/licenses/.
