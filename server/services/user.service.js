var users = require('../models/User');
var bcrypt = require('bcryptjs');
var Q = require('q');
var _ = require('lodash'); 
var service = {};

service.authenticate = authenticate;
service.getAll = getAll;
//service.getById = getById;
service.create = create;
//service.update = update;
service.delete = _delete;
service.findMod = findMod;

module.exports = service;
function findMod()
{
    var deferred = Q.defer();
    users.find(
        {role: 2}).exec(function (err, users) {
            if (err) deferred.reject(err.name + ': ' + err.message);
    
            // return users (without hashed passwords)
            users = _.map(users, function (user) {
                return _.omit(user, 'hash');
            });
    
            deferred.resolve(users);
        });
    
        return deferred.promise;
}
function authenticate(username, password)
{
    var deferred = Q.defer();

    users.findOne({username: username}, function(err,user){
        if(err) 
            deferred.reject(err.name + ':' + err.message);
        if(user && bcrypt.compareSync(password, user.hash))
        {
            // authentication successful
            deferred.resolve({
                _id: user.id,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role

            });
        }
        else
        {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(userParam)
{
    var deferred = Q.defer();

    users.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                createUser();
            }
        });

        function createUser() {
            // set user object to userParam without the cleartext password
            var user = _.omit(userParam, 'password');
    
            // add hashed password to user object
            user.hash = bcrypt.hashSync(userParam.password, 10);
    
            users.create(
                user,
                function (err, doc) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
    
                    deferred.resolve();
                });
        }
        return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();

    users.find().exec(function (err, users) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        // return users (without hashed passwords)
        users = _.map(users, function (user) {
            return _.omit(user, 'hash');
        });

        deferred.resolve(users);
    });

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

   users.findByIdAndRemove(_id, function(err, res){
    if(err) deferred.reject(err);

    deferred.resolve();
    });

    return deferred.promise;
}