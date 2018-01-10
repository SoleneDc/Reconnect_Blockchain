const apiSecret = require('./apiSecret.js');
const requestify = require('requestify');

const apiUrl = apiSecret.baseUrl + 'appli/rosalie/beneficiaire/';

function getRosalieUser(idRosalie) {
    return apiSecret.getToken().then(function (value) {
        var url = apiUrl + idRosalie;
        var params = {
            access_token: value
        };

        return new Promise(resolve => {
            requestify.get(url, {params: params})
            .then(function(r) {
                resolve(r.getBody());
            })
            .fail(function(err) {
                resolve("Something happened:", err);
            });
    });
    });
}

getRosalieUser('1').then(value => console.log(value));


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
// def get_rosalie_user(idRosalie):
// url = API_URL + '/' + idRosalie
// params = {
//     'access_token': token
// }
// return requests.get(url, params=params).json()
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