const OpenTimestamps = require('javascript-opentimestamps')
const crypto = require('crypto')
const fs = require('fs')


var stamp = function (file) {
    var hasher = crypto.createHash('sha256')
    fs.ReadStream(file).on('data', function (data) {
        var hash = hasher.update(data).digest('hex')
        var hashBytes = OpenTimestamps.Utils.hexToBytes(hash)

        var detached = OpenTimestamps.DetachedTimestampFile.fromHash(new OpenTimestamps.Ops.OpSHA256(), hashBytes)
        OpenTimestamps.stamp(detached).then(function () {
            var fileOts = detached.serializeToBytes()
            var infoResult = OpenTimestamps.info(detached)
            console.log(infoResult)
        })
    })
}

// DOESN'T WORK YET
//
// var verify = function (file, fileOts) {
//     fs.ReadStream(file).on('data', function (data) {
//         var hasher = crypto.createHash('sha256')
//         var hash = hasher.update(data).digest('hex')
//         var hashBytes = OpenTimestamps.Utils.hexToBytes(hash)
//         var detached = OpenTimestamps.DetachedTimestampFile.fromHash(new OpenTimestamps.Ops.OpSHA256(), hashBytes)
//
//         fs.ReadStream('README.md').on('data', function (dataOts) {
//             console.log(dataOts)
//             console.log(dataOts instanceof Uint8Array)
//
//             var detachedOts = OpenTimestamps.DetachedTimestampFile.deserialize(dataOts)
//
//             OpenTimestamps.verify(detachedOts, detached).then(function (verifyResult) {
//                 console.log(verifyResult)
//             })
//         })
//     })
// }

module.exports.stamp = stamp
// module.exports.verify = verify
// stamp('../../README.md')