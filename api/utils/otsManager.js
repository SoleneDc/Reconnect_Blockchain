const OpenTimestamps = require('javascript-opentimestamps')
const crypto = require('crypto')
const fs = require('fs')
var Stamping = require('../models/stamping');

var stamp = function (file,stamping,agent) {
    var hasher = crypto.createHash('sha256')
    fs.ReadStream(file).on('data', function (data) {
        var hash = hasher.update(data).digest('hex')
        var hashBytes = OpenTimestamps.Utils.hexToBytes(hash)

        var detached = OpenTimestamps.DetachedTimestampFile.fromHash(new OpenTimestamps.Ops.OpSHA256(), hashBytes)
        OpenTimestamps.stamp(detached).then(function () {
            var fileOts = detached.serializeToBytes() //TODO: save the file somewhere!
            var infoResult = OpenTimestamps.info(detached)
            console.log(infoResult)
            stamping.otsFile = Buffer(fileOts)
            stamping.agentId = agent._id
            stamping.save()
        })
    })
}

//DOESN'T WORK YET

var verify = function (file,req,agent,stamping) {
    fs.ReadStream(file).on('data', function (data) {
        var hasher = crypto.createHash('sha256')
        var hash = hasher.update(data).digest('hex')
        var hashBytes = OpenTimestamps.Utils.hexToBytes(hash)
        var detached = OpenTimestamps.DetachedTimestampFile.fromHash(new OpenTimestamps.Ops.OpSHA256(), hashBytes)
         //   function(err, stamping) {
                var fileOts = new Uint8Array(stamping.otsFile);

                // fs.ReadStream(fileOts).on('data', function (dataOts) {
                var detachedOts = OpenTimestamps.DetachedTimestampFile.deserialize(fileOts)
                OpenTimestamps.verify(detachedOts, detached).then(function (verifyResult) {
                    console.log(verifyResult)
                })
            //}

    })
}

module.exports.stamp = stamp;
module.exports.verify = verify;
// stamp('../../README2.md')