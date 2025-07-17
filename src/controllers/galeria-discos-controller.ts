import { leerDiscos, ICarrito } from "../models/BBDD.models.ts";
import { usuarios } from "../mocks/usuarios.ts";
import store from "../store/store.ts";
import { carritoPerfilUsuario } from "../models/carrito.model.ts";
import { agregarAlCarrito, reducirCantidadRedux, aumentarCantidadRedux, eliminarDiscoRedux, vaciarCarritoRedux } from "../slices/carritoSlice.ts";
import { recuperarBbddLS, almacenarBbddLS, guardarCarritoLS, recuperarCarritoLS } from "../utilities/functions-LocalStorage.ts";
import { recuperarUsuarioActual, quitarCookieUsuario } from "../utilities/functions-cookies.ts";

export function iniciarPaginaHome() {

  let estilo = true;  //Estilo de vista si cuadrícula o lista
  let listaDiscos = leerDiscos();
  //debugger;
  const usuario = recuperarUsuarioActual();
  let bbdd = recuperarBbddLS("BBDD") || listaDiscos;
  almacenarBbddLS("BBDD", bbdd);
  cuentaItems(bbdd);
  let BBDDusuariosRecuperada = recuperarBbddLS("BBDDusuario") || usuarios;
  almacenarBbddLS("BBDDusuario", BBDDusuariosRecuperada);
  funcionPaginacion(bbdd, estilo);
  const openBtn = document.getElementById('Open-carrito');
  const ventanaCarrito = document.getElementById('Carrito-compra');
  const overlay = document.getElementById('Overlay');
  let carroRecuperado = (usuario && usuario.trim() !== "") ? carritoPerfilUsuario() : recuperarCarritoLS("carrito");
  if (Array.isArray(carroRecuperado) && carroRecuperado.length !== 0) {
    carritoPago(carroRecuperado);
  }


  store.subscribe(() => {
    console.log("paso suscribe")
    const state = store.getState();
    console.log('Estado actualizado del carrito:', state.carrito);
    //guardarCarritoLS(state);
  })




  //=============================GESTIÓN DE USUARIO=============================

  const nameUsuarioTag = document.getElementById("NameUsuario");
  const botonIniciarSesion = document.getElementById("BtnIniciar");
  const botonCerrarSesion = document.getElementById("BtnCerrar");
  const botonGestionar = document.getElementById("Btn-Gestionar");
  const botonDashboard = document.getElementById("Btn-Dashboard");

  if (nameUsuarioTag) {
    nameUsuarioTag.innerHTML = usuario ? usuario : "";
  };

  if (usuario && botonIniciarSesion && botonCerrarSesion && botonGestionar && botonDashboard) {

    if (!usuario) {
      botonCerrarSesion.classList.add("hidden");
      botonIniciarSesion.classList.remove("hidden");
      botonGestionar.classList.add("hidden");
      botonDashboard.classList.add("hidden");

    } else {
      botonIniciarSesion.classList.add("hidden");
      botonCerrarSesion.classList.remove("hidden");
      botonGestionar.classList.remove("hidden");
      botonDashboard.classList.remove("hidden");
      botonCerrarSesion.addEventListener("click", function () {
        CerrarSesion(usuario);
      })
    }
  }

  function CerrarSesion(usuario: any) {
    console.log("se está ejecutando el cerrar")
    quitarCookieUsuario()
    store.dispatch(vaciarCarritoRedux())
    if (nameUsuarioTag) {
      nameUsuarioTag.innerHTML = usuario ? usuario : "";
    }
    location.reload();
  }


  //============================CREACIÓN DE GALERIA=============================

  const BtnCuadricula = document.getElementById("Cuadricula");
  const GaleriaDiscosMostrar = document.getElementById("Gallery");
  const BtnLista = document.getElementById("Lista");

  if (!BtnCuadricula || !GaleriaDiscosMostrar) {
    return
  } else {
    BtnCuadricula.addEventListener("click", function () {


      GaleriaDiscosMostrar.classList.remove("lista-discos");
      GaleriaDiscosMostrar.classList.add("gallery");
      estilo = true;
      console.log("este es el estilo: " + estilo);
      bbdd = recuperarBbddLS("BBDD") || listaDiscos;
      funcionPaginacion(bbdd, estilo);

    }
    );
  }

  if (!BtnLista || !GaleriaDiscosMostrar) {
    return
  } else {

    BtnLista.addEventListener("click", function () {

      GaleriaDiscosMostrar.classList.remove("gallery");
      GaleriaDiscosMostrar.classList.add("lista-discos");
      estilo = false;
      console.log("este es el estilo: " + estilo);
      bbdd = recuperarBbddLS("BBDD") || listaDiscos;
      funcionPaginacion(bbdd, estilo);

    }
    );
  }


  //=============================ESCUCHAS DE MOSTRAR CARRITO========================

  if (!openBtn || !ventanaCarrito || !overlay) {
    return
  } else {

    openBtn.addEventListener('click', () => {
      console.log("Desde el click boton carrito")
      ventanaCarrito.classList.add('active');
      overlay.classList.add('active');
    });

  };

  // Cerrar el menú al hacer click fuera
  overlay.addEventListener('click', () => {
    ventanaCarrito.classList.remove('active');
    overlay.classList.remove('active');
  });


  //=============================ESCUCHA DE VACIAR CARRITO========================

  const BtnVaciarCarrito = document.getElementById("BTN-vaciar-carrito");

  if (!BtnVaciarCarrito) {
    return
  } else {

    BtnVaciarCarrito.addEventListener("click", () => {
      console.log("paso 1 de vaciar carrito: ")
      store.dispatch(vaciarCarritoRedux());
      console.log("Esto es después del dispatch: ")
      console.log(store.getState().carrito);
      console.table(store.getState().carrito);
      BtnTotalCarrito(null);
    });

  }
  //=============================PAGAR CARRITO========================

  const BtnPagarCarrito = document.getElementById("BTN-pagar");

  if (!BtnPagarCarrito) {
    return
  } else {

    BtnPagarCarrito.addEventListener("click", pagarCarrito);

  }


  //===================================ORDENAR GALERIA==============================

  const BtnOrdenarGaleriaDiscos = document.getElementById("OrdenarGaleria");

  if (!BtnOrdenarGaleriaDiscos) {
    return
  } else {

    BtnOrdenarGaleriaDiscos.addEventListener("submit", (event) => {
      event.preventDefault();
      //console.log("esto es en el evento de ordenar")
      bbdd = recuperarBbddLS("BBDD") || listaDiscos;
      console.log(bbdd);
      console.log(estilo);
      ordenarLista(bbdd, estilo);
    });

  }

}

