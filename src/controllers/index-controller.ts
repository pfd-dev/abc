import { leerDiscos } from "./../models/BBDD.models.ts";
import { enrutador } from "./../controllers/router.ts";
import { registerSW } from 'virtual:pwa-register'


//================ANTERIORMENTE LLAMADO SCRIPTS GENERALES!!!!!!!!!!!!=====================

console.table(leerDiscos());


export function mainIndex() {
    registerSW({
  onNeedRefresh() {
    // Mostrar un banner personalizado si hay una nueva versión disponible
  },
  onOfflineReady() {
    console.log('App lista para usarse offline')
  },
})

    enrutador();
}

document.addEventListener("DOMContentLoaded",mainIndex);

