import { leerDiscos, eliminar, ObtenerValoresNuevos, editarDisco, IlistaDiscos, Disco } from "../models/BBDD.models.ts";
import { recuperarUsuarioActual } from "../utilities/functions-cookies.ts";
import { recuperarBbddLS } from "../utilities/functions-LocalStorage.ts";

export function crearGaleriaLista(listaDiscos:IlistaDiscos) {
  

  const el = document.querySelector("#Lista-Discos");
    if (!el){
      return;
    } 
    
    let galeriaDiscosGestionar=document.getElementById("Lista-Discos");

    if (!galeriaDiscosGestionar) {
      return
    } else {
      
      galeriaDiscosGestionar.innerHTML="";
      
      let galeria = document.getElementById("Lista-Discos");

      if (!galeria) {
        return
      } else {
      
      for (let i = 0; i < listaDiscos.length; i++) {
    
        let nuevoDisco=document.createElement("div")
        
        nuevoDisco.innerHTML=`<picture> 
        <img src="/assets/${listaDiscos[i].imagen}" alt="">
                              </picture>
                              <div>
                              <h2>Nombre: ${listaDiscos[i].nombre}</h2>
                              <p>Año: ${listaDiscos[i].anio}</p>
                                <h3>Precio: ${listaDiscos[i].precio.toFixed(2)}</h3>
                                </div>
                                <div>
                                <button id="BTN-editar-gestionar-${listaDiscos[i].id}">Editar</button>
                                <button id="BTN-eliminar-gestionar-${listaDiscos[i].id}">Eliminar</button>
                                </div>`;
                                
                                
                                galeria.appendChild(nuevoDisco);
                                
                                let BtnEditarDiscoGestionar=document.getElementById(`BTN-editar-gestionar-${listaDiscos[i].id}`);
                                let BtnEditar=document.querySelector("#Editar-Disco");   //==========================================Tal vez acá esté el problema de editar un disco u coje varios discos=========

                                if (!BtnEditarDiscoGestionar || !BtnEditar) {
                                  return
                                } else {
                                  
                                  BtnEditarDiscoGestionar.addEventListener("click", function () {
                                    datosEditarDiscos(listaDiscos[i]);
                                    
                                    BtnEditar.addEventListener("submit", function (event) {
                                      event.preventDefault();
                                      editarDisco(listaDiscos,i);
                                    })
                                  })
                                }
                                  
        let BtnEliminarDiscoGestionar=document.getElementById(`BTN-eliminar-gestionar-${listaDiscos[i].id}`);
        
        if (!BtnEliminarDiscoGestionar) {
          return
        } else {
          
          BtnEliminarDiscoGestionar.addEventListener("click", function () {
            const confirmEliminar=confirm(`Seguro quieres eliminar el disco ${listaDiscos[i].nombre}?`);
            
            if (confirmEliminar) {
              eliminar(listaDiscos, listaDiscos[i].id);
            }
            
          })
          
        }

      }

    }
      
      function datosEditarDiscos(DiscoParaEditar:Disco) {
        console.log("Hola desde el enviar datos al formulario para editar ");
        console.log(DiscoParaEditar);
        const formularioEditar=document.querySelector("#Editar-Disco");

        if (!formularioEditar) {
          return
        } else {
          const nombreEditarForm=formularioEditar.querySelector("#NombreEditar") as HTMLInputElement;
          const anioEditarForm=formularioEditar.querySelector("#AnioEditar") as HTMLInputElement;
          const imagenEditarForm=formularioEditar.querySelector("#ImagenEditar") as HTMLInputElement;
          const precioEditarForm=formularioEditar.querySelector("#PrecioEditar") as HTMLInputElement;
          
          if (!nombreEditarForm || !anioEditarForm || !imagenEditarForm || !precioEditarForm) {
            return
          } else {
            
            nombreEditarForm.value = DiscoParaEditar.nombre ?? "";
            anioEditarForm.value = DiscoParaEditar.anio !== undefined ? DiscoParaEditar.anio.toString() : "";
            imagenEditarForm.value=DiscoParaEditar.imagen ??"";
            precioEditarForm.value=DiscoParaEditar.precio.toString();
          }

        }
      }     
}

}
function EscuchaAgregarDisco() {
  const BtnAgregarDisco=document.getElementById("AgregarDisco");
  let agregar = document.getElementById("FormularioAgregar");

  if (!BtnAgregarDisco || !agregar) {
    return
  } else {
    
    BtnAgregarDisco.addEventListener("click", function (event) {
      event.preventDefault();
      agregar.classList.toggle("ocultar");
    })
  }
}

function identificarAdmin() {
  const usuarioActual=recuperarUsuarioActual();
  if (usuarioActual==null) {
    return
  } else {
    
  
  console.log(usuarioActual);
  const usuariosBBDD=recuperarBbddLS("BBDDusuario");
  const usuarioCompleto=usuariosBBDD.find((u:any) => u.name === usuarioActual);
  console.log(usuarioCompleto);
  let rol:string;

  if (usuarioCompleto==undefined || usuarioCompleto==null) {
    rol="";
    
  } else {
    rol=usuarioCompleto.rol;
  }
  console.log(rol);
  const errorAcceso=document.getElementById("pag-gestionar");
  const nameUsuario=document.getElementById("NameUsuario");

  if (!errorAcceso || !nameUsuario) {
    return
  } else {
    
    if(rol!=="administrador"){
      errorAcceso.style.width="70%";
      errorAcceso.style.margin="50px auto";
      errorAcceso.innerHTML="No permitido acceder sin usuario de administrador  -> ";  
      errorAcceso.style.fontSize="3rem";
      const enlace: HTMLAnchorElement = document.createElement('a');
      enlace.href = '/index.html';
      enlace.textContent = 'Ir al index';
      enlace.rel = 'noopener noreferrer';
      errorAcceso.appendChild(enlace);
    }else{
      nameUsuario.innerHTML=usuarioActual;
    }
  }
}
}



export function mainGestionar() {

    let listaDiscosDuplicado=leerDiscos();
    let ListaDiscosRecuperada=recuperarBbddLS("BBDD")|| listaDiscosDuplicado;
    crearGaleriaLista(ListaDiscosRecuperada);
    EscuchaAgregarDisco();
    ObtenerValoresNuevos();
    identificarAdmin()
}

