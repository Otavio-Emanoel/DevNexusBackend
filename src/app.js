const express = require("express")
const path = require("path")
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const pageRoutes = require('./routes/pageRoutes')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express()

// configura o EJS como view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Define a pasta public para arquivos estaticos E middlewares
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// Middlewere para debug
app.use((req, res, next)=>{
    console.log('Request URL:', req.url)
    console.log('Request Method:', req.method)
    console.log('Request Body:', req.body)
    next()
})

// app.use('/*.ejs', (req, res, next) => {
//     res.status(403).send(
//         '<marquee scrollamount="40">' +
//             '<h1 style="color: red;" >Acesso Negado!</h1>' +
//         '</marquee truespeed="200">')
// })

// userRoutes para a rota raiz
app.use('/', userRoutes)

// pageRoutes para as outras rotas de autenticação
app.use('/', pageRoutes)

// rotas
const PORT = process.env.PORT || 3000

// Conexao Mongoose 

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Conectado ao MongoDB Atlas com sucesso!")
    })

    .catch((error) => {
        console.error('Erro ao conectar ao MongoDB: ', error)
    })

// app.get("/", (req, res) => {
//     res.send("Como voce chegou aqui?")
// })

app.listen(PORT, () => {
    console.log(`TA FUNCIONANDOOOOO, na porta ${PORT}`)
})

module.exports = app