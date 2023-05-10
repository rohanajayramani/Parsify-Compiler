const express =require('express')
const router = express.Router()
const userController = require('../controllers/auth.controller')

//create all the routes here
router.post('/register',userController.register)
router.post('/login',userController.login)
router.post('/refreshToken',userController.refreshToken)
router.delete('/logout',userController.logout)
router.post('/output',userController.output)

module.exports = router