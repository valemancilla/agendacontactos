# 📋 Sistema de Gestión de Entidades Empresariales

## 📖 Descripción del Proyecto

Este es un sistema completo de gestión empresarial que permite administrar de manera organizada países, regiones, ciudades, empresas y sucursales. La aplicación está construida como una Single Page Application (SPA) utilizando tecnologías web modernas y Web Components para proporcionar una experiencia de usuario fluida e intuitiva.

El sistema está diseñado para manejar relaciones jerárquicas entre diferentes entidades geográficas y empresariales, permitiendo una organización estructurada y eficiente de la información corporativa.

## ⭐ Características Destacadas

- **🎯 CRUD Completo**: Operaciones de Crear, Leer, Actualizar y Eliminar para todas las entidades
- **🔄 Interfaz Unificada**: Diseño consistente y modular en todos los módulos
- **📱 Responsive**: Interfaz adaptable a diferentes tamaños de pantalla con Bootstrap 5
- **⚡ Navegación Fluida**: Sistema de pestañas para alternar entre registro y listado
- **🔗 Relaciones Estructuradas**: Conexiones lógicas entre países, regiones, ciudades, empresas y sucursales
- **💾 Persistencia Local**: Base de datos JSON con JSON Server para desarrollo
- **🎨 UI Moderna**: Interfaz basada en Bootstrap 5 con componentes personalizados
- **✅ Validaciones**: Campos obligatorios con validación en tiempo real
- **🆔 IDs Automáticos**: Generación automática de identificadores únicos
- **📝 Código Documentado**: Comentarios explicativos en todo el código
- **🔧 Código Simplificado**: Lenguaje básico y fácil de entender

## 🎯 Objetivo

Crear una aplicación web que permita:

- **Organizar datos geográficos** de manera jerárquica (Países → Regiones → Ciudades)
- **Administrar empresas** y sus respectivas sucursales
- **Mantener relaciones** entre todas las entidades del sistema
- **Proporcionar una experiencia** de usuario simple, intuitiva y eficiente
- **Facilitar el mantenimiento** del código con documentación clara
- **Garantizar la persistencia** de datos con validaciones robustas

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica y accesible de la aplicación
- **CSS3**: Estilos personalizados y diseño responsive
- **JavaScript ES6+**: Lógica de la aplicación con módulos, async/await y Web Components
- **Bootstrap 5**: Framework CSS para componentes UI y diseño responsive
- **Web Components**: Elementos HTML personalizados para modularidad

### Backend
- **JSON Server**: Servidor de desarrollo para API REST
- **JSON**: Base de datos en formato JSON para persistencia de datos

### Herramientas de Desarrollo
- **Node.js**: Runtime de JavaScript
- **NPX**: Ejecutor de paquetes de Node.js
- **Git**: Control de versiones

## 📁 Estructura del Sistema

```
agendacontactos/
├── 📁 Apis/                          # APIs para comunicación con servidor
│   ├── 📁 branch/                    # API de sucursales
│   │   └── 📄 branchApi.js           # Operaciones CRUD de sucursales
│   ├── 📁 city/                      # API de ciudades
│   │   └── 📄 cityApi.js             # Operaciones CRUD de ciudades
│   ├── 📁 company/                   # API de empresas
│   │   └── 📄 companyApi.js          # Operaciones CRUD de empresas
│   ├── 📁 country/                   # API de países
│   │   └── 📄 countryApi.js          # Operaciones CRUD de países
│   └── 📁 region/                    # API de regiones
│       └── 📄 regionApi.js           # Operaciones CRUD de regiones
├── 📁 App/                           # Componentes principales
│   └── 📁 Components/                # Componentes de la aplicación
│       ├── 📁 branches/              # Componentes de sucursales
│       │   ├── 📄 brancComponent.js  # Componente principal
│       │   ├── 📄 lstBranch.js       # Lista de sucursales
│       │   ├── 📄 regBranch.js       # Formulario de registro
│       │   └── 📄 branchStyle.css    # Estilos del módulo
│       ├── 📁 cities/                # Componentes de ciudades
│       │   ├── 📄 cityComponent.js   # Componente principal
│       │   ├── 📄 lstCity.js         # Lista de ciudades
│       │   ├── 📄 regCity.js         # Formulario de registro
│       │   └── 📄 cityStyle.css      # Estilos del módulo
│       ├── 📁 companies/             # Componentes de empresas
│       │   ├── 📄 companyComponent.js # Componente principal
│       │   ├── 📄 lstCompany.js      # Lista de empresas
│       │   ├── 📄 regCompany.js      # Formulario de registro
│       │   └── 📄 companyStyle.css   # Estilos del módulo
│       ├── 📁 countries/             # Componentes de países
│       │   ├── 📄 countryComponent.js # Componente principal
│       │   ├── 📄 lstCountry.js      # Lista de países
│       │   ├── 📄 regCountry.js      # Formulario de registro
│       │   └── 📄 countryStyle.css   # Estilos del módulo
│       ├── 📁 navMenu/               # Menú de navegación
│       │   ├── 📄 navMenu.js         # Componente del menú
│       │   └── 📄 menuStyle.css      # Estilos del menú
│       └── 📁 regions/               # Componentes de regiones
│           ├── 📄 regionComponent.js # Componente principal
│           ├── 📄 lstRegion.js       # Lista de regiones
│           ├── 📄 regRegion.js       # Formulario de registro
│           └── 📄 regionStyle.css    # Estilos del módulo
├── 📁 css/                           # Estilos CSS
│   └── 📁 bootstrap/                 # Archivos de Bootstrap 5
├── 📁 js/                            # Scripts JavaScript
│   └── 📁 bootstrap/                 # Archivos JavaScript de Bootstrap
├── 📁 Models/                        # Modelos de datos
│   └── 📄 countryModel.js            # Modelo de datos para países
├── 📄 app.js                         # Archivo principal de la aplicación
├── 📄 db.json                        # Base de datos JSON
├── 📄 index.html                     # Página principal
└── 📄 README.md                      # Documentación del proyecto
```

