import { eliminar, leerDiscos, leerUsuarios } from "../src/models/BBDD.models";

describe('Testear la eliminación', () => {

    test('Deberá regresar un array con un elemento menos al original: 59->58', () => {
        let listaDiscosTest = leerDiscos();
        let listaPrueba = eliminar(listaDiscosTest, 1);

        expect(listaPrueba.length).toBe(58)
    });

    test('La BBDD de usuarios no puede estar vacía > 0', () => {
        let BBDDPrueba = leerUsuarios();

        expect(BBDDPrueba).not.toBeNull();
        expect(BBDDPrueba).not.toBe(undefined);
    });

    test('Todos los discos deben tener estructura válida', () => {
        const listaDiscos = leerDiscos();

        listaDiscos.forEach((disco) => {
            expect(typeof disco.id).toBe("number");
            expect(typeof disco.nombre).toBe("string");
            expect(typeof disco.anio).toBe("number");
            expect(typeof disco.imagen).toBe("string");
            expect(typeof disco.precio).toBe("number");
            expect(typeof disco.cantidad).toBe("undefined");
        });
    });
})
