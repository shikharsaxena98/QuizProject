var fs=require('fs');

var options = {
    key: fs.readFileSync('httpsCertificates/key.pem', 'utf8'),
    cert: fs.readFileSync('httpsCertificates/server.crt', 'utf8')
};

module.exports=options;