## 📋 ¿Qué hace cada archivo?

### 📄 Archivos Principales

#### `index.html`
- **Propósito**: Página principal de la aplicación
- **Contiene**: Estructura HTML base, referencias a CSS y JavaScript
- **Función**: Punto de entrada de la aplicación, carga Bootstrap y el módulo principal
- **Características**: Diseño responsive, meta tags para viewport, carga de módulos ES6

#### `app.js`
- **Propósito**: Archivo principal de JavaScript con funciones globales
- **Contiene**: 
  - Clase `IdManager` para generación automática de IDs
  - Funciones auxiliares globales (`ctrlBtn`, `resetIdView`, `viewData`, etc.)
  - Sistema de navegación entre pestañas
  - Importación de todos los componentes
- **Función**: Configuración global y utilidades compartidas

#### `db.json`
- **Propósito**: Base de datos de la aplicación
- **Contiene**: Arrays para países, regiones, ciudades, empresas y sucursales
- **Función**: Almacenamiento persistente de la información
- **Estructura**: Formato JSON con arrays vacíos inicialmente

### 📁 Carpeta Apis/

Cada API maneja las operaciones CRUD para su entidad correspondiente con URLs actualizadas:

#### `countryApi.js`
- **Operaciones**: GET, POST, PATCH, DELETE para países
- **URL**: `http://localhost:3001/countries`
- **Funciones**: `getCountries()`, `postCountries()`, `patchCountries()`, `deleteCountries()`
- **Características**: Generación automática de IDs, manejo de errores

#### `regionApi.js`
- **Operaciones**: GET, POST, PATCH, DELETE para regiones
- **URL**: `http://localhost:3001/regions`
- **Relación**: Conectada con países (CountryId)
- **Funciones**: `getRegions()`, `postRegions()`, `patchRegions()`, `deleteRegions()`

#### `cityApi.js`
- **Operaciones**: GET, POST, PATCH, DELETE para ciudades
- **URL**: `http://localhost:3001/cities`
- **Relación**: Conectada con regiones (RegionId)
- **Funciones**: `getCities()`, `postCities()`, `patchCities()`, `deleteCities()`

#### `companyApi.js`
- **Operaciones**: GET, POST, PATCH, DELETE para empresas
- **URL**: `http://localhost:3001/companies`
- **Funciones**: `getCompanies()`, `postCompanies()`, `patchCompanies()`, `deleteCompanies()`
- **Campos**: nombre, UKNiu, dirección, email, país

#### `branchApi.js`
- **Operaciones**: GET, POST, PATCH, DELETE para sucursales
- **URL**: `http://localhost:3001/branches`
- **Relaciones**: Conectada con países (CountryId) y empresas (CompanyId)
- **Funciones**: `getBranches()`, `postBranches()`, `patchBranches()`, `deleteBranches()`
- **Campos**: número comercial, contacto, dirección, teléfono, email, país, empresa

### 📁 Carpeta App/Components/

Cada módulo sigue la misma estructura de componentes con funcionalidades específicas:

#### Componentes de Países (`countries/`)
- **`countryComponent.js`**: Componente principal con sistema de pestañas
- **`regCountry.js`**: Formulario de registro y edición con validaciones
- **`lstCountry.js`**: Lista de países con botones de acción (editar, eliminar)
- **`countryStyle.css`**: Estilos específicos del módulo

#### Componentes de Regiones (`regions/`)
- **`regionComponent.js`**: Componente principal con sistema de pestañas
- **`regRegion.js`**: Formulario con selector de países y validaciones
- **`lstRegion.js`**: Lista de regiones mostrando país asociado
- **`regionStyle.css`**: Estilos específicos del módulo

#### Componentes de Ciudades (`cities/`)
- **`cityComponent.js`**: Componente principal con sistema de pestañas
- **`regCity.js`**: Formulario con selector de regiones y validaciones
- **`lstCity.js`**: Lista de ciudades mostrando región asociada
- **`cityStyle.css`**: Estilos específicos del módulo

#### Componentes de Empresas (`companies/`)
- **`companyComponent.js`**: Componente principal con sistema de pestañas
- **`regCompany.js`**: Formulario completo con selector de países y validaciones
- **`lstCompany.js`**: Lista de empresas con información completa
- **`companyStyle.css`**: Estilos específicos del módulo

#### Componentes de Sucursales (`branches/`)
- **`branchComponent.js`**: Componente principal con sistema de pestañas
- **`regBranch.js`**: Formulario con selectores de país y empresa
- **`lstBranch.js`**: Lista de sucursales con relaciones mostradas
- **`branchStyle.css`**: Estilos específicos del módulo

#### Navegación (`navMenu/`)
- **`navMenu.js`**: Menú de navegación principal con enlaces a todos los módulos
- **`menuStyle.css`**: Estilos del menú de navegación responsive

### 📁 Carpetas de Estilos y Scripts

#### `css/bootstrap/`
- **Contiene**: Archivos CSS de Bootstrap 5
- **Función**: Framework de estilos para diseño responsive

#### `js/bootstrap/`
- **Contiene**: Archivos JavaScript de Bootstrap 5
- **Función**: Funcionalidades interactivas de Bootstrap

#### `Models/`
- **`countryModel.js`**: Modelo de datos para países
- **Función**: Definición de estructura de datos



# 👨‍💻 AUTOR

**Valentina Mancilla**



---

