flank.controller('landingPageCtrl', function($scope, $http, $timeout, $routeParams, $window, $modal, $compile, $location, incentiveService) {
    $scope.verified = false;
    $scope.customerstatus;
    $scope.isloggedin;
    $scope.noneditable = false;
    $scope.noneditable2 = false;
    $scope.nonchangeable = false;
    $scope.nonchange = false;
    $scope.formshow = false;
    $scope.fornewuser = false;
    $scope.sendbtnprsd = false;
    $scope.resendotplink = false;
    $scope.showOtpform = {
        state1: true,
        state2: false,
        state3: false,
    };
    $scope.accessToken = null;
    $scope.hideContinuebtn = true;
    $scope.instagramButton = 'Connect us to your Instagram Account';
    $scope.fbConnectButton;
    $scope.cpwd = null;
    $scope.ctmnts = 0;
    $scope.ctsecs = 0;
    $scope.startchr = 0;
    $scope.customer = {
        contact_no: '',
        firstname: '',
        lastname: '',
        email: '',
        gender: '',
        pref: '',
        pwd: '',
        fbid: '',
        instagramusername: ''
    };
    $scope.mismatch = "";
    $scope.animationsEnabled = true;

    $scope.clearSearch = function() {
        $scope.customer.contact_no = "";
        $scope.noneditable = false;
        $scope.showOtpform.state1 = true;
        $scope.showOtpform.state2 = false;
        $scope.showOtpform.state3 = false;
        $scope.sendbtnprsd = false;
        $scope.stopTimer();
    };

    $scope.formValidate = false;
    $scope.routeHash = $routeParams.emailId;

    $scope.facebookConnect = function(response) {
        //do the login
        FB.login(function(response) {
            if (response.authResponse) {
                //user just authorized your app
                if (response.status == 'connected') {
                    $scope.getUserData();
                    // $scope.fbconnect();

                }
            }
        }, {
            scope: 'email,public_profile',
            return_scopes: true
        });
    };

    // Get Customer Login Id
    $scope.getUserData = function() {

        FB.api('/me', {
            fields: 'id,name,email,gender'
        }, function(response) {
            $scope.customer.fbid = response.id;
            $scope.fbemail = response.email;
            if (!$scope.customer.fbid) {
                $scope.fbConnectButton = "Connect with your facebook friends";
            } else {
                $scope.fbConnectButton = "Connected:" + " " + $scope.fbemail;
                $scope.nonchangeable = true;
            }
        });
    };

    $scope.fbconnect = function() {
        if (!$scope.customer.fbid) {
            $scope.fbConnectButton = "Connect with your facebook friends";
        } else {
            $scope.fbConnectButton = "Connected:" + " " + $scope.fbemail;
            $scope.nonchangeable = true;
        }
    };
    $scope.fbconnect();


    $scope.setEmailCheck = function(customerdata) {
        $scope.customerdata = customerdata;
        $scope.customerstatus = customerdata.isAccountPresent;
        $scope.isloggedin = customerdata.isLoggedIn;

        if ($scope.isloggedin == false && $scope.customerstatus == true) {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'partials/modalContent.html',
                controller: 'ModalInstanceCtrl',
                backdrop: 'static',
                keyboard: false,
                size: 'md',
                scope: $scope,
                resolve: {
                    items: function() {
                        return $scope.customer.fbid;
                    }
                }
            });
        }
        if (customerdata.redirect == true) {
            $window.location.href = '/happilyustraa';
        }
        if ($scope.customerstatus == true) {
            $scope.customer.firstname = customerdata.data.firstname;
            $scope.customer.lastname = customerdata.data.lastname;

            $scope.customer.gender = customerdata.data.gender;
            if (customerdata.data.contact_no) {
                $scope.showOtpform.state2 = false;
                $scope.verified = true;
                $scope.showOtpform.state3 = true;
                $scope.showOtpform.state1 = false;
                $scope.noneditable = true;
                $scope.customer.contact_no = customerdata.data.contact_no;
            }
        }

        $scope.sendfbid = function(id, email) {
            $scope.customer.fbid = id;
            // console.log($scope.fbid);
            $scope.fbemail = email;
            // console.log($scope.fbemail);
        };
    };

    $scope.setEmailKey = function(response) {
        console.log(response)
        if (response.success == true) {

            $scope.formValidate = true;
            $scope.customer.email = response.email;
            $scope.originalemail = response.email;
            incentiveService.getEmailCheck($scope.customer.email, $scope.setEmailCheck);
        }
        if (response.success == false) {
            window.location.href = '/happilyustraa';
        }
    };


    $scope.getEmailKey = function(key) {
        incentiveService.getEmailKey($scope.routeHash, $scope.setEmailKey);
    };

    $scope.getEmailKey();


    $scope.setsendOtp = function(response) {
        if (response.success == true) {
            $scope.showOtpform.state1 = false;
            $scope.showOtpform.state2 = true;
            $scope.resetTimer();
            $scope.countdownTimer();
        }
        if (response.success == false) {
            $scope.msgstat = "Message Sending Failed!";
        }
        if (response.exhausted == true) {
            $scope.msgstat = "Number Of Tries Exceeded!";
        }
        if (response.verified == true) {
            $scope.msgstat = " Number already exists. Try a different number!";
        }
    }

    $scope.resetTimer = function() {
        $scope.ctmnts = 4;
        $scope.ctsecs = 0;
        $scope.startchr = 0;
    }

    $scope.stopTimer = function() {
        $scope.ctmnts = 0;
        $scope.ctsecs = 0;
        $scope.startchr = 2;
    }

    $scope.countdownTimer = function() {
        if ($scope.startchr == 0) {
            $scope.ctmnts = 4 + 0;
            $scope.ctsecs = 0 * 1 + 1;
            $scope.startchr = 1;
        }
        if ($scope.ctmnts == 0 && $scope.ctsecs == 0) {

            $scope.wrongotp = "[OTP Expired]";
            return false;
        } else if ($scope.startchr == 2) {
            $scope.ctmnts = 0;
            $scope.ctsecs = 0;
            $scope.startchr = 0;
            return false;
        } else {
            // decrease seconds, and decrease minutes if seconds reach to 0
            $scope.ctsecs--;
            if ($scope.ctsecs < 0) {
                if ($scope.ctmnts > 0) {
                    $scope.ctsecs = 59;
                    $scope.ctmnts--;
                } else {
                    $scope.ctsecs = 0;
                    $scope.ctmnts = 0;
                }
            }
        }
        $timeout(function() {
            $scope.countdownTimer();
        }, 1000);
    }




    $scope.getsendOtp = function(number) {
        incentiveService.sendOtp(number, $scope.setsendOtp);
        $scope.noneditable = true;
        $scope.showOtpform.state3 = true;
        $scope.sendbtnprsd = true;
    };



    $scope.setverifyOtp = function(response) {
        $scope.otp1 = "";
        $scope.otp2 = "";
        $scope.otp3 = "";
        $scope.otp4 = "";

        if (response == '"correct_otp"') {
            $scope.showOtpform.state2 = false;
            $scope.verified = true;
            $scope.showOtpform.state3 = false;
        } else if (response == '"[Invalid OTP, Try resending]"') {
            $scope.wrongotp = "[Invalid OTP, Try resending]";
            $scope.verified = false;
            $scope.resendotplink = true;
        } else if (response == '"OTP Expired"') {
            $scope.wrongotp = "[OTP Expired]";
            $scope.verified = false;
        }
    };


    $scope.getresendOtp = function(number) {
        incentiveService.sendOtp(number, $scope.setsendOtp);
        $scope.wrongotp = "";
        $scope.stopTimer();
    };

    $scope.getverifyOtp = function(otp1, otp2, otp3, otp4) {

        $scope.finalotp = $scope.otp1 + $scope.otp2 + $scope.otp3 + $scope.otp4;
        incentiveService.verifyOtp($scope.finalotp, $scope.setverifyOtp);
    };

    $scope.formset = function() {
        if ($scope.customerstatus != true) {

            $scope.fornewuser = true;
            $scope.formshow = true;
            $scope.hideContinuebtn = false;
            $scope.noneditable2 = true;
        } else {

            $scope.formshow = true;
            $scope.hideContinuebtn = false;
            $scope.noneditable2 = true;
        }
    };

    window.fbAsyncInit = function() {
        //SDK loaded, initialize it
        FB.init({
            appId: '1524783554498004',
            xfbml: true,
            version: 'v2.5'
        });
    };

    //load the JavaScript SDK
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));


    $scope.sendfbid = function(id) {
        // console.log($scope.customer.fbid);
    };


    $scope.setinstaConnect = function(response) {
        $scope.insturl = angular.fromJson(response);
        $window.open($scope.insturl, 'width=500,height=400');
        $scope.name = $routeParams.codegenerated;
    };

    $scope.setinstagramuserid = function(response) {
        $scope.customer.instagramusername = response.data.username;
        $scope.instagramid = response.data.username.id;
        if ($scope.customer.instagramusername) {
            $scope.instagramButton = "Connected:" + " " + $scope.customer.instagramusername;
        }
    }

    $scope.authenticateInstagram = function(instagramClientId, instagramRedirectUri, callback) {
        //the pop-up window size, change if you want
        var popupWidth = 700,
            popupHeight = 500,
            popupLeft = (window.screen.width - popupWidth) / 2,
            popupTop = (window.screen.height - popupHeight) / 2;

        var popup = window.open('instagramerrorhandler', '', 'width=' + popupWidth + ',height=' + popupHeight + ',left=' + popupLeft + ',top=' + popupTop + '');

        popup.onload = function() {
            if (window.location.hash.length == 0) {
                popup.open('https://instagram.com/oauth/authorize/?client_id=' + instagramClientId + '&redirect_uri=' + instagramRedirectUri + '&response_type=token&scope=basic', '_self');
            }

            //an interval runs to get the access token from the pop-up
            var interval = setInterval(function() {
                try {
                    //check if hash exists
                    if (popup.location.hash.length) {
                        //hash found, that includes the access token
                        clearInterval(interval);
                        $scope.accessToken = popup.location.hash.slice(14); //slice #access_token= from string
                        incentiveService.getinstagramuserid($scope.accessToken, $scope.setinstagramuserid);

                        popup.close();
                        if (callback != undefined && typeof callback == 'function') callback();
                    }
                } catch (evt) {
                    //permission denied
                }

            }, 100);
        }

    };

    $scope.login_callback = function() {

        $scope.nonchange = true;
    }

    $scope.openWindow = function() {

        $scope.authenticateInstagram('115a3e7ed0ec432e9dae6f0f2f4fd4c7', 'http://localhost/', $scope.login_callback);

    };

    $scope.setSaveData = function(response) {

        if (response == 'success') {
            $window.location.href = '/flank/web/thankyou';
        }
    }

    $scope.getSaveData = function(customer, email) {
        if ($scope.customerstatus == false) {
            console.log('eeee')
            if ($scope.customer.pwd == $scope.cpwd) {
                console.log('rrrr')
                $scope.mismatch = " ";
                incentiveService.savedata($scope.customer, $scope.originalemail, $scope.setSaveData);
            } else {
                $scope.mismatch = "Password does not match!!";
            }
        }
        if ($scope.customerstatus == true) {
            incentiveService.savedata($scope.customer, $scope.originalemail, $scope.setSaveData);
        }
    }
});

