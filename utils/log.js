let fs = require('fs')
var logPath = './log/'


function ouputLog(data,name) {
    var fname =  logPath + name + '.log';
    var logFile = fs.createWriteStream(fname, {
        flags: 'a',
        encoding: 'utf8'
    })
    var myDate = new Date((new Date).getTime() + 8*60*60*1000);
    var time = `[${myDate.toJSON().split('T').join(' ').substring(0,19)}]`
    logFile.write( time + data + '\r\n')
}

module.exports = ouputLog
