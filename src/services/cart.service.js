import prisma from "../config/prismaClient.js"

// Obtenemos el carrito active del user y si no existe lo crea
export const getCart = async (userId) => {
    const normalizedUserId = String(userId)

    let cart = await prisma.cart.findFirst({
        where: { userId: normalizedUserId, status: "ACTIVE" },
        include: { items: true },
    })

    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId: normalizedUserId },
            include: { items: true },
        })
    }

    return cart
}

// Obtener un carrito por id

export const getCartById = async (cartId) => {
    let cart = await prisma.cart.findUnique({
        where: { id: cartId },
    })

    return cart
}

// Añadir producto al carrito

export const addItem = async (userId, productId, quantity) => {
    const cart = await getCart(userId)

    // comprobamos que existe el producto en el carrito
    const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId },
    })

    if (existingItem) {
        return prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity },
        })
    }

    return prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
    })
}

// Eliminar un producto del carrito por su itemId
export const removeItem = async (itemId) => {
    try {
        return await prisma.cartItem.delete({
            where: { id: itemId },
        })
    } catch (error) {
        return null // Si Prisma no encuentra el item, devuelve null
    }
}

// Disminuir la cantidad de un item del carrito
export const decreaseItemQuantity = async (itemId, quantity) => {
    const item = await prisma.cartItem.findUnique({
        where: { id: itemId },
    })

    if (!item) return null

    const newQuantity = item.quantity - quantity

    if (newQuantity <= 0) {
        return prisma.cartItem.delete({
            where: { id: itemId },
        })
    }

    return prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: newQuantity },
    })
}

export const checkout = async (userId) => {
    const normalizedUserId = String(userId)

    const cart = await prisma.cart.findFirst({
        where: { userId: normalizedUserId, status: "ACTIVE" },
        include: { items: true },
    })

    if (!cart) {
        throw new Error("No hay carrito activo")
    }

    if (cart.items.length === 0) {
        throw new Error("El carrito está vacío")
    }

    const itemsData = await Promise.all(
        cart.items.map(async (item) => {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
            })

            if (!product) {
                throw new Error(`Producto con id ${item.productId} no encontrado`)
            }

            return {
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: product.price,
            }
        }),
    )

    const totalValue = itemsData.reduce(
        (sum, item) => sum + item.priceAtPurchase * item.quantity,
        0,
    )

    const order = await prisma.order.create({
        data: {
            userId: normalizedUserId,
            total: totalValue,
            items: {
                create: itemsData,
            },
        },
        include: {
            items: true,
        },
    })

    await prisma.cart.update({
        where: { id: cart.id },
        data: { status: "CHECKED_OUT" },
    })

    return order
}

export const getOrdersByUser = async (userId) => {
    const normalizedUserId = String(userId)

    return await prisma.order.findMany({
        where: { userId: normalizedUserId },
        include: { items: true },
        orderBy: { createdAt: "desc" },
    })
}

export const getOrderById = async (userId, orderId) => {
    const normalizedUserId = String(userId)

    return await prisma.order.findFirst({
        where: { id: orderId, userId: normalizedUserId },
        include: { items: true },
    })
}
