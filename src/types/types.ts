export interface ICarrito {
    id:string,
    nombre?:string,
    anio?:number,
    imagen?:string,
    precio?:number | any,
    cantidad?:number
}

export interface Iusuarios {
    user:string,
    password:string,
    name:string,
    rol:boolean,
    compra:[{id:number,cantidad:number}]
}