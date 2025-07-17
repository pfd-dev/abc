import { guardarUsuarioActual } from "../utilities/functions-cookies.ts";
import { crearGaleriaLista } from "../controllers/galeria-gestionar-controller.ts";
import { usuarios } from "../mocks/usuarios.ts";
import { listaDiscos } from "../mocks/productos.ts";
import { carrito } from "../mocks/carrito.ts";
import { recuperarBbddLS, almacenarBbddLS } from "../utilities/functions-LocalStorage.ts";



export interface ICarrito {
  id: number,
  nombre: string,
  imagen: string,
  precio: number,
  cantidad: number
}

export type ICarritoItem = ICarrito[];

export interface Disco {
  id: number,
  nombre: string,
  anio: number,
  imagen: string,
  precio: number,
  cantidad?: number
}
export type IlistaDiscos = Disco[];

//==============Función leer discos de la BBDD=====================
export function leerDiscos(): IlistaDiscos {
  return listaDiscos;
}

//==============Función eliminar disco de la BBDD=====================
export function eliminar(listaDiscos: Disco[], id: number) {
  let temporal = [];
  console.log("Empieza eliminar")

  for (let i = 0; i < listaDiscos.length; i++) {

    if (listaDiscos[i].id != id) {
      let temporal2 = listaDiscos[i];
      temporal.push(temporal2);
    }
  }

  crearGaleriaLista(temporal);
  console.log("empieza el guardar galeria editada en LS")
  almacenarBbddLS("BBDD", temporal);
  return (temporal);

}

//=============Función agregar un disco nuevo a la BBDD===============
export function ObtenerValoresNuevos() {
  console.log("hola desde obtener valores");

  const formAgregarDisco = document.getElementById("FORM-AgregarDisco")

  if (formAgregarDisco == null) {



    //poner algo por si el formulario no existe



  } else {

    formAgregarDisco.addEventListener("submit", function (event) {
      event.preventDefault();

      let LocalStorage = [];
      LocalStorage = recuperarBbddLS("BBDD") || listaDiscos;
      let idNuevo = LocalStorage.length + 1;

      console.log(idNuevo);
      const nombreInput = document.getElementById("NombreNuevo") as HTMLInputElement | null;
      let nombre: string = nombreInput ? nombreInput.value : "";
      console.log(nombre);

      const anioInput = document.getElementById("AnioNuevo") as HTMLInputElement | null;
      let anio: number | string = anioInput ? anioInput.value : "";
      console.log(anio);

      const imagenInput = document.getElementById("ImagenNuevo") as HTMLInputElement | null;
      let imagen: string = imagenInput ? imagenInput.value : "";
      console.log(imagen);

      const precioInput = document.getElementById("PrecioNuevo") as HTMLInputElement | null;
      let precio: number | string = precioInput ? precioInput.value : "";
      console.log(precio);

      //=====================COMPROBAR QUE NO ESTÁ VACÍO EL NUEVO DISCO==========================
      if (!nombre) {
        alert("El nombre no puede estar vacío");
        return;
      }
      if (Number(anio) < 1900) {
        alert("El año no puede estar antes del año 1900");
        return;
      }
      if (Number(precio) < 0 || Number(precio) > 1000) {
        alert("El precio no puede ser menor a 0€ ni mayor a 1.000€");
        return;
      } else {

        //=======================COMPARAR SI YA EXISTE EN LA BBDD=================================
        const comparar = LocalStorage.find((t: any) => t.nombre === nombre);

        if (comparar) {

          alert("El disco ya existe en la base de datos")

        } else {
          let nuevoDisco = {
            id: idNuevo,
            nombre: nombre,
            anio: anio,
            imagen: imagen,
            precio: parseFloat(precio)
          };

          LocalStorage.push(nuevoDisco);
          almacenarBbddLS("BBDD", LocalStorage);
          crearGaleriaLista(LocalStorage);
          alert("Artículo agregado correctamente")
        }

      }

    })
  }

}

