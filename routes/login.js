import express, { request, response } from 'express'
const router = express.Router()
import User from '../models/user'
const bcrypt = require('bcrypt')
// import bcrypt from 'bcrypt'
const saltRounds = 10
const jwt = require('jsonwebtoken')

router.post('/', async(request, response) => {
    const body = request.body 
    try {
        
        const userDB = await User.findOne({email: body.email})

        if (! userDB) {
            return response.status(404).json({ message: 'Email not found' })
        }

        if (! bcrypt.compareSync(body.password, userDB.password)) {
            return response.status(400).json({ message: 'Incorrect Email or password' })
        }

        const token = jwt.sign({
            data: userDB
        }, 'fizzbuzz', { expiresIn: 60 * 60 * 24 * 30 });

        return response.json({
            userDB,
            token
        })

    } catch (error) {
        return response.status(400).json({
            message: 'Whoops there is an error',
            error
        })
    }
})

module.exports = router