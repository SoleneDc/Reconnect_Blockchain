var Stamping = require('../models/stamping');
var express = require('express');
var router = express.Router();

router.route('/')
    .post(function (req, res) {
        if (req.body.agent) {
            var stamp = new StampingShema()
            stamp.agent = req.body.agent
            stamp.user_id = req.body.user_id
            stamp.doc_name = req.body.doc_name
            stamp.ots_file = req.body.ots_file
            stamp.save(function (err) {
                if (err) {
                    res.send(err)
                } else {
                    //envoie le fichier pdf??
                    res.json({ message: 'Your stamp of ' + stamp.doc_name + ' has been created with id ' + stamp._id + 'by' + stamp.agent'!' })
                }
            })
        }
        else {
            res.json({ message: 'You have to provide a name.' })
        }
    })
