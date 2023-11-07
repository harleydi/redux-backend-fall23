const User = require('../model/User')
const jwt = require('jsonwebtoken')
const { createUser, comparePasswords } = require('./userHelper')


module.exports = {
    register: async (req, res) => {
        try {
            // check if email has a value
            if (!req.body.email) {
                throw {
                    status: 401,
                    message: 'No User submitted'
                }
            }
            // if user exists throw an error
            let foundUser = await User.findOne({email: req.body.email})
            if (foundUser) { 
                throw {
                    status: 409,
                    message: 'User Exists'
                }
            }
            
            let newUser = await createUser(req.body)

            let savedUser = await newUser.save()

            res.status(200).json({
                email: savedUser.email,
                firstname: savedUser.firstname,
                lastname: savedUser.lastname,
                message: "Successfully Registered"
                //token
            })

        } catch (error) {
            res.status(error.status || 500 ).json(error.message)
        }
    },
    login: async (req, res) => {
        try {
            // check if the user exists / get the user from the db
            let foundUser = await User.findOne({email: req.body.email})
            if (!foundUser) {
                throw {
                    status: 404,
                    message: "User Not Found"
                }
            }

            // check if the password matches
            let checkedPassword = await comparePasswords(req.body.password, foundUser.password)

            if (!checkedPassword) {
                throw {
                    status: 401,
                    message: "Invalid Password"
                }
            }

            // res.status(200).json({
            //     userObj: {
            //         email: foundUser.email,
            //         firstname: foundUser.firstname,
            //         lastname: foundUser.lastname,
            //     },                
            //     message: "Successful Login!"
            // })
            
            // payload should be a unique key to look up user in the DB
            let payload = {
                id: foundUser._id,
                // email: founderUser.email
            }

            //expiration like banking sites, will expire after 15 mins, unless remember box is checked.
            let expiration = new Number
            if (req.body.isRemember) {
                expiration = 60*60*24*7
            } else {
                expiration = 60 * 15
            }

            let token = await jwt.sign(payload, process.env.SUPER_SECERT_KEY, {expiresIn: expiration})

            res.status(200).json({
                email: foundUser.email,
                firstname: foundUser.firstname,
                lastname: foundUser.lastname,                   
                message: "Successful Login!",
                token: token
            })

            
        } catch (error) {
            res.status(error.status || 500 ).json(error.message)
        }
    },
    authtoken: async (req,res) => {
        try {
            // console.log(req.decoded.id)
            let foundUser = await User.findById(req.decoded.id)

            //set token to orginal
            let token = req.token

            //or set token to null if only sending new token
            // let token = null
            
            // you can re-issue the token to reset your expiration time.
            // if the time till expiration is less than 15, reissue a token    
            if (req.decoded.exp < (Math.floor(new Date().getTime() / 1000) + 60*15)) {
                console.log("Expired!")
                let payload = { 
                                id: foundUser._id
                              }
                token = await jwt.sign(payload, process.env.SUPER_SECERT_KEY, {expiresIn: 60 * 15})
            }

            res.status(200).json({
                email: foundUser.email,
                firstname: foundUser.firstname,
                lastname: foundUser.lastname,                   
                message: "Successful Login!",
                token: token
            })
        
            
        } catch (error) {
            res.status(error.status || 500 ).json(error.message)
        }
    }
}