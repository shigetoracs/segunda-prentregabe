import jwt from 'jsonwebtoken'

export const generateToken = (user) => {

    /*
        1°: Objeto de asociacion del token (Usuario)
        2°: Clave privada del cifrado
        3°: Tiempo de expiracion
    */
    const token = jwt.sign({ user }, "coderhouse", { expiresIn: '12h' })
    return token
}

console.log(generateToken({
        "rol": "User",
        "_id": "65edeff047f2062e7cc2e475",
        "nombre": "Lautaro",
        "apellido": "Altamirano",
        "password": "123",
        "edad": 23,
        "email": "lautaro@lautaro.com",
        "__v": 0
}))