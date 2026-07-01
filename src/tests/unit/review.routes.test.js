process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret"

import { jest } from "@jest/globals"
await jest.unstable_mockModule("../../services/review.service.js", () => ({
  __esModule: true,
  createReview: async (data) => ({ id: "fake-review", ...data }),
  getReviewsByProduct: async () => [],
  getReviewById: async () => null,
  updateReview: async () => null,
  deleteReview: async () => null,
}))

const request = (await import("supertest")).default
const { default: app } = await import("../../app.js")

describe("Review routes (integration)", () => {
  // Estos tests verifican que las rutas de reviews existan y respeten la autenticación.
  test("POST /api/products/:id/reviews should exist and require authentication", async () => {
    // PRUEBA: mantener la protección de creación de reviews para usuarios autenticados.
    const res = await request(app)
      .post("/api/products/test-product/reviews")
      .send({ rating: 7, comment: "Prueba con Supertest" })

    expect([401, 403]).toContain(res.statusCode)
    expect(res.body).toHaveProperty("ok", false)
    expect(res.body).toHaveProperty("error")
  })

  test("GET /api/products/:id/reviews route should be registered", async () => {
    // PRUEBA: la ruta de obtener reviews debe estar registrada y devolver un array.
    const res = await request(app).get("/api/products/test-product/reviews")
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("ok", true)
    expect(Array.isArray(res.body.data)).toBe(true)
  })
})
