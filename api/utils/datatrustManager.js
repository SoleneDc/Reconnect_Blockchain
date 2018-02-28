const crypto = require('crypto')
const fs = require('fs')
const request = require('request')

const config = require('../../config.js').datatrust
const apiUrl = config.baseUrl


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

// createUser('manon@gmail.com','coucou').then(function (r){console.log(r)})


var stamp = function (file) {
    return new Promise(function (resolve) {
        var hasher = crypto.createHash('sha256')
        fs.ReadStream(file).on('data', function (data) {
            var hash = hasher.update(data).digest('hex')
            var url = config.baseUrl + '/stamp'
            var qs = { api_key: config.api_key }
            var formData = { digest: hash }
            request.post({ url: url, qs: qs, formData: formData, json: true }, function (err) {
                if (err) { resolve({ success: false, error: err }) }
                else { resolve({ success: true }) }
            })
        })
    })
}

var verify = function (file) {
    return new Promise(function (resolve) {
        var hasher = crypto.createHash('sha256')
        fs.ReadStream(file).on('data', function (data) {
            var hash = hasher.update(data).digest('hex')
            var url = config.baseUrl + '/stamp'
            var qs = { api_key: config.api_key }
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
                    //         else if (agent.apiKey === qs.api_key) {
                    //             resolve({ success: true, result: body.array[0].status })
                    //         }
                    //     })
                }
            })
        })
    })
}

module.exports.stamp = stamp
module.exports.verify = verify