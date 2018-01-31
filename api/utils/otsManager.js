const OpenTimestamps = require('javascript-opentimestamps')
const crypto = require('crypto')
const fs = require('fs')


var stamp = function (file) {
    return new Promise(function (resolve) {
        try {
            var hasher = crypto.createHash('sha256')
            fs.ReadStream(file).on('data', function (data) {
                var hash = hasher.update(data).digest('hex')
                var hashBytes = OpenTimestamps.Utils.hexToBytes(hash)
                var detached = OpenTimestamps.DetachedTimestampFile.fromHash(new OpenTimestamps.Ops.OpSHA256(), hashBytes)

                OpenTimestamps.stamp(detached)
                    .then(function () {
                        var otsFile = Buffer(detached.serializeToBytes())
                        var infoResult = OpenTimestamps.info(detached)
                        console.log(infoResult)
                        resolve({ success: true, otsFile: otsFile, result: infoResult })
                    })
                    .catch(function (err) {
                        resolve({ success: false, error: err })
                    })
            })
        }
        catch (err) {
            resolve({success: false, error: err})
        }
    })
}

var verify = function (file, otsFile) {
    return new Promise(function (resolve) {
        try {
            fs.ReadStream(file).on('data', function (data) {
                var hasher = crypto.createHash('sha256')
                var hash = hasher.update(data).digest('hex')
                var hashBytes = OpenTimestamps.Utils.hexToBytes(hash)
                var detached = OpenTimestamps.DetachedTimestampFile.fromHash(new OpenTimestamps.Ops.OpSHA256(), hashBytes)

                var fileOts = new Uint8Array(otsFile);
                var detachedOts = OpenTimestamps.DetachedTimestampFile.deserialize(fileOts)

                OpenTimestamps.verify(detachedOts, detached)
                    .then(function (verifyResult) {
                        console.log(verifyResult)
                        resolve({ success: true, result: verifyResult })
                    })
                    .catch(function (err) {
                        resolve({ success: false, error: err })
                    })
            })
        }
        catch (err) {
            resolve({ success: false, error: err })
        }
    })
}

module.exports.stamp = stamp
module.exports.verify = verify
