var jwt = require('jsonwebtoken')

var config = require('../../config')

// This file contains helpers to require authentication, and check if someone has the rights to do what he wants to

// ==== FUNCTIONS TO EXPORT ===
// If used in a route : require authentication to access this route
var requireAgentAuth = function (req, res, next) {
    return requireAuth(req, res, next, agentCallback)
}

// If used in a route : require authentication as RECONNECT to access this route
var requireReconnectAuth = function (req, res, next) {
    return requireAuth(req, res, next, reconnectCallback)
}

// Check if the agent authenticated is the same as the agent mentionned in the route
var checkAgent = function (req, res, callback) {
    if (req.decoded.agent === req.params.shortName) {
        return callback(req, res)
    } else {
        res.status(403).json({ message: 'You are not allowed to access this content. Only the right agent is.' })
    }
}

// ==== CALLBACKS ===
// For Reconnect
var reconnectCallback = function (req, res, next) {
    if (req.decoded.agent === 'RECONNECT') {
        return next()
    }
    else {
        res.status(403).json({ message: 'You are not allowed to access to this content. Only Reconnect is.' })
    }
}

// For the given agent
var agentCallback = function (req, res, next) {
    if (req.decoded.agent) {
        return next()
    } else {
        res.status(403).json({ message: 'You are not allowed to access to this content. Only the right agent is.' })
    }
}

// Base function, to check if an agent is authenticated (used in requireReconnectAuth and requireReconnectAuth)
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
}