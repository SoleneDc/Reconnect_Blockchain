var express = require('express')
var jwt = require('jsonwebtoken')

var Agent = require('../models/agent')
var authManager = require('../utils/authManager')
var helpers = require('../utils/helpers')
var config = require('../../config')

var router = express.Router()

// This file contains the route for /api/auth
// This route is open (no authentication required)

router.route('/')

    // To authenticate an agent. Returns a token if all goes well
    .post(function (req, res) {
        if (req.body.shortName && req.body.password) {
            Agent.findOne({
                shortName: req.body.shortName
            }, function (err, agent) {
                if (err) { res.json({ success: false, error: err }) }
                else if (agent === null) { res.json({ success: false, message: 'Authentication failed. Agent not found.' }) }
                else {
                    var pwdHash = helpers.hash(req.body.password)
                    if (agent.pwdHash != pwdHash) {
                        res.json({ success: false, message: 'Authentication failed. Wrong password.' })
                    } else {
                        var token = jwt.sign({ agent: agent.shortName }, config.secret, {expiresIn: "2 days"})
                        res.json({ success: true, message: 'Authentication successful!', token: token })
                    }
                }
            })
        } else {
            res.json({ success: false, message: 'You have to provide a shortName and a password.' })
        }
    })

module.exports = router