const express = require('express')
const Reporter = require('../models/reporters')
const router = new express.Router()
const auth = require('../middleware/auth')

///////signup////////////
router.post('/signup', async(req, res) => {
    try {
        const reporter = await new Reporter(req.body).save()
        const token = await reporter.generateToken()
        res.status(200).send({ reporter, token })
            // console.log(reporter, token)
    } catch (error) {
        res.status(404).send(error.message)
    }
})

/////////signin///////

router.post('/signin', async(req, res) => {
    try {
        const reporter = await Reporter.findByCredentials(req.body.email, req.body.password)
        const token = await reporter.generateToken()
        res.status(200).send({ reporter, token })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

/////////signout//////////////

router.delete('/signout', auth, async(req, res) => {
    try {
        req.reporter.tokens = req.reporter.tokens.filter((reportertoken) => {
            return reportertoken !== req.token
        })
        await req.reporter.save()
        res.status(200).send('Signout Successfully')
    } catch (error) {
        res.status(400).send(error)
    }
})

//////getprofile//////////

router.get('/profile/:id', auth, async(req, res) => {

    try {
        const _id = req.params.id
        const reporter = await Reporter.findById(_id)

        if (!reporter) {
            throw new Error('Invalid ID or token')
        }
        res.status(200).send(reporter)

    } catch (error) {
        res.status(400).send(error.message)
    }

})


module.exports = router