import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../../src/app.js";
import prisma from "../../config/prismaClient.js";

const TEST_USER_ID = "test-user-order";
const TEST_PRODUCT_ID = "test-product-order";

describe("Pedidos y checkout (/api/cart/checkout, /api/orders)", () => {
    // Estas pruebas validan el flujo completo de carrito, checkout y historial de pedidos.
    let token;
    let orderId;

    beforeAll(async () => {
        // Configura el usuario de prueba y crea un producto necesario para el checkout.
        process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";
        token = jwt.sign(
            { id: TEST_USER_ID, email: "test@example.com", role: "user" },
            process.env.JWT_SECRET,
            { expiresIn: "2h" },
        );

        await prisma.product.upsert({
            where: { id: TEST_PRODUCT_ID },
            update: {
                name: "Producto de prueba de pedido",
                description: "Producto usado para pruebas de checkout",
                price: 10.5,
                stock: 100,
            },
            create: {
                id: TEST_PRODUCT_ID,
                name: "Producto de prueba de pedido",
                description: "Producto usado para pruebas de checkout",
                price: 10.5,
                stock: 100,
            },
        });
    });

    afterAll(async () => {
        if (orderId) {
            await prisma.order.delete({ where: { id: orderId } }).catch(() => null);
        }

        const cart = await prisma.cart.findFirst({ where: { userId: TEST_USER_ID } });
        if (cart) {
            await prisma.cartItem.deleteMany({ where: { cartId: cart.id } }).catch(() => null);
            await prisma.cart.delete({ where: { id: cart.id } }).catch(() => null);
        }

        await prisma.$disconnect();
    });

    test("Debería crear un pedido a partir del carrito y consultar el historial", async () => {
        // PRUEBA: agrega al carrito, realiza el checkout y verifica que la orden quede en el historial.
        const addRes = await request(app)
            .post("/api/cart/items")
            .set("Authorization", `Bearer ${token}`)
            .send({ productId: TEST_PRODUCT_ID, quantity: 2 });

        expect(addRes.statusCode).toBe(201);
        expect(addRes.body.ok).toBe(true);
        expect(addRes.body.data).toMatchObject({ productId: TEST_PRODUCT_ID, quantity: 2 });

        const checkoutRes = await request(app)
            .post("/api/cart/checkout")
            .set("Authorization", `Bearer ${token}`);

        expect(checkoutRes.statusCode).toBe(200);
        expect(checkoutRes.body.ok).toBe(true);
        expect(checkoutRes.body.data).toHaveProperty("id");
        expect(Array.isArray(checkoutRes.body.data.items)).toBe(true);
        expect(checkoutRes.body.data.items[0]).toMatchObject({
            productId: TEST_PRODUCT_ID,
            quantity: 2,
            priceAtPurchase: 10.5,
        });

        orderId = checkoutRes.body.data.id;

        const ordersRes = await request(app)
            .get("/api/orders")
            .set("Authorization", `Bearer ${token}`);

        expect(ordersRes.statusCode).toBe(200);
        expect(ordersRes.body.ok).toBe(true);
        expect(Array.isArray(ordersRes.body.data)).toBe(true);
        expect(ordersRes.body.data.some((order) => order.id === orderId)).toBe(true);

        const orderRes = await request(app)
            .get(`/api/orders/${orderId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(orderRes.statusCode).toBe(200);
        expect(orderRes.body.ok).toBe(true);
        expect(orderRes.body.data.id).toBe(orderId);
        expect(orderRes.body.data.items[0].productId).toBe(TEST_PRODUCT_ID);
    });
});
