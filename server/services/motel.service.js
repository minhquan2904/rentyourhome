var motels = require('../models/Motel.model');

var Q = require('q');
var _ = require('lodash'); 
var service = {};

//service.create = create; 
service.create = create;
service.delete = _delete;
service.findByUser = findByUser;
service.findById = findById;
service.getListNearBy = getListNearBy;
service.getLatLng = getLatLng;
service.findLtPrice = findLtPrice;
service.delete = _delete;
module.exports = service;

function create(motelParam)
{
    var deferred = Q.defer();

    motels.findOne(
        {add : motelParam.add, ward: motelParam.ward ,district: motelParam.district, city: motelParam.city  },
        function(err,motel)
        {
            if(err)
                deferred.reject(err.name + ': ' + err.message);
            if(motel)
            {
                // motel hava already existed
                deferred.reject("motel has already exist");
            }
            else
            {
                //create new motel
                createMotel();
            }

        }
    )

    function createMotel()
    {       
        motels.create(
            motelParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(id)
{
    var deferred = Q.defer();
    //find by id and remove
    motels.findByIdAndRemove(id, function(err, res){
        if(err) deferred.reject(err);

        deferred.resolve();
    });

    return deferred.promise;
}
function findById(id)
{
    var deferred = Q.defer();
    motels.findOne({_id: id}, function(err,motel){
        if(err)
                deferred.reject(err.name + ': ' + err.message);
            if(motel)
            {
                // success
                deferred.resolve(motel);
            }
            else
            {
                //create new motel
                deferred.reject("No result found");
            }
    });
    return deferred.promise;
}
function findLtPrice(price)
{
    var deferred = Q.defer();

    motels.find({price: {$lte : price}}, function(err,motels)
    {
        if(err)
            deferred.reject(err.name + ': ' + err.message);
        if(motels)
        {
            // success
            deferred.resolve(motels);
        }
        else
        {
            //create new motel
            deferred.reject("No result found");
        }
    });


    return deferred.promise;
}
function findByUser(id)
{
    var deferred = Q.defer();

    motels.find(
         {customer : id  },
        function(err,motels)
        {
            if(err)
                deferred.reject(err.name + ': ' + err.message);
            if(motels)
            {
                // success
                deferred.resolve(motels);
            }
            else
            {
                //create new motel
                deferred.reject("No result found");
            }

        });
    return deferred.promise;
}
function getListNearBy(data)
{
    var deferred = Q.defer();
    var listNearBy = [] ;
    motels.find(
         {},
        function(err,motels)
        {
            if(err)
                deferred.reject(err.name + ': ' + err.message);
            if(motels)
            {
                motels.forEach(element => {
                    dis = distance(data, element);
                    if(dis <= 20)
                    {
                        listNearBy.push(element);
                    }
                });
                //console.log(listNearBy);
                if(listNearBy.length > 0){ 
                    deferred.resolve(listNearBy);
                }
                else{
                    deferred.reject();
                }
                
            }
            else
            {
                //create new motel
                deferred.reject("No result found");
            }

        });
    return deferred.promise;
}
function distance(object1, object2)
{
    /** Converts numeric degrees to radians */
    if (typeof(Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function() {
        return this * Math.PI / 180;
        }
    }
    var circumference = 40000.0; // Earth's circumference at the equator in km
    var distance = 0.0;
   
    var latitude1Rad = degrees_to_radians(object1.lat);
    var longitude1Rad = degrees_to_radians(object1.lng);
    var latititude2Rad =  degrees_to_radians(object2.lat);
    var longitude2Rad = degrees_to_radians(object2.lng);
    
    var logitudeDiff = Math.abs(longitude1Rad-longitude2Rad);
    
    if(logitudeDiff > Math.PI)
    {
         logitudeDiff = 2.0 * Math.PI - logitudeDiff;
    }

    var angleCalculation =
        Math.acos(
          Math.sin(latititude2Rad) * Math.sin(latitude1Rad) +
          Math.cos(latititude2Rad) * Math.cos(latitude1Rad) * Math.cos(logitudeDiff));
    distance = circumference * angleCalculation / (2.0 * Math.PI);
    
    return distance;
}
function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function _delete(_id) {
    var deferred = Q.defer();

   motels.findByIdAndRemove(_id, function(err, res){
    if(err) deferred.reject(err);

    deferred.resolve();
    });

    return deferred.promise;
}

function getLatLng(id)
{
    var deferred = Q.defer();

    motels.findOne({_id: id}, function (err, motel) {
        if(err) deferred.reject(err);

        if(motel)
        {
            deferred.resolve({
                lat: motel.lat,
                lng: motel.lng
                }         
            )
        }
        else{
            deferred.reject("No rs found");
        }
        

    })

    return deferred.promise;
}
