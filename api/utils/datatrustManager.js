const request = require('request')
const config = require('../../config.js').datatrust
const crypto = require('crypto')


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

createUser('manon@gmail.com','coucou').then(function (r){console.log(r)})

