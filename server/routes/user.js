var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var service = require('../services/user.service');

// routes
router.get('/',getAll);
router.post('/authenticate', authenticate);
router.post('/register', register);
router.post('/find-mod',findMod);
router.delete('/:id', _delete);
module.exports = router;

function authenticate(req, res) {
    service.authenticate(req.body.username, req.body.password)
        .then(function (user) {
            if (user) {
                // authentication successful
                res.send(user);
            } else {
                // authentication failed
                res.status(400).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function register(req, res) {
    service.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    service.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function findMod(req, res) {
    service.findMod()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
function _delete(req, res) {
    service.delete(req.params.id)
        .then(function () {
            res.status(200).send("delete ok");
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}