function agregarEscuchas(disco: ICarrito) {
  const id = disco.id;
  const idTexto = id.toString();
  const BtnAgregarAlCarrito = document.getElementById(idTexto);

  if (!BtnAgregarAlCarrito) {
    return;
  } else {
    BtnAgregarAlCarrito.addEventListener("click", function () {
      //debugger;
      //console.log("paso 1- este es el disco: ")
      //console.log(disco)
      //console.log(store.getState().carrito)
      store.dispatch(agregarAlCarrito(disco));
      //console.log("Esto es después del dispatch: ")
      //console.log(store.getState().carrito);
      //console.table(store.getState().carrito);
    });
  }
}


//=================================Pagar el carrito======================================
export function pagarCarrito() {
  let total = totalPrecioCarrito(recuperarCarritoLS("carrito"));
  const usuarioSesion = recuperarUsuarioActual();
  let confirmaciónPagoCarrito = document.getElementById("Carrito-compra") as HTMLElement;
  let contenidoCarritoOriginal = confirmaciónPagoCarrito.innerHTML;
  confirmaciónPagoCarrito.classList.add("pagado");
  confirmaciónPagoCarrito.innerHTML = `
    <h2 style="margin: 2rem">Pedido confirmado!🎉</h2>
    <p style="margin: 2rem;font-size: 1.2rem">Gracias por tu pedido ${usuarioSesion}🫶, tu pedido se está procesando y te
    lo enviaremos de inmediato🚀.</p>
    <h3 style="margin: 2rem">Total pagado: ${total}€</h3>
    <button id="btn-terminado" style="margin: 2rem; width: 8rem; font-size: 1.2rem; border-radius: 10px; background-color: var(--colorAmarillo);">Terminar compra</button>
    `
  const btnTerminarCompra = document.getElementById("btn-terminado");
  if (btnTerminarCompra) {
    btnTerminarCompra.addEventListener("click", () => {
      confirmaciónPagoCarrito.innerHTML = contenidoCarritoOriginal;
      BtnTotalCarrito(null);
      location.reload();

      const BtnVaciarCarrito = document.getElementById("BTN-vaciar-carrito");
      if (!BtnVaciarCarrito) {
        return
      } else {
        BtnVaciarCarrito.addEventListener("click", () => {
          store.dispatch(vaciarCarritoRedux());
        });
      }
      const BtnPagarCarrito = document.getElementById("BTN-pagar");
      if (!BtnPagarCarrito) {
        return
      } else {
        BtnPagarCarrito.addEventListener("click", pagarCarrito);
      }
      store.dispatch(vaciarCarritoRedux());
    })
  }
}

