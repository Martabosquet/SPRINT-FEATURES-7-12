// Se ejecuta antes del controller en la ruta POST /api/products
// Verifica que el body contiene los campos obligatorios con el tipo de dato correcto

export const validateProduct = (req, res, next) => {
  const { name, price, stock } = req.body

  // 1. Validar campo 'name' (Obligatorio, string no vacío)
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      ok: false,
      error: "El campo 'name' es obligatorio y debe ser un texto.",
    })
  }

  // 2. Validar campo 'price' (Obligatorio, número mayor o igual a 0)
  if (price === undefined || typeof price !== 'number' || price < 0) {
    return res.status(400).json({
      ok: false,
      error: "El campo 'price' es obligatorio y debe ser un número positivo.",
    })
  }

  // 3. Validar campo 'stock' (Opcional, pero si se envía debe ser entero >= 0)
  if (stock !== undefined && (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock))) {
    return res.status(400).json({
      ok: false,
      error: "El campo 'stock' debe ser un número entero no negativo.",
    })
  }

  next()
}