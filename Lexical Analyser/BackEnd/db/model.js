const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = mongoose.Schema({
    email:{
        type:String,
        size:4,
        required:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        size:5,
        required:true,
    }
})

userSchema.pre('save',async function(next){
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password,salt)
        this.password = hashedPassword
        next()
    }catch(err){
        next(err)
    }
})

userSchema.methods.isValidPassword = async function(password){
    try{
        return await bcrypt.compare(password,this.password)
    }catch(err){
        throw err
    }
}

const userModel = mongoose.model('user',userSchema)
module.exports = userModel