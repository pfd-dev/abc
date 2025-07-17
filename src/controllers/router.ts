import { iniciarPaginaHome } from "../controllers/galeria-discos-controller.ts";
import { mainGestionar } from "../controllers/galeria-gestionar-controller.ts";
import { mainLogin } from "./../controllers/login-controller.ts";
import { mainNewUser } from "./../controllers/newUser-controller.ts";
import { mainDashboard } from "./../controllers/dashboard-controller.ts";


const rutas = {
    "/index.html": iniciarPaginaHome,
    "/pages/login": mainLogin,
    "/pages/newUser": mainNewUser,
    "/pages/gestionar": mainGestionar,
    "/pages/dashboard": mainDashboard,
} as const;

export function enrutador() {

    const currentPath = window.location.pathname;
    console.log(currentPath);

    if (currentPath in rutas) {
        rutas[currentPath as keyof typeof rutas]();
    } else {
        window.location.href = "/index.html";
    }

}