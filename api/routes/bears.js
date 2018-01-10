var Bear = require('../models/bear');
var express = require('express');
var router = express.Router();


router.route('/')
    .get(function (req, res) {
        Bear.find(
            {},
            function (err, bears) {
                if (err) {
                    res.send(err)
                } else {
                    res.json(bears)
                }
            })
    })
    .post(function (req, res) {
        if (req.body.name) {
            var bear = new Bear()
            bear.name = req.body.name
            bear.save(function (err) {
                if (err) {
                    res.send(err)
                } else {
                    res.json({ message: 'Your bear ' + bear.name + ' has been created with id ' + bear._id +'!' })
                }
            })
        }
        else {
            res.json({ message: 'You have to provide a name.' })
        }
    })

router.route('/:bear_id')
    .get(function (req, res) {
        Bear.findById(
            req.params.bear_id,
            function (err, bear) {
                if (err) {
                    res.send(err)
                } else {
                    res.json(bear)
                }
            })
    })
    .put(function (req, res) {
        Bear.findById(
            req.params.bear_id,
            function (err, bear) {
                if (err) {
                    res.send(err)
                } else {
                    if (req.body.name) {
                        bear.name = req.body.name
                        bear.save(function (err) {
                            if (err) {
                                res.send(err)
                            } else {
                                res.json({
                                    message: 'Your bear ' + bear.name + ' has been updated!',
                                    bear: bear
                                })
                            }
                        })
                    } else {
                        res.json({ message: 'You have to provide a name.' })
                    }
                }
            })
    })
    .delete(function (req, res) {
        Bear.remove(
            { _id: req.params.bear_id },
            function (err, bear) {
                if (err) {
                    res.send(err)
                } else {
                    res.json({ message: 'Bear deleted!' })
                }
            })
    })

module.exports = router