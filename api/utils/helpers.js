var crypto = require('crypto')

var Agent = require('../models/agent')


var hash = function (toHash) {
    return crypto.createHash('sha256').update(toHash).digest('hex')
}

var uniqueAgent = function (shortName, email, except) {
	return new Promise(function (resolve) {
		uniqueShortName = false
		uniqueEmail = false
		Agent.find({ shortName: shortName }, function (err, agents) {
			if (err || agents.length == 0 || (agents.length == 1 && agents[0].equals(except))) { uniqueShortName = true }
			Agent.find({ email: email }, function (err, agents) {
				if (err || agents.length == 0 || (agents.length == 1 && agents[0].equals(except))) { uniqueEmail = true }
				resolve(uniqueShortName && uniqueEmail)
			})
		})
	})
}

module.exports = {
	hash: hash,
	uniqueAgent: uniqueAgent
}