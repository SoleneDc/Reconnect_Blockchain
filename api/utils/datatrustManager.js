const fs = require('fs')
const request = require('request')

const config = require('../../config').datatrust
const apiUrl = config.baseUrl
const agent = require('../models/agent.js')
const authManager = require('../utils/authManager')
const helpers = require('../utils/helpers')

// This file contains all functions interacting with Datatrust

// Create a new Agent on Datatrust
function createUser(email, password) {
    return new Promise(function (resolve) {
        var url = apiUrl + '/user'
        var formData = {
            email: email,
            pwd_digest: helpers.hash(password)
        }

        request.post({ url: url, formData: formData, json: true }, function (err, resp, body) {
            if (err) { resolve('Upload failed.\n', err) }
            else { resolve(body) }
        })
    })
}

// Edit user email on Datatrust for a given agent
function editUserEmail(email, agent) {
    return new Promise(function (resolve) {
        var url = apiUrl + '/user/email'
        var formData = { new_email: email }
        var qs = { api_key: agent.apiKey }

        request.post({ url: url, qs: qs, formData: formData, json: true }, function (err) {
            if (err) { resolve({ success: false, error: err }) }
            else { resolve({ success: true }) }
        })
    })
}

// Edit user password on Datatrust for a given agent
function editUserPwd(password, agent) {
    return new Promise(function (resolve) {
        var url = apiUrl + '/user/password'
        var formData = { new_pwd_digest: helpers.hash(password) }
        var qs = { api_key: agent.apiKey }

        request.post({ url: url, qs: qs, formData: formData, json: true }, function (err) {
            if (err) { resolve({ success: false, error: err }) }
            else { resolve({ success: true }) }
        })
    })
}

// Stamp a file on Datatrust
var stamp = function (buffer, agent) {
    return new Promise(function (resolve) {
        var hash = helpers.hash(buffer)
        var url = config.baseUrl + '/stamp'
        var qs = { api_key: agent.apiKey }
        var formData = { digest: hash }
        request.post({ url: url, qs: qs, formData: formData, json: true }, function (err) {
            if (err) { resolve({ success: false, error: err }) }
            else { resolve({ success: true, hash: hash }) }
        })
    })
}

// Use the Datatrust service to verify if a file is stamped on the blockchain.
var verify = function (buffer, agent) {
    return new Promise(function (resolve) {
        var url = config.baseUrl + '/stamp'
        var qs = { api_key: agent.apiKey }
        var formData = { digest: helpers.hash(buffer) }
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
    editUserEmail: editUserEmail,
    editUserPwd: editUserPwd,
    stamp: stamp,
    verify: verify
}
