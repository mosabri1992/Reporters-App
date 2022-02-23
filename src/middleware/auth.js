const jwt = require('jsonwebtoken')
const Reporter = require('../models/reporters')
const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, 'nodecourse')
        const reporter = await Reporter.findOne({ _id: decode._id, tokens: token })
        if (!reporter) {
            throw new Error('Unauthorized action')
        }
        req.reporter = reporter
        req.token = token
        next()
    } catch (error) {
        res.status(404).send({ error: 'Unauthorized' })
    }

}

module.exports = auth