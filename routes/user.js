import express, { request, response } from 'express'
const router = express.Router()
import User from '../models/user'
const bcrypt = require('bcrypt')
const saltRounds = 10
// Filter PUT request fields
const _ = require('underscore');
const {verifyAuth, verifyAdminUser} = require('../middlewares/auth')

// Create a user
router.post('/users', async(request, response) => {

    const body = {
        name: request.body.name,
        email: request.body.email, 
    }

    body.password = bcrypt.hashSync(request.body.password, saltRounds)

    try {
        const userDB = await User.create(body)
        return response.json(userDB)
    } catch (error) {
        return response.status(500).json({
            message: 'Whoops there is an error',
            error
        })
    }
})

// router.put('/users/:id', [verifyAuth, verifyAdminUser], async(request, response) => {
router.put('/users/:id', [verifyAuth], async(request, response) => {
    const id = request.params.id
    const body = _.pick(request.body, ['name', 'email', 'password', 'active'])

    if (request.body.password) {
        body.password = bcrypt.hashSync(request.body.password, saltRounds)
    }
    try {
        const userDB = await User.findByIdAndUpdate(id, body, { new:true, runValidators: true ,  context: 'query' })
        return response.json(userDB)
    } catch (error) {
        return response.status(400).json({
            message: 'Whoops there is an error',
            error
        })
    }
})



module.exports = router;