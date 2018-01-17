var Stamping = require('../models/stamping');
var Agent = require('../models/agent');
var express = require('express');
var router = express.Router();


router.route('/')
    .get(function (req, res) {
        Stamping.find(
            {},
            function (err, stampings) {
                if (err) { res.send(err) } else {
                    res.json(stampings)
                }
            })
    })


router.route('/:namespace/:user_id')
    .get(function (req, res) {
        Agent.findOne(
            { namespace: req.params.namespace },
            function (err, agent) {
                if (err) { res.send(err) } else {
                    Stamping.findOne({
                        agent: agent._id,
                        user_id: req.params.user_id
                    }, function (err, stamping) {
                        if (err) { res.send(err) } else {
                            res.json(stamping)
                        }
                    })
                }
            })
    })
    .post(function (req, res) {
        var stamping = new Stamping()
        Agent.findOne({ namespace: req.params.namespace }, function (err, agent) {
            if (err) { res.send(err) } else {
                stamping.agent = agent._id
                stamping.user_id = req.params.user_id
                stamping.doc_name = req.body.doc_name
                stamping.ots_file = req.body.ots_file
                stamping.save(function (err) {
                    if (err) { res.send(err) } else {
                        res.json({ message: 'Your stamp of ' + stamping.doc_name + ' has been created with id ' + stamping._id + ' by ' + agent.name })
                    }
                })

            }
        })
    })


module.exports = router