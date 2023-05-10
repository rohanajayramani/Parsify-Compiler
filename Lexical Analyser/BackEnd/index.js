const express = require('express')
const userRoutes = require('./routes/auth.routes')
const createError = require('http-errors')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 3000

const app = express()
app.use(cors())
app.use(express.json())

app.get('/',async (req,res)=>{res.send('SERVER IS RUNNING....')})
app.use('/auth', userRoutes)

app.use(async (req,res,next)=>{
  next(createError.NotFound('Router does not exist'))
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
