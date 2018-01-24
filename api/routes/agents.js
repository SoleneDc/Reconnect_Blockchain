var Agent = require('../models/agent');
var express = require('express');
var router = express.Router();


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
        if (req.body.name && req.body.namespace) {
            var agent = new Agent()
            agent.name = req.body.name
            agent.namespace = req.body.namespace
            agent.save(function (err) {
                if (err) { res.status(err.statusCode || 500).json(err) } else {
                    res.json({ message: 'Your agent ' + agent.name + ' has been created with id ' + agent._id +'!' })
                }
            })
        }
        else {
            res.json({ message: 'You have to provide a name and a namespace.' })
        }
    })


module.exports = router