//=========================Indica la cantidad de items en la galería========================
export function cuentaItems(lista: any) {
  const cantidadDiscos = document.getElementById("CantidadItems");
  const total = lista.length;

  if (!cantidadDiscos) {
    return
  } else {

    cantidadDiscos.innerText = `Total de discos: ${total}`

  }
}


//=====================Ordenación de la lista por precio o por año=============================
export function ordenarLista(lista: any, estilo: boolean) {

  console.log("Esto es dentro de la función ordenar")
  console.log(lista);
  console.log(estilo);

  let ordenValor = document.querySelector("[name='Select']") as HTMLInputElement | null;

  if (!ordenValor) {
    return
  } else {

    const orden = parseInt(ordenValor.value);
    let ordenTemporal = [];
    console.log(orden);
    console.table(lista);

    switch (orden) {
      case 1:
        ordenTemporal = [];
        const longitudArrayTemporal1 = lista.length;
        for (let j = 0; j < longitudArrayTemporal1; j++) {
          let indiceMinimo = 0;

          for (let i = 1; i < lista.length; i++) {

            if (lista[i].anio <= lista[indiceMinimo].anio) {
              indiceMinimo = i;
            }
          }

          ordenTemporal[j] = lista[indiceMinimo];
          lista.splice(indiceMinimo, 1);

        }

        console.log("Empieza el orden 1");
        console.table(ordenTemporal);
        almacenarBbddLS("BBDD", ordenTemporal);
        funcionPaginacion(ordenTemporal, estilo);
        break;

      case 2:
        ordenTemporal = [];
        const longitudArrayTemporal2 = lista.length;
        for (let j = 0; j < longitudArrayTemporal2; j++) {
          let indiceMinimo = 0;

          for (let i = 1; i < lista.length; i++) {

            if (lista[i].anio >= lista[indiceMinimo].anio) {
              indiceMinimo = i;
            }
          }

          ordenTemporal[j] = lista[indiceMinimo];
          lista.splice(indiceMinimo, 1);

        }

        console.log("Empieza el orden 2");
        console.table(ordenTemporal);
        almacenarBbddLS("BBDD", ordenTemporal);
        funcionPaginacion(ordenTemporal, estilo);
        break;

      case 3:
        ordenTemporal = [];
        const longitudArrayTemporal3 = lista.length;
        for (let j = 0; j < longitudArrayTemporal3; j++) {
          let indiceMinimo = 0;

          for (let i = 1; i < lista.length; i++) {

            if (lista[i].precio <= lista[indiceMinimo].precio) {
              indiceMinimo = i;
            }
          }

          ordenTemporal[j] = lista[indiceMinimo];
          lista.splice(indiceMinimo, 1);

        }

        console.log("Empieza el orden 3");
        console.table(ordenTemporal);
        almacenarBbddLS("BBDD", ordenTemporal);
        funcionPaginacion(ordenTemporal, estilo);
        break;

      case 4:
        ordenTemporal = [];
        const longitudArrayTemporal4 = lista.length;
        for (let j = 0; j < longitudArrayTemporal4; j++) {
          let indiceMinimo = 0;

          for (let i = 1; i < lista.length; i++) {

            if (lista[i].precio >= lista[indiceMinimo].precio) {
              indiceMinimo = i;
            }
          }

          ordenTemporal[j] = lista[indiceMinimo];
          lista.splice(indiceMinimo, 1);

        }

        console.log("Empieza el orden 4");
        console.table(ordenTemporal);
        almacenarBbddLS("BBDD", ordenTemporal);
        funcionPaginacion(ordenTemporal, estilo);
        break;

      default:
        alert("Error en el orden");

        break;
    }
  }

}

