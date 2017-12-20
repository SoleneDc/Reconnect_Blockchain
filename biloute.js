const OpenTimestamps = require('javascript-opentimestamps');
// const Buffer = require('buffer')

const file = Buffer.from('5468652074696d657374616d70206f6e20746869732066696c6520697320696e636f6d706c6574652c20616e642063616e2062652075706772616465642e0a','hex');
const detached = OpenTimestamps.DetachedTimestampFile.fromBytes(new OpenTimestamps.Ops.OpSHA256(), file);
OpenTimestamps.stamp(detached).then( ()=>{
    const fileOts = detached.serializeToBytes();
    const infoResult = OpenTimestamps.info(detached);
    console.log(infoResult);
});