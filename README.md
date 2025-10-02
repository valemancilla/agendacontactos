# 📋 Sistema de Gestión de Contactos y Entidades

## 📖 Descripción del Proyecto

Este es un sistema completo de gestión que permite administrar contactos, países, regiones, ciudades, empresas y sucursales. La aplicación está construida como una Single Page Application (SPA) que utiliza tecnologías web modernas para proporcionar una experiencia de usuario fluida e intuitiva.

El sistema está diseñado para manejar relaciones jerárquicas entre diferentes entidades, permitiendo una organización estructurada de la información empresarial y de contactos.

## ⭐ Características Destacadas

- **🎯 CRUD Completo**: Operaciones de Crear, Leer, Actualizar y Eliminar para todas las entidades
- **🔄 Interfaz Unificada**: Diseño consistente en todos los módulos
- **📱 Responsive**: Interfaz adaptable a diferentes tamaños de pantalla
- **⚡ Navegación Fluida**: Sistema de pestañas para alternar entre registro y listado
- **🔗 Relaciones Estructuradas**: Conexiones lógicas entre países, regiones, ciudades, empresas y sucursales
- **💾 Persistencia Local**: Base de datos JSON con JSON Server
- **🎨 UI Moderna**: Interfaz basada en Bootstrap con componentes personalizados

## 🎯 Objetivo

Crear una aplicación web que permita:
- Gestionar información de contactos personales y empresariales
- Organizar datos geográficos de manera jerárquica (Países → Regiones → Ciudades)
- Administrar empresas y sus sucursales
- Mantener relaciones entre todas las entidades del sistema
- Proporcionar una experiencia de usuario simple y eficiente

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica de la aplicación
- **CSS3**: Estilos personalizados y diseño responsive
- **JavaScript ES6+**: Lógica de la aplicación con módulos y async/await
- **Bootstrap 5**: Framework CSS para componentes UI
- **Web Components**: Elementos HTML personalizados

### Backend
- **JSON Server**: Servidor de desarrollo para API REST
- **JSON**: Base de datos en formato JSON

### Herramientas de Desarrollo
- **Node.js**: Runtime de JavaScript
- **NPX**: Ejecutor de paquetes de Node.js

## 📁 Estructura del Sistema

```
agendacontactos/
├── 📁 Apis/                          # APIs para comunicación con servidor
│   ├── 📁 branch/                    # API de sucursales
│   ├── 📁 city/                      # API de ciudades
│   ├── 📁 company/                   # API de empresas
│   ├── 📁 contact/                   # API de contactos
│   ├── 📁 country/                   # API de países
│   └── 📁 region/                    # API de regiones
├── 📁 App/                           # Componentes principales
│   └── 📁 Components/                # Componentes de la aplicación
│       ├── 📁 branches/              # Componentes de sucursales
│       ├── 📁 cities/                # Componentes de ciudades
│       ├── 📁 companies/             # Componentes de empresas
│       ├── 📁 contacto/              # Componentes de contactos
│       ├── 📁 countries/             # Componentes de países
│       ├── 📁 navMenu/               # Menú de navegación
│       └── 📁 regions/               # Componentes de regiones
├── 📁 css/                           # Estilos CSS
│   └── 📁 bootstrap/                 # Archivos de Bootstrap
├── 📁 js/                            # Scripts JavaScript
│   └── 📁 bootstrap/                 # Archivos JavaScript de Bootstrap
├── 📁 Models/                        # Modelos de datos
├── 📄 app.js                         # Archivo principal de la aplicación
├── 📄 db.json                        # Base de datos JSON
└── 📄 index.html                     # Página principal
```

## 📋 ¿Qué hace cada archivo?

### 📄 Archivos Principales

#### `index.html`
- **Propósito**: Página principal de la aplicación
- **Contiene**: Estructura HTML base, referencias a CSS y JavaScript
- **Función**: Punto de entrada de la aplicación

#### `app.js`
- **Propósito**: Archivo principal de JavaScript
- **Contiene**: Inicialización de la aplicación y configuración global
- **Función**: Carga y configura todos los componentes

#### `db.json`
- **Propósito**: Base de datos de la aplicación
- **Contiene**: Datos de contactos, países, regiones, ciudades, empresas y sucursales
- **Función**: Almacenamiento persistente de la información

### 📁 Carpeta Apis/

Cada API maneja las operaciones CRUD para su entidad correspondiente:

#### `contactApi.js`
- **Operaciones**: GET, POST, PATCH, DELETE para contactos
- **URL**: `http://localhost:3000/contacts`

