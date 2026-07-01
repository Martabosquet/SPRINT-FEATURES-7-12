process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret"

import { jest } from "@jest/globals"

await jest.unstable_mockModule("../../services/auth.service.js", () => ({
  __esModule: true,
  authService: {
    registerUser: jest.fn(),
    login: jest.fn(),
  },
}))

const request = (await import("supertest")).default
const jwt = (await import("jsonwebtoken")).default
const { default: app } = await import("../../app.js")
const { authService } = await import("../../services/auth.service.js")

describe("Auth routes (/api/auth, /api/me, /api/admin)", () => {
  // Estos tests validan las rutas de autenticación y autorización mediante Supertest.
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret"
  })

  test("POST /api/auth/register devuelve 201 y datos del usuario", async () => {
    // Simula el registro de un usuario y comprueba que la ruta devuelve 201 con el usuario creado.
    authService.registerUser.mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
      role: "user",
    })

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "password123", role: "user" })

    expect(res.statusCode).toBe(201)
    expect(res.body.ok).toBe(true)
    expect(res.body.data).toMatchObject({ id: "user-123", email: "test@example.com", role: "user" })
    expect(authService.registerUser).toHaveBeenCalledWith("test@example.com", "password123", "user")
  })

  test("POST /api/auth/login devuelve 200 y cookie cuando las credenciales son válidas", async () => {
    // Comprueba que el login devuelve un token y establece la cookie de sesión correctamente.
    authService.login.mockResolvedValue("valid-token")

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" })

    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.headers["set-cookie"]).toBeDefined()
    expect(authService.login).toHaveBeenCalledWith("test@example.com", "password123")
  })

  test("GET /api/me rechaza acceso sin token", async () => {
    // Verifica que la ruta de perfil requiere autenticación mediante token.
    const res = await request(app).get("/api/me")

    expect([401, 403]).toContain(res.statusCode)
    expect(res.body.ok).toBe(false)
    expect(res.body).toHaveProperty("error")
  })

  test("GET /api/me devuelve perfil con token válido", async () => {
    // Verifica que el endpoint de perfil devuelve los datos del usuario correcto cuando se envía un JWT válido.
    const token = jwt.sign(
      { id: "user-1", email: "test@example.com", role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    )

    const res = await request(app)
      .get("/api/me")
      .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.data).toMatchObject({ id: "user-1", email: "test@example.com", role: "user" })
  })

  test("GET /api/admin deniega acceso a un usuario normal", async () => {
    // Comprueba que un usuario con rol user no puede acceder al panel de admin.
    const token = jwt.sign(
      { id: "user-1", email: "test@example.com", role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    )

    const res = await request(app)
      .get("/api/admin")
      .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(403)
    expect(res.body.ok).toBe(false)
    expect(res.body.error).toMatch(/rol admin/i)
  })

  test("GET /api/admin permite acceso a admin", async () => {
    // Comprueba que el rol admin sí puede acceder al endpoint protegido de admin.
    const token = jwt.sign(
      { id: "admin-1", email: "admin@example.com", role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    )

    const res = await request(app)
      .get("/api/admin")
      .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.message).toMatch(/Bienvenido al panel de admin/i)
  })
})
