export class NavMenu extends HTMLElement{
    constructor(){
        super();
        this.render();
    }
    render(){
        this.innerHTML = /* html */ `
        <style rel="stylesheet">
          @import "./App/Components/navMenu/menuStyle.css";
        </style>
          <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
              <a class="navbar-brand" href="#">Navbar</a>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#" data-verocultar='["countries"]'>Países</a>
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
          </nav>        
        `;
        this.querySelectorAll(".nav-link").forEach((val, id) => {
          val.addEventListener("click", (e)=>{
              let data = JSON.parse(e.target.dataset.verocultar);
              let mainContent = document.querySelector('#mainContent');
              mainContent.innerHTML= "";
              switch (data[0]){
                case 'countries':
                  mainContent.innerHTML="<country-component></country-component>";
                  break;
                case 'regions':
                  mainContent.innerHTML="<region-component></region-component>";
                  break;
                case 'cities':
                  mainContent.innerHTML="<city-component></city-component>";
                  break;
                case 'companies':
                  mainContent.innerHTML="<company-component></company-component>";
                  break;
                case 'branches':
                  mainContent.innerHTML="<branch-component></branch-component>";
                  break;
              }
              e.stopImmediatePropagation();
              e.preventDefault();
          })
      });
    }
}
customElements.define("nav-menu",NavMenu);