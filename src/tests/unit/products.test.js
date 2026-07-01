import request from "supertest";
import app from "../../../src/app.js"; // Importamos la app sin levantar el servidor físico
import prisma from "../../config/prismaClient.js"; // Para limpiar o verificar la BD si es necesario

describe("Pruebas del módulo de Productos (/api/products)", () => {

    test("GET /api/products debería devolver un estado 200", async () => {
        const res = await request(app).get("/api/products");

        expect(res.statusCode).toBe(200); // Comprobamos que el código de estado sea exitoso
    });

    test("GET /api/products/categories - Debería retornar 404 si la categoría solicitada no existe", async () => {
        const res = await request(app).get("/api/products/categories/nombre-categoria-inexistente");
        expect(res.statusCode).toBe(404);
    });

    // Opcional: Limpieza o preparación antes/después de los tests
    afterAll(async () => {
        // Desconecta Prisma al finalizar todos los tests para evitar procesos colgados
        await prisma.$disconnect();
    });

    /* CASOS DE ÉXITO (PÚBLICOS) */

    test("GET /api/products - Debería obtener la lista completa de productos con status 200", async () => {
        const res = await request(app)
            .get("/api/products");

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("ok", true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    /* CASOS PROTEGIDOS / ROLES (SIMULACIÓN CON COOKIES O AUTH HEADERS) */

    test("POST /api/products - Debería denegar el acceso (403 o 401) si no se envía un token válido", async () => {
        const res = await request(app)
            .post("/api/products")
            .send({
                name: "Producto de Prueba",
                price: "25.50",
                stock: "10"
            });

        // Tu middleware authMiddleware debería retornar 403 o 401 si falta el token
        expect([401, 403]).toContain(res.statusCode);
    });

});