var Login = function() {
	//Initialize things
	var self = this;
	$("input").keypress(function(event) {
	    if (event.which == 13) {
	        event.preventDefault();
	        $("#loginForm").submit();
	    }
	});
	$('.loginButton').click(function() {
		self.login();
	});
	$('#loginForm').submit(function(event) {
		self.login();
		event.preventDefault();
	});
	this.login = function() {
		var username = $('.username').val();
		var password = $('.password').val();
		Parse.User.logIn(username,password).then(function(user) {
			self.loginUser(user);
		},function(error) {
			app.alert(error);
		});
	}
	this.loginUser = function(loggedInUser) {
		var page = 'home.html';
			if (loggedInUser.get('type') == 'driver') {
				page = 'driver.html';
			}
			if (loggedInUser.get('type') == 'serviceCenterRep') {
				page = 'serviceCenterRep.html';
			}

			app.log(loggedInUser);
			window.location = page;
	}
	var testLoggedIn = Parse.User.current();
	if (testLoggedIn) {
		this.loginUser(testLoggedIn);
	};
}