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
var ServiceProvider = Parse.Object.extend("ServiceProvider");
var Service = Parse.Object.extend("Service");

// Support Models
var app = new App();

// Views
var loadManager = new LoadManager();
var mainNav = new MainNav();

// Collections
var JobCollection = Parse.Collection.extend({
	model: Job,
	query: (new Parse.Query(Job)).include("customer")
});

var jobCollection = new JobCollection();
jobCollection.fetch();