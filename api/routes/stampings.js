var Stamping = require('../models/stamping')
var Agent = require('../models/agent')
var express = require('express')
var router = express.Router()
var otsManager = require('../utils/otsManager')


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


router.route('/:namespace/:userId')
    .post(function (req, res) {
        var stamping = new Stamping()
        if (req.body.file) {
            Agent.findOne(
                { namespace: req.params.namespace },
                function (err, agent) {
                    if (err) { res.status(err.statusCode || 500).json(err) }
                    else if (agent === null) {
                        res.status(400).json({ message: 'No corresponding agent was found.' })
                    }
                    else {
                        stamping.agentId = agent._id
                        stamping.userId = req.params.userId
                        stamping.fileName = req.body.fileName // TODO : Récupérer le vrai nom du fichier
                        otsManager.stamp('README.md').then(function (r) {
                            if (r.success) {
                                stamping.otsFile = r.otsFile
                                stamping.save(function (err) {
                                    if (err) { res.status(err.statusCode || 500).json(err) }
                                    else {
                                        res.json({
                                            message: 'Your stamping of ' + stamping.fileName
                                            + ' has been created with id ' + stamping._id
                                            + ' by ' + agent.name,
                                            otsResult: r.result
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


router.route('/:namespace/:userId/verify')
    .post(function (req, res) {
        if (req.body.file) {
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
                            fileName: req.body.fileName // TODO : Récupérer le vrai nom du fichier
                        }, function (err, stamping) {
                            if (err) { res.status(err.statusCode || 500).json(err) }
                            else if (stamping === null) {
                                res.status(404).json({ message: 'No corresponding stamping was found.' })
                            }
                            else {
                                otsManager.verify('README.md', stamping.otsFile).then(function (r) {
                                    if (r.success) {
                                        res.json({
                                            message: 'Your stamping of ' + stamping.fileName  + ' is verified.',
                                            otsResult: 'The result is : ' + r.result
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