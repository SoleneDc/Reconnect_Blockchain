var jwt = require('jsonwebtoken')
var crypto = require('crypto')

var config = require('../../config')


// Functions to export
var requireAgentAuth = function (req, res, next) {
    return requireAuth(req, res, next, agentCallback)
}

var requireReconnectAuth = function (req, res, next) {
    return requireAuth(req, res, next, reconnectCallback)
}

var checkAgent = function (req, res, callback) {
    if (req.decoded.agent === req.params.shortName) {
        return callback(req, res)
    } else {
        res.status(403).json({ message: 'You are not allowed to access this content. Only the right agent is.' })
    }
}

var hash = function (toHash) {
    return crypto.createHash('sha256').update(toHash).digest('hex')
}

// Callbacks
var reconnectCallback = function (req, res, next) {
    if (req.decoded.agent === 'RECONNECT') {
        return next()
    }
    else {
        res.status(403).json({ message: 'You are not allowed to access to this content. Only Reconnect is.' })
    }
}

var agentCallback = function (req, res, next) {
    if (req.decoded.agent) {
        return next()
    } else {
        res.status(403).json({ message: 'You are not allowed to access to this content. Only the right agent is.' })
    }
}

// Base function
var requireAuth = function (req, res, next, callback) {
    var token = req.body.token || req.query.token || req.headers['x-access-token']
    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Failed to authenticate token.' 
                })
            } else {
                req.decoded = decoded
                return callback(req, res, next)
            }
        })
    } else {
        return res.status(403).json({
            success: false,
            message: 'No token provided.'
        })
    }
}

module.exports = {
    requireReconnectAuth: requireReconnectAuth,
    requireAgentAuth: requireAgentAuth,
    checkAgent: checkAgent,
    hash: hash
}