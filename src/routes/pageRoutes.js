const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const UserController = require('../controllers/UserController')
const authMiddleware = require('../middlewares/auth')
const User = require('../models/User')


// Mapeamento de skills para seus respectivos icones
const skillIcons = {
    'javascript': "JavaScript-logo.png",
    'java': 'java-logo.webp',
    'nodejs': 'nodejs-logo.svg',
    'mysql': 'mysql-logo.jpg',
    'typescript': 'typescript-logo.svg',
    'react': 'react-logo.svg',
    'php': 'PHP-logo.svg.png',
    'python': 'python-logo.png',
    'gml': 'gml-logo.png',
    'csharp': 'Logo_C_sharp.svg.png',
    'cpp': 'C++_Logo.svg.png',
    'go': 'go_logo.png',
    'kotlin': 'Kotlin_logo.svg.png',
    'ruby': 'Ruby_logo.svg.png'
}

module.exports = skillIcons

// Pagina inicial

router.get('/', async (req, res) => {
    try {

        const token = req.cookies.token
        let loggedUser = null

        if (token) {
            try {
                // decodifica o token
                const decoded = jwt.verify(token, process.env.JWT_SECRET || '5948450547b129b0159379195e4dfb42e617fe8a66fed0c6f27b296f5ae1c2bd389f37ef0386feb3c4c6a3953baee3efc2a2f5b5067b293e58a8f7188dbe36ba')
                // Busca o usuário
                loggedUser = await User.findById(decoded.id)
            } catch (error) {
                console.log('Erro ao verificar o token: ', error)
            }
        }

        // Simula uma requisição
        const mockRes = {
            json: (data) => data,
            status: () => mockRes
        }

        const users = await UserController.listUser(req, mockRes)
        console.log("Users: ", users) // para debug
        res.render('pages/index', { users: users || [], skillIcons: skillIcons, loggedUser: loggedUser })

    } catch (error) {
        console.log('Error: ', error)
        res.render('pages/index', { users: [], skillIcons: skillIcons, loggedUser: null })
    }
})

// Rota sobre a DevNexus

router.get('/sobre', async (req, res) => {
    try {

        const token = req.cookies.token
        let loggedUser = null

        if (token) {
            try {
                // decodifica o token
                const decoded = jwt.verify(token, process.env.JWT_SECRET || '5948450547b129b0159379195e4dfb42e617fe8a66fed0c6f27b296f5ae1c2bd389f37ef0386feb3c4c6a3953baee3efc2a2f5b5067b293e58a8f7188dbe36ba')
                // Busca o usuário
                loggedUser = await User.findById(decoded.id)
            } catch (error) {
                console.log('Erro ao verificar o token: ', error)
            }
        }

        // Simula uma requisição
        const mockRes = {
            json: (data) => data,
            status: () => mockRes
        }

        const users = await UserController.listUser(req, mockRes)
        console.log("Users: ", users) // para debug
        res.render('pages/sobre-nos', { users: users || [], loggedUser: loggedUser })

    } catch (error) {
        console.log('Error: ', error)
        res.render('pages/sobre-nos', { users: [], loggedUser: null })
    }
})

// Log Middlewere para debug
router.use((req, res, next) => {
    console.log('Request URL: ', req.url)
    console.log('Request Method: ', req.method)
    console.log('Request Body: ', req.body)
    next()
})

// Pagina de login
router.get('/login', (req, res) => {
    res.render('pages/login', { error: null })
})
router.post('/login', UserController.login)

// Pagina de registro
router.get('/register', (req, res) => {
    res.render('pages/register', { error: null })
})

// Rota para processar o registro

router.post('/register', async (req, res) => {
    try {
        const response = await UserController.register(req, res)
        if (response.error) {
            return res.render('pages/register', { error: response.error })
        }
        res.redirect('pages/login')
    } catch (error) {
        res.render('pages/register', { error: "Erro ao processar o registro" })
    }
})


// Rotas protegidas

// Pagina de perfil
router.get('/perfil', authMiddleware, async (req, res) => {
    try {
        const user = await UserController.getPerfil(req, res)
        res.render('pages/perfil', { user: user.body, skillIcons: skillIcons })
    } catch (error) {
        res.redirect('/')
    }
})

// pagina do usuario
router.get('/user-page/:id', async (req, res) => {
    try {
        const user = await UserController.getUser(req, res)
        res.render('pages/user-page', { user: user.body })
    } catch (error) {
        res.redirect('/')
    }
})

// Pagina de edição de usuario
router.get('/user-edit', (req, res) => {
    res.render('pages/user-edit')
})


module.exports = router