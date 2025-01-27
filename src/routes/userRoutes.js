const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const authMiddleware = require('../middlewares/auth')

// Rotas publicas


router.get('/login', (req, res) => {
    res.render('pages/login', { error: null })
})
router.post('/login', UserController.login)

router.get('/register', (req, res) => {
    res.render('pages/register', { error: null, formData: {} })
})
router.post('/register', UserController.register)

// Rota de logout
router.get('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false, // Mudar para true caso vire https
        sameSite: 'Lax',
        path: '/'
    })
    res.redirect('/login')
})


// Rota para mostrar o formulario
router.get('/user-edit', authMiddleware, UserController.showEditForm)

// Rota para processar a atualização
router.post('/user-edit', authMiddleware, UserController.updateProfile)

// Rotas projegidas

router.use('/perfil', authMiddleware)
router.get('/perfil', UserController.getPerfil)

// Rota para deletar a conta

router.get('/deleteUser', authMiddleware, UserController.deleteUser)


// router.get('/perfil', async (req, res) => {
//     try {
//         const user = req.user // o middleware ja adiciona o usuario ao req
//         res.render('pages/perfil', { user })
//     } catch (error) {
//         console.error('Erro ao carregar perfil', error)
//         res.redirect('/login')
//     }
// })


module.exports = router;

// router.put('/users/:id/skills', UserController.updateSkills)
// router.get('/users/area/:area', UserController.getUserByArea)


