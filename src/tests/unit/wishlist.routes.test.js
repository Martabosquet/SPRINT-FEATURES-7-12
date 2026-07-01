process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret"

import { jest } from "@jest/globals"

const wishlistController = {
  getWishlistByUser: jest.fn((req, res) => res.json({ ok: true, data: [] })),
  addToWishlist: jest.fn((req, res) => res.status(201).json({ ok: true, data: { id: "wishlist-1" } })),
  removeFromWishlist: jest.fn((req, res) => res.json({ ok: true, message: "Eliminado" })),
}

await jest.unstable_mockModule("../../controllers/wishlist.controller.js", () => ({
  __esModule: true,
  ...wishlistController,
}))

const request = (await import("supertest")).default
const jwt = (await import("jsonwebtoken")).default
const { default: app } = await import("../../app.js")

const token = jwt.sign({ id: "user-1", email: "user@example.com", role: "user" }, process.env.JWT_SECRET, { expiresIn: "2h" })

describe("Wishlist routes (/api/wishlist)", () => {
  // Estos tests verifican la protección y el comportamiento de las rutas de wishlist.
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("GET /api/wishlist requiere autenticación", async () => {
    // PRUEBA: sin token, el endpoint de wishlist debe rechazar la petición.
    const res = await request(app).get("/api/wishlist")
    expect([401, 403]).toContain(res.statusCode)
  })

  test("GET /api/wishlist devuelve lista con token", async () => {
    // PRUEBA: con token válido, el usuario puede obtener su wishlist.
    const res = await request(app).get("/api/wishlist").set("Authorization", `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  test("POST /api/wishlist/:productId añade producto con token", async () => {
    // PRUEBA: el endpoint añade un producto a la wishlist cuando el usuario está autenticado.
    const res = await request(app)
      .post("/api/wishlist/test-product")
      .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(201)
    expect(res.body.ok).toBe(true)
    expect(res.body.data.id).toBe("wishlist-1")
  })

  test("DELETE /api/wishlist/:id deniega acceso a usuario normal", async () => {
    // PRUEBA: eliminar wishlist requiere rol admin, no user.
    const res = await request(app)
      .delete("/api/wishlist/wishlist-1")
      .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(403)
    expect(res.body.ok).toBe(false)
  })

  test("DELETE /api/wishlist/:id permite acceso a admin", async () => {
    // PRUEBA: un admin puede eliminar un elemento de wishlist.
    const adminToken = jwt.sign({ id: "admin-1", email: "admin@example.com", role: "admin" }, process.env.JWT_SECRET, { expiresIn: "2h" })

    const res = await request(app)
      .delete("/api/wishlist/wishlist-1")
      .set("Authorization", `Bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.message).toMatch(/eliminado/i)
  })
})
