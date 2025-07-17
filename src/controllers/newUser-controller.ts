import { agregarNuevoUsuario, leerUsuarios } from "./../models/BBDD.models";
import { guardarUsuarioActual } from "../utilities/functions-cookies";

export function mainNewUser() {
    const formNewUser=document.getElementById("FormNewUser");

    if (!formNewUser) {
        return
    } else {
        formNewUser.addEventListener("submit", (event: Event)=>{
            event.preventDefault();

            const userInput=document.getElementById("User") as HTMLInputElement;
            const passwordInput=document.getElementById("Password") as HTMLInputElement;
            const nameInput=document.getElementById("Name") as HTMLInputElement;

            if (!userInput || !passwordInput || !nameInput) {
                return
            } else {
                const user:string=userInput.value;
                const password:string=passwordInput.value;
                const name:string=nameInput.value;
                const usuariosActuales=leerUsuarios();
                
                const revisarUsuario = usuariosActuales.find((u:any) => u.name === name)
                if (revisarUsuario) {
                    alert("El usuario ya existe");
                    userInput.value="";
                    passwordInput.value="";
                    nameInput.value="";
                    return
                } else {
                    agregarNuevoUsuario(user, password, name);
                    guardarUsuarioActual(name);
                }
            }
            window.location.href = "/index.html";
        })
    }

}

