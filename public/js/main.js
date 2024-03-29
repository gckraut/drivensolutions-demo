// Client Specific
Parse.initialize("9rcthcfnOxz4Hbfn4H5NkvtGvNc5sUg5lkpFTLKf", "Fc1BDycG6UHMCY9tMoYPH0E2zPJT6q7GtnDKRWjL");

// Models
var Car = Parse.Object.extend("Car");
var Customer = Parse.Object.extend("Customer");
var Driver = Parse.Object.extend("Driver");
var DriverVehicle = Parse.Object.extend("DriverVehicle");
var DriverTrip = Parse.Object.extend("DriverTrip");
var Event = Parse.Object.extend("Event");
var Job = Parse.Object.extend("Job");
var Perk = Parse.Object.extend("Perk");
var Representative = Parse.Object.extend("Car");
var ServiceCenter = Parse.Object.extend("ServiceCenter");
var Service = Parse.Object.extend("Service");

// Collections
var JobCollection = Parse.Collection.extend({
	model: Job,
	query: (new Parse.Query(Job)).include("customerUser").include('service')
});

var CurrentJobCollection = Parse.Collection.extend({
	model: Job,
	query: (new Parse.Query(Job)).equalTo('complete',null).descending('createdAt')
});

var DriverJobCollection = Parse.Collection.extend({
	model: "User"
});

function jobCollectionForCurrentDriver() {
	var driverId = user.id;
	var jobCollection = new DriverJobCollection();
	jobCollection.query = (new Parse.Query("User")).equalTo('objectId',driverId).include('jobs');
	return jobCollection;
}



var ServiceCenterCollection = Parse.Collection.extend({
	model: ServiceCenter,
	query: (new Parse.Query(ServiceCenter))
});

var DriverCollection = Parse.Collection.extend({
	model: "User",
	setServiceCenter: function(serviceCenter) {
		this.serviceCenter = serviceCenter;
		var modQuery = this.query;
		modQuery.equalTo('serviceCenter',serviceCenter);
		this.query = modQuery;
	},
	query: (new Parse.Query("User")).include('vehicle').equalTo('type','driver').include('jobs')
});

var serviceCenterCollection = new ServiceCenterCollection();
serviceCenterCollection.fetch();

var ObjectFetcher = function(objectToFetch) {
	this.objectFetchDescription = {
		"Job":["customerUser","customerCar","serviceCenter","driverUser","service"],
		"_User":["vehicle","serviceCenter"]
	};
	this.objectToFetch = objectToFetch;
	this.fetch = function(objectToFetch) {
		if (!objectToFetch) {
			objectToFetch = this.objectToFetch;
		}
		var className = this.objectToFetch.className;
		var includes = this.objectFetchDescription[className];
		var query = new Parse.Query(className);
		for (var i = includes.length - 1; i >= 0; i--) {
			var include = includes[i];
			query.include(include);
		};
		query.equalTo('objectId',objectToFetch.id);
		return query.first();
	}
}