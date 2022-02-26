const express = require('express')
const News = require('../models/news')
const router = new express.Router()
const auth = require('../middleware/auth')


//posting news
router.post('/news', auth, async(req, res) => {
    try {

        const news = await new News({...req.body, author: req.reporter._id })
        await news.save()
        res.status(200).send(news)
    } catch (error) {
        res.status(404).send(error)
    }
})


// Update News

router.patch('/news/:id', auth, async(req, res) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if (!news) {
            res.status(404).send('Unpublished news')
        }
        res.status(200).send(news)

    } catch (error) {
        res.status(404).send(error)
    }
})

//Get news by id

router.get('/news/:id', auth, async(req, res) => {
    try {
        const news = await News.findById(req.params.id)
        if (!news) {
            return res.status(404).send('Unpublished News')
        }
        res.status(200).send(news)
    } catch (error) {
        res.status(404).send(error)
    }
})

//Delete News

router.delete('/news/:id', auth, async(req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id)
        if (!news) {
            res.status(404).send(news)
        }
        res.status(200).send(news)
    } catch (error) {
        res.status(404).send(error)
    }
})







module.exports = router