//=================Con el orden modificado se crea la galería en lista o en cuadrícula=====================

export function crearGaleria(listaDiscos: any) {
  console.log("Empieza crear galeria")
  let Gallery = document.getElementById("Gallery") as HTMLElement;
  Gallery.innerHTML = "";
  let galeria = document.getElementById("Gallery");

  for (let i = 0; i < listaDiscos.length; i++) {
    let nuevoDisco = document.createElement("div")

    nuevoDisco.innerHTML = `<picture> 
                                <img src="/assets/${listaDiscos[i].imagen}" alt="">
                              </picture>
                              <div>
                                <h2>${listaDiscos[i].nombre}</h2>
                                <p>${listaDiscos[i].anio}</p>
                                <h3>Precio: €${listaDiscos[i].precio.toFixed(2)}</h3>
                                <button id="${listaDiscos[i].id}">🛒 Añadir al carrito</button>
                              </div>`;



    if (!galeria) {
      return
    } else {

      galeria.appendChild(nuevoDisco);
    }

    agregarEscuchas(listaDiscos[i]);

  }
}

export function crearGaleriaVertical(listaDiscos: any) {
  const Gallery = document.getElementById("Gallery") as HTMLElement;
  Gallery.innerHTML = "";
  let galeria = document.getElementById("Gallery");

  for (let i = 0; i < listaDiscos.length; i++) {

    let nuevoDisco = document.createElement("div");

    nuevoDisco.innerHTML = `<picture> 
                              <img src="/assets/${listaDiscos[i].imagen}" alt="">
                            </picture>
                            <div>
                              <div>
                                <h2>Nombre: ${listaDiscos[i].nombre}</h2>
                                <p>Año: ${listaDiscos[i].anio}</p>
                                <h3>Precio: €${listaDiscos[i].precio.toFixed(2)}</h3>
                              </div>
                              <div>
                                <button id="${listaDiscos[i].id}">🛒 Añadir al carrito</button>
                              </div>
                            </div>`;

    if (!galeria) {
      return
    } else {

      galeria.appendChild(nuevoDisco);
    }

    agregarEscuchas(listaDiscos[i]);
  }
}



//=============================Función de paginación==================================
export function funcionPaginacion(bbdd: any[], estilo: boolean) {
  let paginaActual = 1;
  const cantidadDiscosMostrar = 15;

  let paginasTotales = Math.ceil(bbdd.length / cantidadDiscosMostrar);
  let arraySeparado = separarbbdd(bbdd, paginasTotales, cantidadDiscosMostrar);

  paginacionPaginaActual(paginaActual, paginasTotales);

  ordenMostrar(arraySeparado[paginaActual - 1], estilo);



  let btnAnteriorOriginal = document.getElementById("BTN-anterior");
  let btnSiguienteOriginal = document.getElementById("BTN-siguiente");

  if (!btnAnteriorOriginal || !btnSiguienteOriginal) {
    return
  } else {

    let btnAnterior = btnAnteriorOriginal.cloneNode(true) as HTMLButtonElement;
    let btnSiguiente = btnSiguienteOriginal.cloneNode(true) as HTMLButtonElement;

    btnAnteriorOriginal.replaceWith(btnAnterior);
    btnSiguienteOriginal.replaceWith(btnSiguiente);

    const btnAnterior2 = document.getElementById("BTN-anterior") as HTMLButtonElement;
    if (!btnAnterior2) {
      return
    } else {
      btnAnterior = btnAnterior2;
      habilitarBTNAnterior(btnAnterior, paginaActual)
      btnAnterior.addEventListener("click", () => {
        paginaActual--;
        habilitarBTNSiguiente(btnSiguiente, paginaActual, paginasTotales)
        habilitarBTNAnterior(btnAnterior, paginaActual)
        ordenMostrar(arraySeparado[paginaActual - 1], estilo);
        paginacionPaginaActual(paginaActual, paginasTotales)
        console.log("Dentro del click de pagina anterior: " + paginaActual)
      })
    }

    const btnSiguiente2 = document.getElementById("BTN-siguiente") as HTMLButtonElement;
    if (!btnSiguiente2) {
      return
    } else {

      btnSiguiente = btnSiguiente2;
      habilitarBTNSiguiente(btnSiguiente, paginaActual, paginasTotales)
      btnSiguiente.addEventListener("click", () => {
        paginaActual++;
        habilitarBTNAnterior(btnAnterior);
        habilitarBTNSiguiente(btnSiguiente, paginaActual, paginasTotales)
        ordenMostrar(arraySeparado[paginaActual - 1], estilo);
        paginacionPaginaActual(paginaActual, paginasTotales)
        console.log("Dentro del click de pagina siguiente: " + paginaActual)
      })
    }
  }
}

