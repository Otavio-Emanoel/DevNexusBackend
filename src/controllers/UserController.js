const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const skillIcons = require('../utils/skillIcons')
const SearchFilter = require('../config/SearchFilter')

class UserController {
    // Registro de usuario
    register = async (req, res) => {
        try {
            console.log("Dados recebidos: ", req.body) // para debug
            const {
                name,
                email,
                password,
                github,
                area,
                about,
                gender,
                birthDate
            } = req.body

            // Verificações basicas
            if (!name || !email || !password || !github || !area || !gender || !birthDate) {
                console.log("Campos faltando: ", {
                    name,
                    email,
                    password,
                    github,
                    area,
                    about,
                    gender,
                    birthDate
                })
                return res.render('pages/register', {
                    error: 'Por favor, preencha todos os campos obrigatórios',
                    formData: req.body
                })
            }

            // Verificar se o usuario existe
            const existingUser = await User.findOne({ email })
            if (existingUser) {
                // res.status(400).json({ error: 'Usuario já cadastrado' })
                return res.render('pages/register', { error: 'Usuario já cadastrado' })
            }

            // Hash da senha

            const hashedPassword = await bcrypt.hash(password, 10)

            // define uma foto padrao

            const defaultPhotoUrl = 'images/DevNexus.png'

            // Criar novo Usuario

            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                birthDate,
                github,
                area,
                about,
                gender,
                photoUrl: defaultPhotoUrl,
                skills: []
            })

            // Remove a senha do objeto de retorno

            user.password = undefined

