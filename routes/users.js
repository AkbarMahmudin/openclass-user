const express = require('express')
const router = express.Router()

const UserService = require('../app/service/UserService')
const UserController = require('../app/controller/UserController')

const { postValidator, putValidator } = require('../app/utils/validator/UserValidator')
const userService = new UserService()
const userController = new UserController(userService)

router.get('/', userController.getUser)
router.get('/:id', userController.getUser)
router.post('/', postValidator, userController.createUser)
router.post('/auth', userController.createAuthentication)

router.put('/:id', putValidator, userController.updateUser)

module.exports = router