function habilitarBTNAnterior(btnAnterior: HTMLButtonElement, paginaActual?: number) {
  btnAnterior.disabled = paginaActual === 1;
}

function habilitarBTNSiguiente(btnSiguiente: HTMLButtonElement, paginaActual: number, paginasTotales: number) {
  btnSiguiente.disabled = paginaActual === paginasTotales;
}

function paginacionPaginaActual(paginaActual: number, paginasTotales: number) {
  let paginasCantidad = document.getElementById("Paginacion");

  if (!paginasCantidad) {
    return
  } else {
    paginasCantidad.innerText = `Pagina ${paginaActual} de ${paginasTotales}`
  }
}

export function separarbbdd(bbdd: any[], paginasTotalesSeparar: number, cantidadDiscosPagina: number) {

  let arrayPaginado: any = [];
  let z = 0;
  let largoDeBbdd = bbdd.length;

  for (let i = 0; i < paginasTotalesSeparar; i++) {

    arrayPaginado[i] = [];

    for (let j = 0; j < cantidadDiscosPagina; j++) {

      arrayPaginado[i][j] = bbdd[z];
      z++;
      largoDeBbdd--;

      if (largoDeBbdd == 0) {
        break
      }

    }

    if (largoDeBbdd == 0) {
      break
    }

  }

  console.log(arrayPaginado);

  return (arrayPaginado);

}

function ordenMostrar(arraySeparado: any, estilo: boolean) {

  console.log(arraySeparado);

  if (estilo) {
    console.log("dentro del if galeria cuadricula")
    crearGaleria(arraySeparado);
  } else {
    console.log("dentro del if galeria lista")
    crearGaleriaVertical(arraySeparado);
  }
}

//=======================CREACIÓN DE LISTA DE CARRITO DE COMPRAS======================

