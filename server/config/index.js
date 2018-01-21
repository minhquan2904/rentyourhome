var configValues = require('./config.json');

module.exports = {
    // mLab db
    getDbConnectionString : function(){
        console.log(configValues.username + "   " + configValues.password );
        return `mongodb://${ configValues.username }:${configValues.password}@ds111258.mlab.com:11258/rentyourhome`
    },
    // local db
    getLocalDbConnectionString : function()
    {
        return 'mongodb://localhost/mean-app';
    },
    getSecret: function(){
        return configValues.secret;
    }
}