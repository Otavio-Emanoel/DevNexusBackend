const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        console.log('Conexão teste bem sucedida')

        // cria um documento teste

        const User = require('../src/models/User')
        const testUser = await User.create({
            name: 'Teste Usuario',
            email: "teste@gmail.com",
            password: '123456',
            birthDate: new Date('2000-01-01'),
            area: 'frontend',
            github: 'https://github.com/testuser',
            about: 'Teste de conexão com o banco de dados',
            photoUrl: 'https://avatars.githubusercontent.com/u/180762238?s=48&v=4',
            gender: 'masculino',
            skills: ['javascript', 'react']
        })
        console.log('Usuário de teste criado com sucesso: ', testUser)

    } catch (error) {
        console.error('Erro: ', error.message)
        if (error.errors) {
            Object.keys(error.errors).forEach(field => {
                console.error(`Erro no campo ${field}: `, error.errors[field].message)
            })
        }
    } finally {
        await
            mongoose.connection.close()
        console.log('Conexão fechada')
        process.exit()
    }
}

testConnection()
