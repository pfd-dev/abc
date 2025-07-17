import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { carritoPerfilUsuario } from "../models/carrito.model";
import { guardarCarritoLS } from "../utilities/functions-LocalStorage";
import { carritoPago } from "../controllers/galeria-discos-controller";
//import { carrito } from "../mocks/carrito";

export type ItemCarrito = {
    id:number,
    nombre:string,
    imagen:string,
    precio:number,
    cantidad:number
};

type CarritoState = ItemCarrito[];

//let carritoStateInicial = carritoPerfilUsuario();
//const estadoInicialCarrito=carritoStateInicial;

const initialState: CarritoState = [];

const carritoSlice = createSlice({
  name: 'carrito',
  initialState,
  reducers: {
    agregarAlCarrito: (state, action: PayloadAction<ItemCarrito>) => {
      console.log("paso 2")
      let carroRecuperado = carritoPerfilUsuario();
      console.log(action.payload)
      console.log(carroRecuperado)

      if (carroRecuperado.length==0 || carroRecuperado===null) {
        console.log("Esto es dentro de op carro vacío:")
        action.payload.cantidad = 1;
        state.push(action.payload);
        console.log(action.payload);
        guardarCarritoLS([action.payload]);
        carritoPago([action.payload]);
        alert("Agregado al carrito");
      
      } else {

        const productoEnCarrito: ItemCarrito | null = (carroRecuperado as ItemCarrito[]).find((productId: ItemCarrito) => productId.id === action.payload.id) || null;
        console.log(productoEnCarrito)
        if (!productoEnCarrito) {
          console.log("Esto es dentro de op carro sin el mismo disco:")
          action.payload.cantidad = 1;
          state.push(action.payload);
          console.log(action.payload);
          carroRecuperado.push(action.payload);
          guardarCarritoLS(carroRecuperado);
          carritoPago(carroRecuperado);
          alert("Agregado al carrito");

        } else {
          
          console.log("Esto es dentro de op carro con el mismo disco:")
          for (let i = 0; i < carroRecuperado.length; i++) {
            if (carroRecuperado[i].id === action.payload.id) {
              carroRecuperado[i].cantidad++;
            }
          }
          
          guardarCarritoLS(carroRecuperado);
          carritoPago(carroRecuperado);
          alert("Agregado al carrito");
          return carroRecuperado;
        }
      }
    },
    reducirCantidadRedux:(state, action: PayloadAction<ItemCarrito>) => {
      console.log("estado inicial: ")
      console.log(state)
      console.log("paso 2 reducir")
      let carroRecuperado = carritoPerfilUsuario();
      console.log(action.payload)
      console.log(carroRecuperado)
      for (let i = 0; i < carroRecuperado.length; i++) {
        if (carroRecuperado[i].id===action.payload.id) {
          carroRecuperado[i].cantidad -=1;
        };
      }
      guardarCarritoLS(carroRecuperado);
      carritoPago(carroRecuperado);
      console.log("estado final: ")
      console.log(state)
      return carroRecuperado
    },
    aumentarCantidadRedux: (_state, action: PayloadAction<ItemCarrito>) => {
      console.log("paso 2 aumentar");
      let carroRecuperado = carritoPerfilUsuario();
      console.log(action.payload);
      console.log(carroRecuperado);
      for (let i = 0; i < carroRecuperado.length; i++) {
        if (carroRecuperado[i].id===action.payload.id) {
          carroRecuperado[i].cantidad +=1;
        };
      }
      guardarCarritoLS(carroRecuperado);
      carritoPago(carroRecuperado);
      return carroRecuperado
    },
    eliminarDiscoRedux: (_state, action: PayloadAction<number>) => {
      console.log("paso 2 eliminar");
      let carroRecuperado = carritoPerfilUsuario();
      let carroDespuesEliminar = carroRecuperado.filter((item: ItemCarrito) => item.id !== action.payload);
      guardarCarritoLS(carroDespuesEliminar);
      carritoPago(carroDespuesEliminar);
      return carroDespuesEliminar;
    },
    vaciarCarritoRedux: () => {
      console.log("paso 2 vaciar carrito");
      let carrito:any=[];
      guardarCarritoLS(carrito);
      carritoPago(carrito);
    }
  }
 });

export const { agregarAlCarrito, reducirCantidadRedux, aumentarCantidadRedux, eliminarDiscoRedux, vaciarCarritoRedux } = carritoSlice.actions;
export default carritoSlice.reducer;
