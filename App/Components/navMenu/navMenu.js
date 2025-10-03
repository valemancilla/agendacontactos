// Menú de navegación principal - Permite cambiar entre diferentes módulos
export class NavMenu extends HTMLElement{
    constructor(){
        super();
        
        // Crear el HTML del menú de navegación
        this.innerHTML = `
        <style>@import "./App/Components/navMenu/menuStyle.css";</style>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">Navbar</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link active" href="#" data-verocultar='["countries"]'>Países</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-verocultar='["regions"]'>Regiones</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-verocultar='["cities"]'>Ciudades</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-verocultar='["companies"]'>Empresas</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-verocultar='["branches"]'>Sucursales</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>`;
        
        // Configurar eventos de clic para cada enlace del menú
        let navigationLinks = this.querySelectorAll(".nav-link");
        for (let link of navigationLinks) {
            link.addEventListener("click", function(event) {
                // Obtener qué sección mostrar
                let sectionData = JSON.parse(event.target.dataset.verocultar);
                let sectionToShow = sectionData[0];
                
                // Encontrar el contenedor principal
                let mainContent = document.querySelector('#mainContent');
                
                // Definir qué componente mostrar para cada sección
                let sectionComponents = {
                    countries: '<country-component></country-component>',
                    regions: '<region-component></region-component>',
                    cities: '<city-component></city-component>',
                    companies: '<company-component></company-component>',
                    branches: '<branch-component></branch-component>'
                };
                
                // Mostrar el componente correspondiente
                if (sectionComponents[sectionToShow]) {
                    mainContent.innerHTML = sectionComponents[sectionToShow];
                }
                
                // Prevenir comportamiento por defecto del enlace
                event.stopImmediatePropagation();
                event.preventDefault();
            });
        }
    }
}
customElements.define("nav-menu",NavMenu);