#### `countryApi.js`
- **Operaciones**: GET, POST, PATCH, DELETE para países
- **URL**: `http://localhost:3000/countries`

#### `regionApi.js`
- **Operaciones**: GET, POST, PATCH, DELETE para regiones
- **URL**: `http://localhost:3000/regions`
- **Relación**: Conectada con países (CountryId)

#### `cityApi.js`
- **Operaciones**: GET, POST, PATCH, DELETE para ciudades
- **URL**: `http://localhost:3000/cities`
- **Relación**: Conectada con regiones (RegionId)

#### `companyApi.js`
- **Operaciones**: GET, POST, PATCH, DELETE para empresas
- **URL**: `http://localhost:3000/companies`

#### `branchApi.js`
- **Operaciones**: GET, POST, PATCH, DELETE para sucursales
- **URL**: `http://localhost:3000/branches`
- **Relaciones**: Conectada con ciudades (CityId) y empresas (CompanyId)

### 📁 Carpeta App/Components/

Cada módulo tiene la misma estructura de componentes:

#### Componentes de Contacto (`contacto/`)
- **`contactoComponent.js`**: Componente principal con pestañas
- **`regContacto.js`**: Formulario de registro y edición
- **`lstContacto.js`**: Lista de contactos con funcionalidad de edición
- **`contactoStyle.css`**: Estilos específicos del módulo

#### Componentes de Países (`countries/`)
- **`countryComponent.js`**: Componente principal con pestañas
- **`regCountry.js`**: Formulario de registro y edición
- **`lstCountry.js`**: Lista de países con botones de acción
- **`countryStyle.css`**: Estilos específicos del módulo

#### Componentes de Regiones (`regions/`)
- **`regionComponent.js`**: Componente principal con pestañas
- **`regRegion.js`**: Formulario de registro y edición
- **`lstRegion.js`**: Lista de regiones con relación a países
- **`regionStyle.css`**: Estilos específicos del módulo

#### Componentes de Ciudades (`cities/`)
- **`cityComponent.js`**: Componente principal con pestañas
- **`regCity.js`**: Formulario de registro y edición
- **`lstCity.js`**: Lista de ciudades con relación a regiones
- **`cityStyle.css`**: Estilos específicos del módulo

#### Componentes de Empresas (`companies/`)
- **`companyComponent.js`**: Componente principal con pestañas
- **`regCompany.js`**: Formulario de registro y edición
- **`lstCompany.js`**: Lista de empresas
- **`companyStyle.css`**: Estilos específicos del módulo

#### Componentes de Sucursales (`branches/`)
- **`branchComponent.js`**: Componente principal con pestañas
- **`regBranch.js`**: Formulario de registro y edición
- **`lstBranch.js`**: Lista de sucursales con relaciones
- **`branchStyle.css`**: Estilos específicos del módulo

#### Navegación (`navMenu/`)
- **`navMenu.js`**: Menú de navegación principal
- **`menuStyle.css`**: Estilos del menú de navegación

### 📁 Carpeta Models/

#### `contactModel.js`
- **Propósito**: Define la estructura de datos para contactos
- **Campos**: nombre, apellido, celular, email, residencia

#### `countryModel.js`
- **Propósito**: Define la estructura de datos para países
- **Campos**: nombre

## 🚀 Instrucciones de Instalación y Uso

### Requisitos Previos
- Node.js instalado en el sistema
- Navegador web moderno

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
2. **Abrir terminal en la carpeta del proyecto**
3. **Ejecutar el servidor JSON**:
   ```bash
   npx json-server --watch db.json --port 3000
   ```
4. **Abrir el archivo `index.html` en el navegador**

### Uso de la Aplicación

1. **Navegación**: Usar el menú superior para acceder a cada módulo
2. **Registro**: Hacer clic en "Nuevo" para crear registros
3. **Edición**: Hacer clic en "Editar" en la lista o seleccionar un elemento
4. **Eliminación**: Hacer clic en "Eliminar" en la lista
5. **Listado**: Ver todos los registros en las pestañas de lista

## 🔗 Relaciones del Sistema

- **Países** → **Regiones** (CountryId)
- **Regiones** → **Ciudades** (RegionId)
- **Ciudades** → **Empresas** (CityId)
- **Empresas** → **Sucursales** (CompanyId)
- **Ciudades** → **Sucursales** (CityId)

## 📝 Notas de Desarrollo

- El sistema utiliza Web Components para la modularidad
- Cada módulo es independiente pero sigue el mismo patrón
- Los estilos están basados en Bootstrap 5
- La base de datos se actualiza automáticamente con JSON Server
- El código está optimizado para ser simple y mantenible

---

# AUTOR

valentina mancilla 
