import { leerUsuarios } from "../models/BBDD.models.ts";
import { guardarUsuarioActual, recuperarUsuarioActual } from "../utilities/functions-cookies.ts";


export function mainLogin (){

    const formLogin=document.getElementById("FormLogin");
    const BBDDusuarios=leerUsuarios();
    let usuarioActual=recuperarUsuarioActual() || null;
    
    if (!formLogin) {
        return
    } else {
        
        formLogin.addEventListener("submit", (event) => {
            event.preventDefault();
            const user=document.getElementById("User") as HTMLInputElement;
            const userInput=user.value;
            console.log(userInput);
            const password=document.getElementById("Password") as HTMLInputElement;
            const passwordInput=password.value;
            console.log(passwordInput);
            const acceso=document.getElementById("Acceso") as HTMLElement;
        
        for (let i = 0; i < BBDDusuarios.length; i++) {
            if ( BBDDusuarios[i].user === userInput && BBDDusuarios[i].password === passwordInput) {
                guardarUsuarioActual(BBDDusuarios[i].name)
                usuarioActual=BBDDusuarios[i].name;
                if (BBDDusuarios[i].rol==="administrador") {
                    window.location.href="gestionar.html";
                } else if(BBDDusuarios[i].rol==="visitante"){
                    window.location.href="/index.html";
                } 
            }
        }
        
        if (usuarioActual==null) {
            acceso.innerHTML="Usuario o contraseña incorrectos, intenta nuevamente";
         } 
        })
    }
}