export function carritoPago(carrito: any) {

  if (!carrito) {
    return
  } else {


    let carritoTemporal = document.getElementById("Lista-carrito");
    let total = 0;

    if (!carritoTemporal) {
      return
    } else {
      carritoTemporal.innerHTML = "";
    }

    for (let i = 0; i < carrito.length; i++) {

      let nuevoElementoCarrito = document.createElement("div");

      nuevoElementoCarrito.classList.add("nuevoDiscoCarrito")

      nuevoElementoCarrito.innerHTML = `<picture>
                                                 <img src="/assets/${carrito[i].imagen}" alt="">
                                              </picture>
                                              <div>
                                                <h4>${carrito[i].nombre}</h4>
                                                <div class="btns-cantidad"><button data-id="menosCant-${carrito[i].id}">-</button><p>${carrito[i].cantidad}</p><button data-id="masCant-${carrito[i].id}">+</button></div>
                                                <div>
                                                    <button data-id="borrar-${carrito[i].id}"><span class="material-symbols-outlined">
                                                    delete
                                                    </span></button>
                                                    <p>€${carrito[i].precio.toFixed(2)}</p>
                                                </div>
                                              </div>`;
      carritoTemporal.appendChild(nuevoElementoCarrito);
      const data = (`borrar-${carrito[i].id}`);
      const BtnDataId = document.querySelector(`[data-id=${data}]`);

      if (!BtnDataId) {
        return
      } else {

        BtnDataId.addEventListener("click", function () {

          preguntarSiEliminar(carrito[i].nombre, carrito[i].id)

        })
      }

      const dataCantidadMenos = (`menosCant-${carrito[i].id}`);
      const BtnDataIdMenos = document.querySelector(`[data-id=${dataCantidadMenos}]`);

      if (!BtnDataIdMenos) {
        return
      } else {

        BtnDataIdMenos.addEventListener("click", function () {

          if (carrito[i].cantidad == 1) {

            preguntarSiEliminar(carrito[i].nombre, carrito[i].id)

          } else {
            //console.log("paso 1 reducir")
            store.dispatch(reducirCantidadRedux(carrito[i]));
            //console.log("Esto es después del dispatch: ")
            //console.log(store.getState().carrito);
            //console.table(store.getState().carrito);

          }

        })
      }

      const dataCantidadMas = (`masCant-${carrito[i].id}`);
      const BtnDataIdMas = document.querySelector(`[data-id=${dataCantidadMas}]`);

      if (!BtnDataIdMas) {
        return
      } else {

        BtnDataIdMas.addEventListener("click", function () {
          //console.log("paso 1 aumentar");
          store.dispatch(aumentarCantidadRedux(carrito[i]));
          //console.log("Esto es después del dispatch: ")
          //console.log(store.getState().carrito);
          //console.table(store.getState().carrito);
        })

        total = totalPrecioCarrito(carrito);
      }

    }

    const totalArticulosCarrito = document.getElementById("TotalArticulosCarrito");
    const sumaCarrito = document.getElementById("sumaCarrito");
    let cantCarritoUnidades = 0;

    if (!totalArticulosCarrito || !sumaCarrito) {
      return
    } else {

      if (carrito.length == 0) {

        totalArticulosCarrito.style.display = "none";
        carritoTemporal.innerHTML = "<h2 class=vacio>El carrito está vacío</h2>";
      } else {
        totalArticulosCarrito.style.display = "flex";
        console.log(carrito);
        carrito.forEach((element: ICarrito) => {
          cantCarritoUnidades = cantCarritoUnidades + (element.cantidad ?? 0);   //=======================OJO, REVISAR SI HAY PROBLEMAS CON EL CARRITO==========
          BtnTotalCarrito(cantCarritoUnidades);
        });
        sumaCarrito.innerHTML = cantCarritoUnidades.toString();
      }

      guardarCarritoLS(carrito);
      let totalCarrito = document.getElementById("Total");

      if (!totalCarrito) {
        return
      } else {
        totalCarrito.innerText = "€" + total.toFixed(2);
      }
    }
  }
}


export function BtnTotalCarrito(cantCarritoUnidades: number | null) {
  const BtncantCarrito = document.getElementById("Cant-carrito-btn");

  if (!BtncantCarrito) {
    return
  } else {
    BtncantCarrito.innerHTML = (cantCarritoUnidades ?? 0).toString();
  }
}

//=====================Pregunta si quiere eliminar del carrito======================
function preguntarSiEliminar(nombreDisco: string, carritoId: number) {

  if (confirm(`Deseas eliminar del carrito el disco: ${nombreDisco}?`)) {
    //console.log("paso 1 eliminar")
    store.dispatch(eliminarDiscoRedux(carritoId));
    //console.log("Esto es después del dispatch: ")
    //console.log(store.getState().carrito);
    //console.table(store.getState().carrito);
  }
}


//==============================Total precio carrito============================
function totalPrecioCarrito(carrito: any) {
  let valorTotal = 0;
  console.log(carrito);
  for (let i = 0; i < carrito.length; i++) {
    valorTotal = valorTotal + carrito[i].cantidad * carrito[i].precio;
  }
  return valorTotal;
}


