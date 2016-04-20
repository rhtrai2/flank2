<?php

/**
 * This file should be included from app.php, and is where you hook
 * up routes to controllers.
 *
 * @link http://silex.sensiolabs.org/doc/usage.html#routing
 * @link http://silex.sensiolabs.org/doc/providers/service_controller.html
 */
$app->get('/', 'app.default_controller:indexAction');

//incentivization feature
$app->get('/incent/{hash}', 'app.incentive_controller:indexAction');
$app->get('/incentive', 'app.incentive_controller:checkusersAction');
$app->get('/checkurl', 'app.incentive_controller:checkUrlAction');
$app->get('/sendotp', 'app.incentive_controller:sendotpAction');
$app->get('/checkotp', 'app.incentive_controller:checkotpAction');
$app->post('/logincheck', 'app.incentive_controller:logincheckAction');
$app->get('/fblogin', 'app.incentive_controller:fbloginAction');
$app->get('/googlelogin', 'app.incentive_controller:googleloginAction');
$app->get('/forgotpassword', 'app.incentive_controller:forgotpasswordAction');
$app->get('/instagramerrorhandler', 'app.incentive_controller:instagramServiceAction');
$app->get('/instagramgetuser', 'app.incentive_controller:instagramgetuserAction');
$app->get('/savedata', 'app.incentive_controller:saveFormDataAction');
$app->get('/googleconnectaction', 'app.incentive_controller:googleConnectAction');
