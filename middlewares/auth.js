const jwt = require('jsonwebtoken')

const verifyAuth = (request, response, next) => {
    
    const token = request.get('token')

    jwt.verify(token, 'fizzbuzz', (error, decoded) => {

        if (error) {
            return response.status(401).json({
                message: 'User not valid or not authorize',
                error
            })
        }

        request.user = decoded.data

        next()
    })
}

const verifyAdminUser = (request, response, next) => {

    const role = request.user.role

    if (role !== 'Admin') {
        return response.status(401).json({
            message: 'User not allowed'
        })
    }
    next()

}

module.exports = {verifyAuth, verifyAdminUser}