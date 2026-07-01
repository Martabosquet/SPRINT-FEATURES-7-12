process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret"

import { jest } from "@jest/globals"

const cartController = {
  getCartController: jest.fn((req, res) => res.json({ ok: true, data: { items: [] } })),
  addItemController: jest.fn((req, res) => res.status(201).json({ ok: true, data: { id: "cart-item-1" } })),
  removeItemController: jest.fn((req, res) => res.json({ ok: true, message: "Elemento eliminado" })),
  decreaseItemQuantityController: jest.fn((req, res) => res.json({ ok: true, data: { id: "cart-item-1", quantity: 1 } })),
  checkoutController: jest.fn((req, res) => res.json({ ok: true, data: { id: "order-1" } })),
  getOrdersController: jest.fn((req, res) => res.json({ ok: true, data: [] })),
  getOrderByIdController: jest.fn((req, res) => res.json({ ok: true, data: { id: req.params.orderId } })),
}

await jest.unstable_mockModule("../../controllers/cart.controller.js", () => ({
  __esModule: true,
  ...cartController,
}))

const request = (await import("supertest")).default
const jwt = (await import("jsonwebtoken")).default
const { default: app } = await import("../../app.js")

const token = jwt.sign({ id: "user-1", email: "user@example.com", role: "user" }, process.env.JWT_SECRET, { expiresIn: "2h" })

describe("Carrito y ordenes rutas (/api/cart, /api/orders)", () => {
  // Estos tests cubren autenticación y autorizaciones para el carrito y pedidos.
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("GET /api/cart requiere autenticación", async () => {
    // PRUEBA: el endpoint de obtener carrito debe rechazar peticiones no autenticadas.
    const res = await request(app).get("/api/cart")
    expect([401, 403]).toContain(res.statusCode)
  })

  test("GET /api/cart devuelve carrito con token", async () => {
    // PRUEBA: el usuario autenticado puede consultar su carrito.
    const res = await request(app).get("/api/cart").set("Authorization", `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
  })

  test("POST /api/cart/items agrega item con token", async () => {
    // PRUEBA: un usuario autenticado puede agregar un item al carrito.
    const res = await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: "test-product", quantity: 1 })

    expect(res.statusCode).toBe(201)
    expect(res.body.ok).toBe(true)
    expect(res.body.data.id).toBe("cart-item-1")
  })

  test("PATCH /api/cart/items/:itemId requiere autenticación", async () => {
    // PRUEBA: actualizar cantidad exige autenticación.
    const res = await request(app).patch("/api/cart/items/cart-item-1").send({ quantity: 1 })
    expect([401, 403]).toContain(res.statusCode)
  })

  test("PATCH /api/cart/items/:itemId permite con token", async () => {
    // PRUEBA: un usuario autenticado puede disminuir la cantidad de un item del carrito.
    const res = await request(app)
      .patch("/api/cart/items/cart-item-1")
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 1 })

    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.data.quantity).toBe(1)
  })

  test("DELETE /api/cart/items/:itemId elimina item con token", async () => {
    // PRUEBA: un usuario autenticado puede eliminar un item del carrito.
    const res = await request(app)
      .delete("/api/cart/items/cart-item-1")
      .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.message).toMatch(/eliminado/i)
  })

  test("POST /api/cart/checkout crea orden con token", async () => {
    // PRUEBA: el checkout genera una orden para el usuario autenticado.
    const res = await request(app)
      .post("/api/cart/checkout")
      .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.data.id).toBe("order-1")
  })

  test("GET /api/orders devuelve historial con token", async () => {
    // PRUEBA: el historial de pedidos debe ser accesible para el usuario autenticado.
    const res = await request(app).get("/api/orders").set("Authorization", `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
  })

  test("GET /api/orders/:orderId devuelve orden con token", async () => {
    // PRUEBA: el usuario autenticado puede consultar una orden específica por id.
    const res = await request(app)
      .get("/api/orders/order-1")
      .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.data.id).toBe("order-1")
  })
})
