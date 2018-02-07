const apiSecret = require('../config.js')
const requestify = require('requestify')
const request = require('request')
const fs = require('fs')

const apiUrl = apiSecret.baseUrl + 'appli/rosalie/beneficiaire/'

// TODO : Homogénéiser pour n'utiliser que request (et plus requestify)

function getRosalieUser(idRosalie) {
    return apiSecret.getToken().then(function (resp) {
        var url = apiUrl + idRosalie
        var params = { access_token: resp }

        return new Promise(function (resolve) {
            requestify.get(url, { params: params })
                .then(function(r) {
                    resolve(r.getBody())
                })
                .fail(function(err) {
                    resolve("Something happened in getRosalieUser :", err.getBody(), err.getCode())
                })
        })
    })
}

getRosalieUser('1').then(function (resp) {
    console.log(resp)
})

function uploadFile3(idRosalie) {
    return apiSecret.getToken().then(function (resp) {
        var url = apiUrl + idRosalie.toString() + '/uploadFile'
        var params = {
            access_token: resp,
            idRosalie: idRosalie
        }
        url += '?access_token=' + params.access_token + '&idRosalie=' + params.idRosalie
        var formData = {
            file: fs.createReadStream('others/Placeholder.pdf')
        }

        request.post({ url: url, formData: formData }, function optionalCallback(err, httpResponse, body) {
            if (err) { return console.error('upload failed:', err) }
            else { console.log('Upload successful!  Server responded with:', body) };
        })
    })
}

uploadFile3('1')


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