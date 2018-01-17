var Stamping = require('../models/stamping');
var Agent = require('../models/agent');
var express = require('express');
var router = express.Router();
var otsManager = require('../utils/otsManager')

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


router.route('/:namespace/:userId')
    .get(function (req, res) {
        Agent.findOne(
            { namespace: req.params.namespace },
            function (err, agent) {
                if (err) { res.send(err) } else {
                    Stamping.findOne({
                        agentId: agent._id,
                        userId: req.params.userId
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
                stamping.agentId = agent._id
                stamping.userId = req.params.userId
                stamping.docName = req.body.docName
                stamping.otsFile = req.body.otsFile
                stamping.save(function (err) {
                    if (err) { res.send(err) } else {
                        res.json({ message:
                            'Your stamping of ' + stamping.docName
                            + ' has been created with id ' + stamping._id
                            + ' by ' + agent.name
                            + '.\n Stamping on OTS started. '})
                        otsManager.stamp('README.md')
                    }
                })

            }
        })
    })


router.route('/:namespace/:userId/verify')
    .post(function (req, res) {
        var docName = req.body.docName
        var otsFile = req.body.otsFile
        var fileToVerify = req.body.fileToVerify
        Agent.findOne(
            { namespace: req.params.namespace },
            function (err, agent) {
                if (err) { res.send(err) } else {
                    Stamping.findOne({
                        agentId: agent._id,
                        userId: req.params.userId
                    }, function (err, stamping) {
                        if (err) { res.send(err) } else {
                            console.log('nous appelons ici la fonction verify')
                        }
                    })
                }
            })
    })



module.exports = router