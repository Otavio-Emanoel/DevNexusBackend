const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = async (req, res, next) => {
    
    console.log('Verificando autenticação...')
    console.log('Cookies recebidos: ', req.cookies)

    try {

        // pega o token do cookie
        const token = req.cookies.token

        if (!token) {
            console.log('token não encontrado')
            return res.redirect('/login')
        }

        try {
            // Verifica o token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || '5948450547b129b0159379195e4dfb42e617fe8a66fed0c6f27b296f5ae1c2bd389f37ef0386feb3c4c6a3953baee3efc2a2f5b5067b293e58a8f7188dbe36ba')
            console.log('token decodificado: ', decoded)

            // Busca o usuario

            const user = await User.findById(decoded.id)
            if (!user) {
                console.log('Usuario nao encontrado')
                return res.redirect('/login')
            }

            // Adiciona o ID do usuario e o objeto do usuario a requisição

            req.userId = decoded.id
            req.user = user

            console.log('Usuario autenticado: ', user.email)
            next()
        } catch (err) {
            console.log('Erro na autenticação do token: ', err)
            return res.redirect('/login')
        }

    } catch (error) {
        console.error('Erro na autenticação: ', error)
        return res.redirect('/login')
    }
}