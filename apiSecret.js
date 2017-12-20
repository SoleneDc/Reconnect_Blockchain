module.exports.baseUrl = 'http://dev.reconnect.fr:8080/';

module.exports.getToken = function() {
    var url = baseUrl + 'oauth/v2/token';
    var params = {
        grant_type: 'client_credentials',
        client_id: '2_1qoaz4ssy2o00koowcgk4koog8skc4k8084kgs48c4k8o8wggc',
        client_secret: 'jrf5rjixpogw008wk4wogks80kockw044cwgw084cgwgosw4g'
    };

    return new Promise(resolve => {
        requestify.get(url, {params: params})
        .then(function (r) {
            resolve(r.getBody().access_token);
        })
        .fail(function (err) {
            resolve("Something happened:", err);
        });
    });
}
