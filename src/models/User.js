const mongoose = require('mongoose')

const areaOptions = [
    'frontend',
    'backend',
    'fullstack'
]

const genderOptions = [
    'masculino',
    'feminino',
    'prefiro não dizer'
]

const skillOptions = [
    'javascript',
    'java',
    'nodejs',
    'mysql',
    'typescript',
    'react',
    'php',
    'python',
    'gml',
    'csharp',
    'cpp',
    'go',
    'kotlin',
    'ruby'
]

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor, use um email válido']
    },
    password: {
        type: String,
        required: [true, 'Senha é obrigatória'],
        minlength: [6, 'A senha deve ter no mínimo 6 caracteres']
    },
    birthDate: {
        type: Date,
        required: [true, 'Data de nascimento é obrigatória']
    },
    area: {
        type: String,
        required: [true, 'A área é obrigatória'],
        enum: areaOptions,
        lowercase: true
    },
    github: {
        type: String,
        trim: true,
        match: [
            /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+$/,
            'Por favor, forneça um link válido do GitHub'
        ]
    },
    about: {
        type: String,
        trim: true,
        maxlength: [500, 'O texto sobre você deve ter no máximo 500 caracteres']
    },
    photoUrl: {
        type: String,
        trim: true,
        default: 'images/DevNexus.png'
    },
    gender: {
        type: String,
        required: [true, 'Gênero é obrigatório'],
        enum: genderOptions,
        lowercase: true
    },
    skills: [{
        type: String,
        enum: skillOptions,
        lowercase: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Metodo para não retornar a senha em consultas

userSchema.methods.toJSON = function() {
    const user = this.toObject()
    delete user.password
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User;