// Flank Login Modal Controller

flank.controller('ModalInstanceCtrl', function($scope, $modalInstance, incentiveService) {

    // $scope.showforgetpassword = false;
    $scope.loginpage = true;

    //Stops the modal to close
    $scope.clicked = function(event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
    };

    //Customer Set Normal Login response
    $scope.setcustomerLogin = function(response) {
        // console.log(response)
        if (response == 'success') {
            // console.log('insidesuccess')
            $modalInstance.dismiss();
        }
        if (response == 'wronglogin') {
            $scope.loginerrmsg = "Wrong Email or Password. Please try again!";
        }
        if (response == 'wrongemail') {
            $scope.loginerrmsg = "Login from the Email You Are Registered!";
        }
    };

    //Customer get Normal Login Response
    $scope.customerLogin = function(email, pwd) {
        incentiveService.customerLogin($scope.originalemail, $scope.cust.email, $scope.cust.pwd, $scope.setcustomerLogin);
    }

    $scope.forgotpassword = function() {
        $scope.showforgetpassword = true;
        $scope.loginpage = false;
    }

    $scope.initialloginpage = function() {
        $scope.showforgetpassword = false;
        $scope.loginpage = true;
    }

    $scope.setcustomerResetPwd = function(response) {
        // console.log(response.success)
        if (response.success == true) {
            $scope.msgshow = "A new password has been sent to your Email ID.";
        }
        if (response.success == false) {
            // console.log(success)
            $scope.msgshow = "This email address was not found in our records.";
        }
    }

    $scope.resetPwd = function(email) {
        // console.log($scope.rec.email)
        incentiveService.resetPwd($scope.rec.email, $scope.setcustomerResetPwd);
    }

    $scope.setfacebookLoginCallback = function(response) {
        $scope.sessionfb = response;
    };


    $scope.setFacebookLogin = function(response) {
        if (response.success == true) {
            // console.log('insidesuccess')
            $modalInstance.dismiss();
        } else {
            $scope.loginerrmsg = "Wrong Email. Please try again!";
        }
    };

    //add event listener to login button for FaceBook
    $scope.facebookLoginCallback = function(response) {
        //do the login
        FB.login(function(response) {
            if (response.authResponse) {
                //user just authorized your app


                $scope.fbaccesstoken = FB.getAuthResponse()['accessToken'];
                if (response.status == 'connected') {


                    $scope.getUserData();

                }
            }
        }, {
            scope: 'email,public_profile',
            return_scopes: true
        });
    };

    $scope.facebookLogin = function() {
        // console.log($scope.facebookdata)
        incentiveService.facebookLogin($scope.originalemail, $scope.facebookdata, $scope.setFacebookLogin);
    };

    // Get Customer Login Id
    $scope.getUserData = function() {

        FB.api('/me', {
            fields: 'id,name,email,gender'
        }, function(response) {
            // console.log(response)
            $scope.facebookdata = response.id;
            $scope.facebookLogin();
            $scope.fbid = response.id;
            $scope.fbemail = response.email;
            $scope.sendfbid($scope.fbid, $scope.fbemail);
            //console.log($scope.fbid);

        });
    };

    // $scope.setgoogleconnect = function(response) {

    //  console.log(response)

    // };

    // $scope.onSignIn = function(code) {
    //     console.log('honolulu')

    //     incentiveService.googleconnect(code, $scope.setgoogleconnect);


    //   };
    $scope.setGoogleLogin = function(response) {
        if (response.success == true) {
            $modalInstance.dismiss();
        } else {
            $scope.loginerrmsg = "Wrong Email. Please try again!";
        }
    };

    $scope.$on('event:google-plus-signin-success', function(event, authResult) {
        $scope.googlecustomerid = authResult.wc.Ka;
        $scope.googlecustomeremail = authResult.wc.hg;
        console.log($scope.googlecustomerid);
        incentiveService.googleLogin($scope.originalemail, $scope.googlecustomerid, $scope.googlecustomeremail, $scope.setGoogleLogin);
    });

    $scope.$on('event:google-plus-signin-failure', function(event, authResult) {
        // console.log('Auth failure or signout detected');
    });
});
