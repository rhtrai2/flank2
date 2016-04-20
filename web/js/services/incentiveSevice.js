flank.factory('incentiveService', ['$http', '$rootScope', function ($http, $rootScope) {

	return {
		getEmailKey: function(key, callback) {
			$http({
				method: 'GET',
				url: '/checkurl',
				params: {
					"hash_token" : key
				}
			})
			.success(function(response) {
				if(callback) { callback(response); }
				  // console.log(response);
			})
			.error(function (response) {
				console.error(response);
			});
		},
		getEmailCheck: function(email, callback) {
			$http({
				method: 'GET',
				url: '/incentive',
				params: {
					"email" : email
				}
			})
			.success(function(response) {
				if(callback) { callback(response); }
				  // console.log(response);
			})
			.error(function (response) {
				console.error(response);
			});
		},
		sendOtp: function(number, callback) {
			$http({
				method: 'GET',
				url: '/sendotp',
				params: {
					"to"    : number,
					"type"  : "otp"
				}
			})
			.success(function(response) {
				if(callback) { callback(response); }
				  // console.log(response);
			})
			.error(function (response) {
				console.error(response);
			});
		},
		verifyOtp: function(otp, callback) {
			$http({
				method: 'GET',
				url: '/checkotp',
				params: {

					"otp"  : otp
				}
			})
			.success(function(response) {
				if(callback) { callback(response); }
				  // console.log(response);
			})
			.error(function (response) {
				console.error(response);
			});
		},
		customerLogin: function(check, email, pwd, callback) {
			$http({
				method: 'POST',
				url: '/logincheck',
				data: {
					"ajax"    : "login",
					"email"   :  email,
					"password":  pwd,
					"check"   :  check
				}
			})
			.success(function(response) {
				if(callback) { callback(response); }
				  // console.log(response);
			})
			.error(function (response) {
				// console.error(response);
			});
		},
		facebookLogin: function(email, id, callback) {
			$http({
				method: 'GET',
				url: '/fblogin',
				params: {
					"id"    : id,
					"email" : email,
				}

			})
			.success(function(response) {
				if(callback) { callback(response); }
				  // console.log(response);
			})
			.error(function (response) {
				console.error(response);
			});
		},
		googleLogin: function(email, id, gmail, callback) {
			$http({
				method: 'GET',
				url: '/googlelogin',
				params: {
					"id"    : id,
					"email" : email,
					"gmail" : gmail,
				}

			})
			.success(function(response) {
				if(callback) { callback(response); }
				  // console.log(response);
			})
			.error(function (response) {
				console.error(response);
			});
		},
		instaConnect: function(callback) {
			$http({
				method: 'GET',
				url: '/instagramservice',
				data: {
					"ajax"    : "login",
					"email"   :  email,
					"password":  pwd
				}


			})
			.success(function(response) {
				if(callback) { callback(response); }
				   // console.log(response);
			})
			.error(function (response) {
				console.error(response);
			});
		},
		getinstagramuserid: function(accesstoken,callback) {
			$http({
				method: 'GET',
				url: '/instagramgetuser',
				params: {
					"access_token"    : accesstoken,
					"scope": 'basic'
				}
			})
			.success(function(response) {
				if(callback) { callback(response); }
				    // console.log(response);
			})
			.error(function (response) {
				console.error(response);
			});
		},
		savedata: function(customer,email,callback) {
			$http({
				method: 'GET',
				url: '/savedata',
				params: {
					"customer"    : customer,
					"email"       : email

				}
			})
			.success(function(response) {
				if(callback) { callback(response); }
				    // console.log(response);
			})
			.error(function (response) {
				console.error(response);
			});
		},
		resetPwd: function(email,callback) {
			$http({
				method: 'GET',
				url: '/forgotpassword',
				params: {
					"email"    : email

				}
			})
			.success(function(response) {
				if(callback) { callback(response); }
				    // console.log(response);
			})
			.error(function (response) {
				console.error(response);
			});
		},
		googleconnect: function(code, callback) {
			$http({
				method: 'GET',
				url: '/googleconnectaction',


			})
			.success(function(response) {
				if(callback) { callback(response); }
				   // console.log(response);
			})
			.error(function (response) {
				console.error(response);
			});
		},
	}
}]);
