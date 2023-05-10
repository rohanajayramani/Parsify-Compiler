const mongoose = require('../db/config')
const userModel = require('../db/model')
const createError = require('http-errors')
let chainLexer = require('chain-lexer')
const { authSchema } = require('../helpers/validation_schema')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwtHelper')

module.exports = {
    //handle all routes here
    register: async (req,res,next)=>{
        console.log('REGISTER REQUEST ....')
        try{
            const result = await authSchema.validateAsync(req.body)

            const emailDoesExist = await userModel.findOne({email:result.email})
            if(emailDoesExist) throw createError.Conflict(`${result.email} is already been registered`)

            const user = new userModel(result)
            const savesUser = await user.save()
            const accessToken = await signAccessToken(savesUser.id)
            const refreshToken = await signRefreshToken(savesUser.id)
            res.send({accessToken, refreshToken})

        }catch(err){
            if(err.isJoi === true) err.status = 422
            next(err)
        }
    },
    login: async (req,res,next)=>{
        console.log('LOGIN REQUEST ....')
        try{
            const result = await authSchema.validateAsync(req.body)
            const user = await userModel.findOne({email:result.email})
            if(!user) throw createError.NotFound('User not registered')
            const isMatch = await user.isValidPassword(result.password)
            if(!isMatch) throw createError.Unauthorized('Invalid Email/Password')
            const accessToken = await signAccessToken(user.id)
            const refreshToken = await signRefreshToken(user.id)
            res.send({accessToken, refreshToken})
        }catch(err){
            if(err.isjoi === true) return(createError.BadRequest('Invalid Email/Password'))
            next(err)
        }
    },
    refreshToken: async (req,res,next)=>{
        console.log('REFRESH-TOKEN REQUEST ....')
        try{
            const {refToken} = req.body.refreshToken
            if(!refToken)throw createError.BadRequest()
            const userId = await verifyRefreshToken(refToken)

            const accessToken = await signAccessToken(userId)
            const refreshToken = await signRefreshToken(userId)
            res.send({accessToken, refreshToken})
        }catch(err){
            next(err)
        }
    },
    logout: async (req,res,next)=>{
        console.log('LOGOUT REQUEST ....')
        try{
            const {refreshToken} = req.body
            if(!refreshToken)throw createError.BadRequest()
            const userId = await verifyRefreshToken(refreshToken)
            
            client.DEL(userId, (err, value)=>{
                if(err){
                    console.log(err)
                    throw createError.InternalServerError()
                }
                console.log(value)
                res.sendStatus(204)
            })
        }catch(err){
            next(err)
        }
    },
    output: async (req,res,next)=>{
        console.log('OUTPUT REQUEST ....')
        let lexer = chainLexer.cLexer
        let stream = req.body.input
        console.log(stream)
        console.log('\n\n')
        lexer.start(stream)
        let outputCode = lexer.DFA.result.tokens
        console.log(outputCode)
        res.status(200).send({outputCode})
    }

}