

//============================Guarda Usuario actual en Cookies=========================
export function guardarUsuarioActual(clave:string) {
  console.log("estoy creando cookie")
  let usuario=clave;
  let hoy=new Date();
  hoy.setTime(hoy.getTime()+(1000*60*60*24));
  let expires="expires="+hoy.toUTCString();
  document.cookie=`usuario=${usuario};${expires}; path=/`;
}

//============================Recupera Usuario actual de Cookies=========================
export function recuperarUsuarioActual() {
  let usuarioCookie = document.cookie;
  let usuario = "";
  let cookies = usuarioCookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let [key, value] = cookies[i].trim().split('=');
    if (key === "usuario") {
      usuario = value;
      break;
    }
  }
  return usuario;
}

//============================Elimina Usuario actual de Cookies=========================
export function quitarCookieUsuario() {
  document.cookie = "usuario=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