            // Gerar token

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            )

            // Retorna usuário sem a senha

            // return res.status(201).json({
            //     user,
            //     token
            // })

            return res.redirect('/login')

        } catch (error) {
            console.error('Erro no registro: ', error)
            return res.status(500).json({ error: 'Erro interno no servidor' })
        }
    }

    // Login

    login = async (req, res) => {
        try {
            console.log('\nIniciando processo de login...')
            const { email, password } = req.body

            console.log('\nEmail recebido: ', email)
            console.log('\nSenha recebido: ', password)

            // Busca o usuario
            const user = await User.findOne({ email })
            console.log('\nUsuario encontrado: ', user ? 'Sim' : 'Não')
            if (!user) {
                return res.render('pages/login', {
                    error: 'Email ou senha incorretos'
                })
            }

            // Log da senha armazenada (hash)
            console.log('\nHash da senha armazenada: ', user.password)


            // Verifica se recebeu email e senha

            if (!email || !password) {
                console.log('Email ou senha não fornecido')
                return res.render('pages/login', {
                    error: 'Por favor preencha todos os campos'
                })
            }

            // Verificar senha

            const isValidPassword = await bcrypt.compare(password, user.password)
            console.log('\nResultado da comparação de senha: ', isValidPassword)
            if (!isValidPassword) {
                console.log('\n SENHA ERRADA ')
                return res.render('pages/login', {
                    error: 'Email ou senha incorretos'
                })
            }

            // Se chegar aqui deu bom, o login ta certo
            console.log('\nLogin bem sucedido')

            // Gerar token

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET || '5948450547b129b0159379195e4dfb42e617fe8a66fed0c6f27b296f5ae1c2bd389f37ef0386feb3c4c6a3953baee3efc2a2f5b5067b293e58a8f7188dbe36ba',
                { expiresIn: '1d' }
            )

            // Salva o token em um cookie

            res.cookie('token', token, {
                httpOnly: true,
                secure: false, // Mudar para true caso seja https
                sameSite: 'Lax',
                path: '/',
                maxAge: 24 * 60 * 60 * 1000 // Um dia
            })
            console.log('Token gerado: ', token)
            console.log('Cookie definido, redirecionando')

            // Teste: adicionar o usuario a sessao
            req.user = user

            // Redireciona para a pagina inicial apos o login

            return res.redirect('/perfil')

            // res.json({
            //     user: user.toJSON(),
            //     token
            // })

        } catch (error) {
            console.error('Erro no login: ', error)
            return res.render('pages/login', {
                error: 'Erro ao fazer login. Tente novamente.'
            })
        }
    }

    //buscar usuario por ID

    async getUser(req, res) {
        try {
            const user = await User.findById(req.params.id)
            if (!user) {
                return res.status(404).json({
                    error: 'Usuario não encontrado'
                })
            }
            res.json(user)
        } catch (error) {
            res.status(400).json({
                error: 'Erro ao buscar usuário',
                details: error.message
            })
        }
    }

    // Atualizar usuario

    async updateUser(req, res) {
        try {
            const { password, ...updateData } = req.body

            // Se houver uma senha nova, faz o hash
            if (password) {
                const salt = await bcrypt.genSalt(10)
                updateData.password = await bcrypt.hash(password, salt)
            }
            const user = await User.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true,
                    runValidators: true
                }
            )

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' })
            }
            res.json(user)
        } catch (error) {
            res.status(400).json({
                error: "Erro ao atualizar usuário",
                details: error.message
            })
        }
    }

    deleteUser = async (req, res) => {
        try {
            // Pega o ID do usuario da sessão
            const userId = req.userId

            // Deleta o usuario do banco de dados
            await User.findByIdAndDelete(userId)

            // Destroi a sessao
            req.session.destroy()

            // redireciona para a pagina de Inicial
            res.redirect('/')
        } catch (error) {
            console.error("Erro ao deletar usuario: ", error)
            res.status(500).redirect('/user-edit?error=delete_failed')
        }
    }

    // Listar todos os usuários (Com filtro)

    listUser = async (req, res) => {
        try {
            const users = await SearchFilter.filterUsers(req.query)
            
            return users
            // return res.render('pages/index', {
            //     users: users,
            //     filters: {
            //         idade: req.query.idade || '',
            //         area: req.query.area || '',
            //         sortBy: req.query.sortBy || 'newest'
            //     }
            // })
        } catch (error) {
            console.error('Erro ao listar usuários: ', error)
            return []
            // return res.render('pages/index', { 
            //     users: [],
            //     filters: {
            //         idade: '',
            //         area: '',
            //         sortBy: ''
            //     },
            //     error: 'Erro ao carregar usuários'
            // })
        }
    }

    // listUser = async (req, res) => {
    //     try {
    //         const { area, skills, search } = req.query
    //         let query = {}

    //         // Filtro por área
    //         if (area) {
    //             query.area = area
    //         }

    //         // Filtro por skills
    //         if (skills) {
    //             query.skills = { $all: skills.split(',') }
    //         }

    //         // Busca por nome ou email
    //         if (search) {
    //             query.$or = [
    //                 {
    //                     nome: {
    //                         $regex: search,
    //                         $options: 'i'
    //                     }
    //                 },
    //                 {
    //                     email: {
    //                         $regex: search,
    //                         $options: 'i'
    //                     }
    //                 }
    //             ]
    //         }

    //         const users = await User.find(query)
    //             .select('-password')
    //             .sort({ createdAt: -1 })
    //         res.json(users)

    //         return res.status(200).json(users)
    //     } catch (error) {
    //         return res.status(400).json({
    //             error: 'Erro ao listar usuários',
    //             details: error.message
    //         })
    //     }
    // }

    // Atualizar skills

    async updateSkills(req, res) {
        try {
            const { skills } = req.body
            const user = await User.findByIdAndUpdate(
                req.params.id,
                { $set: { skills } },
                {
                    new: true,
                    runValidators: true
                }
            )

            if (!user) {
                return res.status(404).json({ error: 'Usuario não encontrado' })
            }

            res.json(user)
            // Isso nao acaba nunca T-T
        } catch (error) {
            res.status(400).json({
                error: 'Erro ao atualizar skills',
                details: error.message
            })
        }
    }

    // Buscar usuarios por area
    async getUserByArea(req, res) {
        try {
            const { area } = req.params
            const user = await User.find({ area })
                .select('-password')
                .sort({ createdAt: -1 })
            res.json(users)
        } catch (error) {
            res.status(400).json({
                error: 'Erro ao buscar usuario por area',
                details: error.message
            })
        }
    }

    // buscar perfil do usuario logado
    getPerfil = async (req, res) => {
        try {
            // Log para debug
            console.log('Cookies recebidos: ', req.cookies)
            console.log('Token do cookie: ', req.cookies.token)

            const token = req.cookies.token
            if (!token) {
                console.log('Token nao encontrado nos cookies')
                return res.redirect('/login')
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || '5948450547b129b0159379195e4dfb42e617fe8a66fed0c6f27b296f5ae1c2bd389f37ef0386feb3c4c6a3953baee3efc2a2f5b5067b293e58a8f7188dbe36ba')

            const user = await User.findById(decoded.id)
            if (!user) {
                console.log('Usuario não encontrado')
                return res.redirect('/login')
            }

            console.log('Renderizando perfil para usuario: ', user.email)
            return res.render('pages/perfil', { user: user, skillIcons: skillIcons })
        } catch (error) {
            console.error('Erro ao carregar perfil: ', error)
            return res.redirect('/login')
        }
    }

    // Metodo para verificar se o usuário esta autenticado
    checkAuth = async (req, res) => {
        try {
            const token = req.cookies.token
            console.log('Token nos cookies: ', token)
            if (!token) {
                return res.redirect('/login')
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET || '5948450547b129b0159379195e4dfb42e617fe8a66fed0c6f27b296f5ae1c2bd389f37ef0386feb3c4c6a3953baee3efc2a2f5b5067b293e58a8f7188dbe36ba')
            console.log('Token decodificado: ', decoded)

            const user = await User.findById(decoded.id)
            console.log('Usuario autentidado: ', user ? 'Sim' : 'Não')

            if (!user) {
                return res.redirect('/login')
            }
        } catch (error) {
            console.error('Erro na verificacção de autenticação: ', error)
            return null
        }
    }

    // Metodo para exibir dados no formulario de edição
    showEditForm = async (req, res) => {
        try {
            const user = await User.findById(req.userId)
            if (!user) {
                return res.redirect('/login')
            }


            const formattedBirthDate = user.birthDate.toISOString().split('T')[0]

            res.render('pages/user-edit', {
                user: {
                    ...user.toObject(),
                    birthDate: formattedBirthDate
                },
                error: null,
                sucess: null
            })
        } catch (error) {
            console.error('Erro ao carregar formulário de edição: ', error)
            res.redirect('/perfil')
        }
    }

    // Metodo para editar o perfil
    updateProfile = async (req, res) => {
        try {
            const {
                name,
                email,
                github,
                area,
                about,
                photoUrl,
                skills,
                currentPassword,
                newPassword
            } = req.body
            const userId = req.user.id
            const user = await User.findById(req.userId)

            console.log('Dados recebidos: ', req.body)
            console.log('Id do usuario: ', userId)

            if (!user) {
                return res.render('pages/user-edit', {
                    user: req.body,
                    error: 'Usuário não encontrado',
                    sucess: null
                })
            }

            // Verifica se o email ja existe (se foi alterado)
            if (email && email !== user.email) {
                const existingUser = await User.findById({ email: email })
                if (existingUser && existingUser._id.toString() !== userId) {
                    return res.render('pages/user-edit', {
                        user: { ...req.body },
                        error: 'Este email já está em uso',
                        sucess: null
                    })
                }
            }
            // Verifica se forneceu uma senha nova
            if (currentPassword && newPassword) {
                const isValidPassword = await bcrypt.compare(currentPassword, user.password)
                if (!isValidPassword) {
                    return res.render('pages/user-edit', {
                        user: {
                            ...req.body,
                            birthDate
                        },
                        error: 'Senha atual incorreta',
                        sucess: null
                    })
                }
                const salt = await bcrypt.genSalt(10)
                user.password = await bcrypt.hash(newPassword, salt)
            }

            // Atualiza os outros campos
            user.name = name
            user.email = email
            user.github = github
            user.area = area
            user.about = about
            user.photoUrl = photoUrl
            user.skills = skills
            await user.save()

            return res.render('pages/user-edit', {
                user: {
                    ...user.dic,
                    currentPassword: '',
                    newPassword: ''
                },
                error: null,
                sucess: 'Perfil atualizado com sucesso!'
            })

        } catch (error) {
            console.error('Erro ao atualizar o perfil: ', error)
            res.render('pages/user-edit', {
                user: req.body,
                error: 'Erro ao atualizar o perfil',
                sucess: null
            })

        }
    }

    viewProfile = async (req, res) => {
        try {
            const userId = req.params.id
            console.log("Buscando usuário com ID:", userId)

            const user = await User.findById(userId)
            console.log("Usuário encontrado: ", user)

            if (!user) {
                console.log("Usuário não encontrado")
                return res.status(404).redirect('/not-found-user')
            }
            res.render('pages/public-profile', { user, skillIcons: skillIcons })

        } catch (error) {
            console.error("Erro ao carregar o perfil: ", error)
            res.status(500).redirect('/')
        }
    }

}

module.exports = new UserController()