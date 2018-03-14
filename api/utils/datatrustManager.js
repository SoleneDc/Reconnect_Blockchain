const crypto = require('crypto')
const fs = require('fs')
const request = require('request')

const config = require('../../config').datatrust
const apiUrl = config.baseUrl
const agent = require('../models/agent.js')


function createUser(email, password) {
    var url = apiUrl + '/user'
    var hasher = crypto.createHash('sha256')
    var hash = hasher.update(password).digest('hex')
    var formData = {
        email: email,
        pwd_digest: hash
    }

    return new Promise(function (resolve) {
        request.post({ url: url, formData: formData, json: true }, function (err, resp, body) {
            if (err) { resolve('Upload failed.\n', err) }
            else { resolve(body) }
        })
    })
}

var stamp = function (buffer, agent) {
    return new Promise(function (resolve) {
        var hash = crypto.createHash('sha256').update(buffer).digest('hex')
        var url = config.baseUrl + '/stamp'
        console.log(agent)
        var qs = { api_key: agent.apiKey }
        var formData = { digest: hash }
        request.post({ url: url, qs: qs, formData: formData, json: true }, function (err) {
            if (err) { resolve({ success: false, error: err }) }
            else { resolve({ success: true, hash: hash }) }
        })
    })
}

var verify = function (buffer, agent) {
    return new Promise(function (resolve) {
        var hash = crypto.createHash('sha256').update(buffer).digest('hex')
        var url = config.baseUrl + '/stamp'
        var qs = { api_key: agent.apiKey }
        var formData = { digest: hash }
        request.get({ url: url, qs: qs, formData: formData, json: true }, function (err, resp, body) {
            if (err) { resolve({ success: false, error: err }) }
            else {
                resolve({ success: true, result: body[0].status })

                // === A ré-activer quand la carte 49 sera effectuée ===
                //
                // Agent.findOne(
                //     { accountId: body[0].account_id },
                //     function (err, agent) {
                //         if (err) { resolve({ success: false, error: err }) }
                //         else if (agent === null) {
                //             resolve({success: false, error: 'No corresponding agent was found.'})
                //         }
                //         else if (agent.apiKey === qs.apiKey) {
                //             resolve({ success: true, result: body.array[0].status })
                //         }
                //     })
            }
        })
    })
}

module.exports = {
    createUser: createUser,
    stamp: stamp,
    verify: verify
}