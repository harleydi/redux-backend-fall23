const User = require('../model/User')
const bcrypt = require('bcrypt')

const saltRounds = 10

const createUser = async (params) => {
    let hashedPassword = await hashPassword(params.password)
    let newUser = new User({
        email: params.email,
        password: hashedPassword,
        firstname: params.firstname,
        lastname: params.lastname
    })
    return newUser
}

const hashPassword = (password) => {
    let hashedPassword = bcrypt.hash(password, saltRounds)
    return hashedPassword
}

const comparePasswords = (inputPassword, dbPassword) => bcrypt.compare(inputPassword, dbPassword)



module.exports = {
    createUser,
    hashPassword,
    comparePasswords
}