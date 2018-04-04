var express = require('express')
var router = express.Router()

var Stamping = require('../models/stamping')
var authManager = require('../utils/authManager')


router.use(function (req, res, next) {
    authManager.requireReconnectAuth(req, res, next)
})

router.route('/')
    // Get all the stampings in our DB
    .get(function (req, res) {
        Stamping.find(
            {},
            function (err, stampings) {
                if (err) { res.status(err.statusCode || 500).json(err) } else {
                    res.json(stampings)
                }
            })
    })
    // Delete all the stampings in our DB
    .delete(function (req, res) {
        Stamping.remove(
            {},
            function (err) {
                if (err) { res.status(err.statusCode || 500).json(err) }
                else {
                    res.json({ message: 'All stampings deleted!' })
                }
            }
        )
    })

module.exports = router