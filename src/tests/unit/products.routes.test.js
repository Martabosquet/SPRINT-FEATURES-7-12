process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret"

import { jest } from "@jest/globals"

const productsController = {
  getProducts: jest.fn((req, res) => res.json({ ok: true, data: [] })),
  getProductById: jest.fn((req, res) => res.json({ ok: true, data: { id: req.params.id } })),
  createProduct: jest.fn((req, res) => res.status(201).json({ ok: true, data: { id: "new-product" } })),
  updateProduct: jest.fn((req, res) => res.json({ ok: true, data: { id: req.params.id } })),
  deleteProduct: jest.fn((req, res) => res.json({ ok: true, message: "Producto eliminado" })),
}

await jest.unstable_mockModule("../../controllers/products.controller.js", () => ({
  __esModule: true,
  productsController,
}))

const request = (await import("supertest")).default
const jwt = (await import("jsonwebtoken")).default
const { default: app } = await import("../../app.js")

const adminToken = jwt.sign({ id: "admin-1", email: "admin@example.com", role: "admin" }, process.env.JWT_SECRET, { expiresIn: "2h" })
const userToken = jwt.sign({ id: "user-1", email: "user@example.com", role: "user" }, process.env.JWT_SECRET, { expiresIn: "2h" })

describe("Productos rutas protegidas (/api/products)", () => {
  // Estos tests validan el acceso público a productos y la protección de rutas admin.
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("GET /api/products es público y funciona", async () => {
    // PRUEBA: acceso público a la lista de productos sin autenticación.
    const res = await request(app).get("/api/products")

    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(productsController.getProducts).toHaveBeenCalled()
  })

  test("POST /api/products deniega acceso sin token", async () => {
    // PRUEBA: la creación de producto requiere autenticación.
    const res = await request(app)
      .post("/api/products")
      .field("name", "Producto prueba")
      .field("price", "15")
      .field("stock", "5")
      .attach("image", Buffer.from("image"), "product.jpg")

    expect([401, 403]).toContain(res.statusCode)
  })

  test("POST /api/products deniega acceso a usuario sin rol admin", async () => {
    // PRUEBA: un usuario normal no puede crear productos.
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${userToken}`)
      .field("name", "Producto prueba")
      .field("price", "15")
      .field("stock", "5")
      .attach("image", Buffer.from("image"), "product.jpg")

    expect(res.statusCode).toBe(403)
  })

  test("POST /api/products permite a admin", async () => {
    // PRUEBA: admin puede crear producto con imagen y datos válidos.
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("name", "Producto prueba")
      .field("price", "15")
      .field("stock", "5")
      .attach("image", Buffer.from("image"), "product.jpg")

    expect(res.statusCode).toBe(201)
    expect(res.body.ok).toBe(true)
    expect(res.body.data.id).toBe("new-product")
  })

  test("PUT /api/products/:id deniega acceso a usuario sin token", async () => {
    // PRUEBA: edición de producto requiere token.
    const res = await request(app)
      .put("/api/products/abc")
      .field("name", "Producto editado")
      .attach("image", Buffer.from("image"), "product.jpg")

    expect([401, 403]).toContain(res.statusCode)
  })

  test("PUT /api/products/:id permite a admin", async () => {
    // PRUEBA: admin puede actualizar un producto existente.
    const res = await request(app)
      .put("/api/products/abc")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("name", "Producto editado")
      .attach("image", Buffer.from("image"), "product.jpg")

    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.data.id).toBe("abc")
  })

  test("DELETE /api/products/:id deniega acceso a usuario normal", async () => {
    // PRUEBA: un usuario normal no puede eliminar productos.
    const res = await request(app)
      .delete("/api/products/abc")
      .set("Authorization", `Bearer ${userToken}`)

    expect(res.statusCode).toBe(403)
  })

  test("DELETE /api/products/:id permite a admin", async () => {
    // PRUEBA: admin puede eliminar un producto.
    const res = await request(app)
      .delete("/api/products/abc")
      .set("Authorization", `Bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.message).toMatch(/eliminado/i)
  })
})
