var crypto = require('crypto')
var express = require('express')
var router = express.Router()

var Agent = require('../models/agent')
var dtManager = require('../utils/datatrustManager')
var authManager = require('../utils/authManager')


router.use(function (req, res, next) {
    authManager.requireReconnectAuth(req, res, next)
})

router.route('/')
    .get(function (req, res) {
        Agent.find(
            {},
            function (err, agents) {
                if (err) { res.status(err.statusCode || 500).json(err) } else {
                    res.json(agents)
                }
            })
    })
    .post(function (req, res) {
        if (req.body.fullName && req.body.shortName && req.body.email && req.body.password) {
            var agent = new Agent()
            agent.fullName = req.body.fullName
            agent.shortName = req.body.shortName
            agent.email = req.body.email
            agent.pwdHash = crypto.createHash('sha256').update(req.body.password).digest('hex')
            dtManager.createUser(req.body.email, req.body.password).then(function (r) {
                if (r.message) {
                    res.json({ message: r.message })
                }
                if (r.api_key) {
                    agent.apiKey = r.api_key
                    agent.save(function (err) {
                        if (err) { res.status(err.statusCode || 500).json(err) } else {
                            res.json({ message: 'Your agent ' + agent.fullName + ' has been successfully created with short name ' + agent.shortName +'.' })
                        }
                    })
                }
                else {
                    res.json({ err: r.error })
                }
            })
        }
        else {
            res.json({ message: 'You have to provide a fullName, a shortName, an email and a password.' })
        }
    })
    .delete(function (req, res) {
        Agent.remove(
            {},
            function (err) {
                if (err) { res.status(err.statusCode || 500).json(err) }
                else {
                    res.json({ message: 'All agents deleted!' })
                }
            }
        )
    })


module.exports = router