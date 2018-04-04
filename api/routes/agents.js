var express = require('express')
var router = express.Router()

var Agent = require('../models/agent')
var Stamping = require('../models/stamping')
var dtManager = require('../utils/datatrustManager')
var authManager = require('../utils/authManager')
var helpers = require('../utils/helpers')


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
            helpers.uniqueAgent(req.body.shortName, req.body.email, Agent()).then(function (r) {
                if (r) {
                    var agent = new Agent()
                    agent.fullName = req.body.fullName
                    agent.shortName = req.body.shortName
                    agent.email = req.body.email
                    agent.pwdHash = helpers.hash(req.body.password)
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
                            res.status(500).json({ err: r.error })
                        }
                    })
                } else {
                    res.status(400).json({ message: 'The email or shortName you provided has already been taken.'})
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

router.route('/:agentId')
    .put(function (req, res) {
        if (req.body.shortName && req.body.fullName && req.body.password && req.body.email) {
            Agent.findOne(
                { _id: req.params.agentId },
                function (err, agent) {
                    if (err) { res.status(err.statusCode || 500).json(err) }
                    else if (agent === null) { res.status(404).json({ message: 'No corresponding agent has been found.' }) }
                    else {
                        helpers.uniqueAgent(req.body.shortName, req.body.email, agent).then(function (r) {
                            if (r) {
                                if (agent.email != req.body.email) {
                                    dtManager.editUserEmail(req.body.email, agent).then(function (r) {
                                        if (!r.success) { res.json(err) }
                                    })
                                }
                                if (agent.pwdHash != helpers.hash(req.body.password)) {
                                    dtManager.editUserPwd(req.body.password, agent).then(function (r) {
                                        if (!r.success) { res.json(err) }
                                    })
                                }
                                Agent.update(
                                    { _id: req.params.agentId },
                                    {
                                        shortName: req.body.shortName,
                                        fullName: req.body.fullName,
                                        pwdHash: helpers.hash(req.body.password),
                                        email: req.body.email
                                    },
                                    function (err, raw) {
                                        if (err) { res.status(err.statusCode || 500).json(err) }
                                        else { res.json({ message: 'Agent updated!' }) }
                                    }
                                )
                            } else {
                                res.json({ message: 'The email or shortName you provided has already been taken.' })
                            }
                        })
                    }
                }
            )
        } else {
            res.status(400).json({ message: 'Please enter a shortName, a fullName, a password and an email.' })
        }
    })
    .delete(function (req, res) {
        Agent.remove(
            { _id: req.params.agentId },
            function (err, raw) {
                if (err) { res.status(err.statusCode || 500).json(err) }
                else {
                    Stamping.remove(
                        { agentId: req.params.agentId },
                        function (err) {
                            if (err) { res.status(err.statusCode || 500).json(err) }
                            else {
                                res.json({ message: 'Agent deleted!' })
                            }
                        }
                    )
                }
            }
        )
    })

module.exports = router