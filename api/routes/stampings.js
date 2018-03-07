const fs = require('fs')
const crypto = require('crypto')

var express = require('express')
var router = express.Router()

var multer  = require('multer')
var storage = multer.memoryStorage()
var mult = multer({ storage: storage })

var Stamping = require('../models/stamping')
var Agent = require('../models/agent')
var dtManager = require('../utils/datatrustManager')


router.route('/')
    .get(function (req, res) {
        Stamping.find(
            {},
            function (err, stampings) {
                if (err) { res.status(err.statusCode || 500).json(err) } else {
                    res.json(stampings)
                }
            })
    })
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


router.route('/:namespace/:userId/:fileName')
    .get(function (req, res) {
        Agent.findOne(
            { namespace: req.params.namespace },
            function (err, agent) {
                if (err) { res.status(err.statusCode || 500).json(err) }
                else if (agent === null) {
                    res.status(404).json({ message: 'No corresponding agent was found.' })
                }
                else {
                    Stamping.findOne({
                        agentId: agent._id,
                        userId: req.params.userId,
                        fileName: req.params.fileName
                    }, function (err, stamping) {
                        if (err) { res.status(err.statusCode || 500).json(err) }
                        else if (stamping === null) {
                            res.status(404).json({ message: 'No corresponding stamping was found.' })
                        }
                        else {
                            res.json(stamping)
                        }
                    })
                }
            })
    })
    .delete(function (req, res) {
        Agent.findOne(
            { namespace: req.params.namespace },
            function (err, agent) {
                if (err) { res.status(err.statusCode || 500).json(err) }
                else if (agent === null) {
                    res.status(404).json({ message: 'No corresponding agent was found.' })
                }
                else {
                    Stamping.remove({
                        agentId: agent._id,
                        userId: req.params.userId,
                        fileName: req.params.fileName
                    }, function (err, stamping) {
                        if (err) { res.status(err.statusCode || 500).json(err) }
                        else if (stamping === null) {
                            res.status(404).json({ message: 'No corresponding stamping was found.' })
                        }
                        else {
                            res.json({ message: 'Stamping of ' + req.params.fileName + ' was deleted.' })
                        }
                    })
                }
            })
    })


router.route('/:shortName/:userId/stamp')
    .post(mult.single('file'), function (req, res) {
        var stamping = new Stamping()
        if (req.file) {
            Agent.findOne(
                { shortName: req.params.shortName },
                function (err, agent) {
                    if (err) { res.status(err.statusCode || 500).json(err) }
                    else if (agent === null) {
                        res.status(400).json({ message: 'No corresponding agent was found.' })
                    }
                    else {
                        stamping.agentId = agent._id
                        stamping.userId = req.params.userId
                        stamping.fileName = req.file.originalname
                        dtManager.stamp(req.file.buffer).then(function (r) {
                            if (r.success) {
                                stamping.hashFile = r.hash
                                console.log(stamping)
                                stamping.save(function (err) {
                                    if (err) { res.status(err.statusCode || 500).json(err) }
                                    else {
                                        res.json({
                                            message: 'Your stamping of ' + stamping.fileName
                                            + ' has been created with id ' + stamping._id
                                            + ' by ' + agent.fullName
                                        })
                                    }
                                })
                            }
                            else {
                                res.json(r.error)
                            }
                        })
                    }
                })
        }
        else {
            res.status(400).json({ message: 'You have to provide a file.' })
            // TODO : Améliorer cette gestion d'exception, notamment si le fichier n'est pas au bon format
        }
    })


router.route('/:shortName/:userId/verify')
    .post(mult.single('file'), function (req, res) {
        if (req.file) {
            Agent.findOne(
                { shortName: req.params.shortName },
                function (err, agent) {
                    if (err) { res.status(err.statusCode || 500).json(err) }
                    else if (agent === null) {
                        res.status(404).json({ message: 'No corresponding agent was found.' })
                    }
                    else {
                        Stamping.findOne({
                            agentId: agent._id,
                            userId: req.params.userId,
                            hashFile: crypto.createHash('sha256').update(req.file.buffer).digest('hex')
                        }, function (err, stamping) {
                            if (err) { res.status(err.statusCode || 500).json(err) }
                            else if (stamping === null) {
                                res.status(404).json({ message: 'No corresponding stamping was found.' })
                            }
                            else {
                                dtManager.verify(req.file.buffer).then(function (r) {
                                    if (r.success) {
                                        res.json({
                                            message: 'Your stamping of ' + stamping.fileName  + ' is verified.',
                                            result: 'The result is : ' + r.result
                                        })
                                    } else {
                                        res.json(r.error)
                                    }
                                })
                            }
                        })
                    }
                })
        } else {
            res.status(400).json({ message: 'You have to provide a file. '})
            // TODO : Améliorer cette gestion d'exception, notamment si le fichier n'est pas au bon format
        }
    })


module.exports = router