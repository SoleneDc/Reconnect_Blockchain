var crypto = require('crypto')
var express = require('express')
var jwt = require('jsonwebtoken')

var Agent = require('../models/agent')
var config = require('../../config')

var router = express.Router()

router.route('/')
    .post(function (req, res) {
        if (req.body.shortName && req.body.password) {
            Agent.findOne({
                shortName: req.body.shortName
            }, function (err, agent) {
                if (err) { res.json({ success: false, error: err }) }
                else if (agent == null) { res.json({ success: false, message: 'Authentication failed. Agent not found.' }) }
                else {
                    var pwdHash = crypto.createHash('sha256').update(req.body.password).digest('hex')
                    if (agent.pwdHash != pwdHash) {
                        res.json({ success: false, message: 'Authentication failed. Wrong password.' })
                    } else {
                        var token = jwt.sign(agent.shortName, config.secret)
                        res.json({ success: true, message: 'Authentication successful!', token: token })
                    }
                }
            })
        } else {
            res.json({ success: false, message: 'You have to provide a shortName and a password.' })
        }
    })

module.exports = router