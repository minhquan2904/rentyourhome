var express = require('express');
var router = express.Router();

var motel = require('../models/Motel.model');
var motelService = require('../services/motel.service');

//routes

router.post('/insert', insert);
router.put('/:id', update );
router.delete('/:id', _delete );
router.post('/get-lat-lng', getLatLng);
router.post('/find-by-user', findByUser);
router.post('/get-list-nearby', getListNearBy);
router.post('/find-lt-price', findLtPrice);
router.get('/find-by-id/:id', findById);
router.get('/', function(req,res){
    res.send("response");
})
module.exports = router;
function findLtPrice(req,res)
{
    motelService.findLtPrice(req.body['price']).then(function(motels){
        if(motels)
        // search successful
        res.status(200).send(motels);
    else{
        // search fail
        res.status(400).send("No Result");
    }
    })
    .catch(
        function (err) {
            res.status(400).send(err);
        }
    );
}
function getListNearBy(req,res)
{
    motelService.getListNearBy(req.body).then(function(motels){
        if(motels)
        // search successful
        res.status(200).send(motels);
    else{
        // search fail
        res.status(400).send("No Result");
    }
    })
    .catch(
        function (err) {
            res.status(400).send(err);
        }
    );
}
function findById(req,res)
{
    motelService.findById(req.params.id).then(function(motel){
        if(motel)
        // search successful
        res.status(200).send(motel);
    else{
        // search fail
        res.status(400).send("No Result");
    }
})
.catch(
    function (err) {
        res.status(400).send(err);
    }
);
}
function insert(req,res)
{
    delete req.body['_id'];
    motelService.create(req.body).then(function () {
        res.status(200).send("insert ok");
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}
function update(req,res)
{  
    // delete property _id
    delete req.body['_id'];

    //find by id and update
    motel.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json("Update success!");
      });
}
function _delete(req, res) {
    motelService.delete(req.params.id)
        .then(function () {
            res.status(200).send("delete ok");
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
function findByUser(req,res)
{
    motelService.findByUser(req.body["id"])
        .then(function(motels){
            if(motels)
            // search successful
            res.status(200).send(motels);
        else{
            // search fail
            res.status(400).send("No Result");
        }
    })
    .catch(
        function (err) {
            res.status(400).send(err);
        }
    );
}
function getLatLng(req,res)
{
    motelService.getLatLng(req.body["id"])
        .then(function(motels){
            if(motels)
            // search successful
            res.status(200).send(motels);
        else{
            // search fail
            res.status(400).send("No Result");
        }
    })
    .catch(
        function (err) {
            res.status(400).send(err);
        }
    );
}