import { carritoUsuario } from "../models/carrito.model";


//============================Recupera la BBDD del LocalStorage=========================
export function recuperarBbddLS(clave:string) {
  const item = localStorage.getItem(clave);
  let BBDDRecuperado = item ? JSON.parse(item) : null;
  console.log("Dato recuperado de LS: ")
  console.log(BBDDRecuperado);
  return BBDDRecuperado;
}


//=========================Guarda la BBDD modificada en el LocalStorage=================
export function almacenarBbddLS(clave:string, valor:any) {
  
  localStorage.setItem(clave, JSON.stringify(valor));
  console.log("Dato guardado en localStorage:", clave);
}




//=============================GUARDAR Y RECUPERAR CARRITO DEL LOCAL STORAGE========================

export function guardarCarritoLS(carrito:any) {
console.log("Este es el carrito que enviamos: ")
console.log(carrito);
carritoUsuario(carrito);
localStorage.setItem("carrito", JSON.stringify(carrito));
const carritoStr = localStorage.getItem("carrito");
console.log(carritoStr ? JSON.parse(carritoStr) : null)
}

export function recuperarCarritoLS(key:string) {
  const carritoLocalStorage=localStorage.getItem(key);
  if (!carritoLocalStorage) {
    let carritoVacio:any=[];
    return carritoVacio
  } else {
    
    let carritoRecuperado=JSON.parse(carritoLocalStorage);
    return carritoRecuperado;
  }
}

export function eliminarDiscoCarrito(carritoAntesBorrar:any,id:number) {
  let nuevoCarrito=[];
  for (let i = 0; i < carritoAntesBorrar.length; i++) {
    if (carritoAntesBorrar[i].id != id) {
      nuevoCarrito.push(carritoAntesBorrar[i]);
    }
  }
  return nuevoCarrito;
}