//===================Función editar disco en BBDD=====================
export function editarDisco(listaDiscos: Disco[], i: number) {
  console.log("hola desde el submit de editar");
  console.log(listaDiscos);

  const nombrePruebaInput = document.getElementById("NombreEditar") as HTMLInputElement | null;
  const nombrePrueba = nombrePruebaInput ? nombrePruebaInput.value : "";
  const anioPruebaInput = document.getElementById("AnioEditar") as HTMLInputElement | null;
  const anioPrueba = anioPruebaInput ? anioPruebaInput.value : "";         //=========================Probar que funciona corractamente con cualquier dato entrado============
  const imagenPruebaInput = document.getElementById("ImagenEditar") as HTMLInputElement | null;
  const imagenPrueba = imagenPruebaInput ? imagenPruebaInput.value : "";
  const precioPruebaInput = document.getElementById("PrecioEditar") as HTMLInputElement | null;
  const precioPrueba = precioPruebaInput ? precioPruebaInput.value : "";

  if (!nombrePrueba) {
    alert("El nombre no puede estar vacío");
    return;
  }

  if (Number(anioPrueba) < 1900) {
    alert("El año no puede estar antes del año 1900");
    return;
  }

  if (Number(precioPrueba) < 0 || Number(precioPrueba) > 1000) {
    alert("El precio no puede ser menor a 0€ ni mayor a 1.000€");
    return;
  }

  listaDiscos[i].nombre = nombrePrueba;
  listaDiscos[i].anio = Number(anioPrueba);
  listaDiscos[i].imagen = imagenPrueba;
  listaDiscos[i].precio = parseFloat(precioPrueba);

  console.log(listaDiscos);

  crearGaleriaLista(listaDiscos);
  console.log("empieza el guardar galeria con Disco unico editado en LS")
  almacenarBbddLS("BBDD", listaDiscos);
  alert("Artículo editado correctamente");
}

//===================Función leer usuarios============================
export function leerUsuarios() {
  let BBDDNew = recuperarBbddLS("BBDDusuario");
  if (!BBDDNew) {
    return usuarios;
  } else {
    return BBDDNew;
  }
}
//===================Función crear usuarios nuevos====================

export function agregarNuevoUsuario(userI: string, passwordI: string, nameI: string) {
  const newUser = {
    user: userI,
    password: passwordI,
    name: nameI,
    rol: "visitante",
    compra: []
  };

  let BBDDNew = recuperarBbddLS("BBDDusuario");
  BBDDNew.push(newUser);
  alert("Usuario creado");
  almacenarBbddLS("BBDDusuario", BBDDNew);
  almacenarBbddLS("usuarioActual", newUser.name);
}

//===================Función eliminar usuarios========================
export function eliminarUsuario(eliminar: string) {
  let BBDDNew = recuperarBbddLS("BBDDusuario");
  let newListaUsuarios = [];

  for (let i = 0; i < BBDDNew.length; i++) {
    if (BBDDNew[i].user != eliminar) {
      newListaUsuarios.push(BBDDNew[i]);
    };
  }

  alert("Usuario ha sido eliminado");
  almacenarBbddLS("BBDDusuario", newListaUsuarios);
  almacenarBbddLS("usuarioActual", []);

}

//===================Función editar usuarios==========================
export function editarUsuario(usuarioActual: string, userNew: string, passwordNew: string, nameNew: string) {
  const usuariosBBDD = leerUsuarios();

  for (let i = 0; i < usuariosBBDD.length; i++) {
    if (usuariosBBDD[i].name === usuarioActual) {
      usuariosBBDD[i].user = userNew;
      usuariosBBDD[i].password = passwordNew;
      usuariosBBDD[i].name = nameNew;
      break
    }
  }

  almacenarBbddLS("BBDDusuario", usuariosBBDD);
  guardarUsuarioActual(nameNew);
  alert("Datos actualizados");

}

//========================Devolver carrito==========================
export function leerCarrito() {
  return carrito
}

