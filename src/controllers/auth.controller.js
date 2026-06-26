import { authService } from "../services/auth.service.js"

const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        error: "Email y contraseña son requeridos",
      });
    }

    const newUser = await authService.registerUser(email, password, role);

    res.status(201).json({
      ok: true,
      message: "Usuario registrado con éxito",
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        error: "Email y contraseña son obligatorios",
      })
    }

    const token = await authService.login(email, password)

    const cookieOptions = {
      httpOnly: true,
      secure: false,
      maxAge: 2 * 60 * 60 * 1000,
    }

    res.cookie("token", token, cookieOptions)

    res.json({
      ok: true,
      message: "El login se realizó con éxito",
    }) //no enseño el token en la respuesta, para evitar que alguien lo pueda robar. Solo lo guardo en la cookie

  } catch (error) {
    res.status(401).json({
      ok: false,
      error: error.message,
    })
  }
}

const logout = (req, res) => {
  res.clearCookie("token")
  res.json({
    ok: true,
    message: "Sesión cerrada",
  }) //no hay que indicar qué usuario es el que cierra sesión, solo borra la cookie
} //buena práctica de cara a front-end que aunque des varios clicks en cerrar sesión siga saliendo "Sesión cerrada" y no dé error (endpoint silencioso e idempotente)

const getProfile = (req, res) => {
  res.json({
    ok: true,
    data: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
  })
}

const getAdmin = (req, res) => {
  res.json({
    ok: true,
    message: `Bienvenido al panel de admin, ${req.user.email}`,
  })
}

export const authController = {
  register,
  login,
  logout,
  getProfile,
  getAdmin,
}