const request = require('request')
const fs = require('fs')

const config = require('../config.js')


const apiUrl = config.baseUrl + 'appli/rosalie/beneficiaire/'

function getRosalieUser(idRosalie) {
    return config.getToken().then(function (r) {
        var url = apiUrl + idRosalie.toString()
        var qs = { access_token: r }

        return new Promise(function (resolve) {
            request.get({ url: url, qs: qs, json: true }, function (err, resp, body) {
                if (err) { resolve("Something happened in getRosalieUser.\n", err) }
                else { resolve(body) }
            })
        })
    })
}

getRosalieUser(1).then(function (r) {
    console.log(r)
})

function uploadFile(idRosalie, input_file) {
    return config.getToken().then(function (r) {
        var url = apiUrl + idRosalie.toString() + '/uploadFile'
        var qs = {
            access_token: r,
            idRosalie: idRosalie
        }
        var formData = {
            file: fs.createReadStream(input_file)
        }

        return new Promise(function (resolve) {
            request.post({ url: url, qs: qs, formData: formData, json: true }, function (err, resp, body) {
                if (err) { resolve('Upload failed.\n', err) }
                else { resolve(body) }
            })
        })
    })
}

uploadFile(1, 'others/Placeholder.pdf').then(function (r) {
    console.log(r)
})



// def create_rosalie_user(idRosalie, nom, prenom, email, dateDeNaissance, telephone):
// url = API_URL
// params = {
//     'access_token': token
// }
// data = {
//     'idRosalie': idRosalie,
//     'nom': nom,
//     'prenom': prenom,
//     'email': email,
//     'dateNaissance': dateDeNaissance,
//     'telephone': telephone
// }
// return requests.post(url, params=params, data=data).json()
//
//
// def edit_rosalie_user(idRosalie, **kwargs):
// url = API_URL + '/' + idRosalie
// params = {
//     'access_token': token,
//     'idRosalie': idRosalie
// }
// data = kwargs
// return requests.put(url, data=data, params=params).json()
//
// def delete_rosalie_user(idRosalie): # Response 405
// url = API_URL
// params = {
//     'access_token': token,
//     'idRosalie': idRosalie
// }
// return requests.delete(url, params=params)
//
// def upload_file(idRosalie, file): # Response 400
// url = API_URL
// params = {
//     'access_token': token,
//     'idRosalie': idRosalie
// }
// data = {
//     'file': open(file, 'rb')
// }
// return requests.post(url, params=params, data=data)
//
// user = get_rosalie_user('1')
// print(user)