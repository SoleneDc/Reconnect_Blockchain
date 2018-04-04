const fs = require('fs')
const request = require('request')

const config = require('../../config').datatrust
const apiUrl = config.baseUrl
const agent = require('../models/agent.js')
const authManager = require('../utils/authManager')


function createUser(email, password) {
    var url = apiUrl + '/user'
    var hash = authManager.hash(password)
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
        var hash = authManager.hash(buffer)
        var url = config.baseUrl + '/stamp'
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
        var hash = authManager.hash(buffer)
        var url = config.baseUrl + '/stamp'
        var qs = { api_key: agent.apiKey }
        var formData = { digest: hash }
        request.get({ url: url, qs: qs, formData: formData, json: true }, function (err, resp, body) {
            if (err) { resolve({ success: false, error: err }) }
            else {
                resolve({ success: true, result: body[0].status })
            }
        })
    })
}

module.exports = {
    createUser: createUser,
    stamp: stamp,
    verify: verify
}
