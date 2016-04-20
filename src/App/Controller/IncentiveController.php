<?php

namespace App\Controller;

require_once '../../happilyustraa/app/Mage.php';

use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Mage;

Mage::app('default');

class IncentiveController
{
    /**
     * @var \Twig_Environment
     */
    private $twig;

    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(\Twig_Environment $twig, LoggerInterface $logger)
    {
        $this->twig = $twig;
        $this->logger = $logger;
    }

    public function indexAction()
    {
        return $this->twig->render('layout.twig');
    }

    public function checkusersAction(Request $request)
    {
        $this->_urlEmail = $request->get('email');
         // print_r($this->_urlEmail);exit;
        $response = [
            'data' => null,
            'isAccountPresent' => false,
            'isLoggedIn' => false,
            'redirect' => false,
        ];

        $session = Mage::getSingleton('core/session', ['name' => 'frontend']);

        $customer = Mage::getSingleton('customer/session')->getCustomer();
        $email_loggedin = $customer->getEmail();

        if ($email_loggedin) {
            if ($this->_urlEmail == $email_loggedin) {
                $response['data'] = $customer->getData();
                $response['isAccountPresent'] = true;
                $response['isLoggedIn'] = true;
            } else {
                $response['redirect'] = true;
            }
        } else {
            $customerModel = Mage::getModel('customer/customer');
            $customerModel->setWebsiteId(Mage::app()->getStore()->getWebsiteId());
            $customerModel->loadByEmail($this->_urlEmail);
            $customerData = $customerModel->getData();

            if ($customerData != null) {
                $response['data'] = $customerData;
                $response['isAccountPresent'] = true;
                $response['isLoggedIn'] = false;
            }
        }

        return json_encode($response);
    }

    public function sendotpAction()
    {
        $response = [
            'verified' => null,
            'exhausted' => false,
            'success' => false,
        ];

        $mobileNumber = $_REQUEST['to'];
        $phoneCheck = Mage::getModel('referals/email');
        if ($phoneCheck->isMobileNumberExists($mobileNumber)) {
            $response['verified'] = true;
            $response['exhausted'] = false;
            $response['success'] = false;
        } else {
            $receiverPhoneNumber = $mobileNumber;
            $type = $_REQUEST['type'];
            if (! $receiverPhoneNumber || ! $type) {
                return;
            }
            if ($type == 'otp') {
                $isExhausted = Mage::helper('sms')->isChancesExhausted($receiverPhoneNumber);
                if (! $isExhausted) {
                    $data = Mage::getModel('sms/otp')->generateOTP($receiverPhoneNumber);
                }
            } else {
                $data = $_REQUEST['orderId'];
            }
            if ($type == 'otp' && $isExhausted) {
                $response['verified'] = fasle;
                $response['exhausted'] = true;
                $response['success'] = false;
            } else {
                $smsInfo = [];
                $smsInfo['data'] = $data;
                $sendResponse = Mage::helper('sms')->sendSMS($receiverPhoneNumber, $type, $smsInfo);
                if ($sendResponse) {
                    Mage::getSingleton('core/session')->setMobileNo($receiverPhoneNumber);
                    $response['verified'] = fasle;
                    $response['exhausted'] = false;
                    $response['success'] = true;
                } else {
                    $response['verified'] = fasle;
                    $response['exhausted'] = false;
                    $response['success'] = false;
                }
            }
        }

        return json_encode($response);
    }

    public function checkotpAction()
    {
        $customerAppliedOtp = $_REQUEST['otp'];
        $response = Mage::helper('sms')->checkOtp($customerAppliedOtp);
        //$this->getResponse()->setBody(Mage::helper('core')->jsonEncode($response));
        return json_encode($response);
    }

    public function logincheckAction(Request $request)
    {
        $data = json_decode($request->getContent());

        $originalemail = $data->check;
        $presentemail = $data->email;
        if ($originalemail  == $presentemail) {
            Mage::getSingleton('core/session', ['name' => 'frontend']);
            $session = Mage::getSingleton('customer/session');

            try {
                $session->login($data->email, $data->password);
                $customer = $session->getCustomer();

                $session->setCustomerAsLoggedIn($customer);
                $response = 'success';
            } catch (\Exception $e) {
                $response = 'wronglogin';
            }
        } else {
            $response = 'wrongemail';
        }

        return new Response($response);
    }

    public function checkUrlAction(Request $request)
    {
        $hashEmail = $request->get('hash_token');

        $response = [
            'email' => null,
            'success' => false,
        ];

        $hashArr = explode('-', $hashEmail);
        date_default_timezone_set('Asia/Kolkata');
        $presentTime = date('Y-m-d H:i:s');

        $customerIncent = Mage::getModel('incentive/records')
                ->getCollection()
                ->addFieldToFilter('hash_token', $hashArr[0])
                ->getFirstItem();

        $customerEmail = $customerIncent->getEmail();
        $customerGratified = $customerIncent->getGratified();
        if ($customerEmail && $customerGratified == 0) {
            if (isset($hashArr[1])) {
                $reminderData = $customerIncent->setAuReminderemailClicked(1)
                                    ->setAuReminderemailClickedAt($presentTime);
            } else {
                $reminderData = $customerIncent->setAuEmailClicked(1)
                            ->setAuEmailClickedAt($presentTime);
            }
            $reminderData->save();
            $response['email'] = $customerEmail;
            $response['success'] = true;
        }

        return json_encode($response);
    }

    public function instagramServiceAction(Request $request, Application $app)
    {
        $loader = 'Loading....';
        $response = 'error';
        if (isset($_GET['error'])) {
            return json_encode($response);
        } else {
            return json_encode($loader);
        }
    }

    public function instagramgetuserAction(Request $request)
    {
        $access_token = $request->get('access_token');
        $scope = $request->get('scope');

        $apiUrl = 'https://api.instagram.com/v1/users/self/';
        $params = '?access_token='.$access_token.'&scope='.$scope;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $apiUrl.$params);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $data = curl_exec($ch);
        curl_close($ch);

        return new Response($data);
    }

    public function saveFormDataAction(Request $request)
    {
        $originalemail = $request->get('email');
        $customerData = json_decode($request->get('customer'));

        $customercontactnum = $customerData->contact_no;
        $customeremail = $customerData->email;
        $customerfirstname = $customerData->firstname;
        $customerlastname = $customerData->lastname;
        $customergender = $customerData->gender;
        $customerpwd = $customerData->pwd;
        $customerfbid = $customerData->fbid;
        $customerinstagramusername = $customerData->instagramusername;
        $customerpref = $customerData->pref;
        $hashedpassword = base64_encode($customerpwd);

        // $hashedpassword = Mage::getModel("customer/customer")->hashpassword($customerpwd);

        $customer = Mage::getModel('customer/customer');
        $customer->setWebsiteId(Mage::app()->getWebsite()->getId())
            ->loadByEmail($originalemail);

        if ($customer) {
            $customer->setWebsiteId(Mage::app()->getWebsite()->getId())
                ->loadByEmail($originalemail)
                ->setFirstname($customerfirstname)
                ->setLastname($customerlastname)
                ->setEmail($customeremail)
                ->setContactNo($customercontactnum)
                ->setFacebookId($customerfbid)
                ->setInstaUsername($customerinstagramusername);

            // $customer->save();
        } else {
            $customer->setWebsiteId(Mage::app()->getWebsite()->getId())
                ->setFirstname($customerfirstname)
                ->setLastname($customerlastname)
                ->setEmail($customeremail)
                ->setContactNo($customercontactnum)
                ->setPassword($hashedpassword)
                ->setFacebookId($customerfbid)
                ->setInstaUsername($customerinstagramusername);

            // $customer->save();
            // Mage::getSingleton("core/session", array("name" => "frontend"));
            // $session = Mage::getSingleton('customer/session');
            // $session->login($customeremail, $hashedpassword);
            // $customeractive = $session->getCustomer();
            // $session->setCustomerAsLoggedIn($customeractive);
        }
        $customer->save();
        // Mage::getSingleton('customer/session')->setCustomerAsLoggedIn($customer);
        // date_default_timezone_set('Asia/Kolkata');
           $customerdata['entity_id'] = $customer->getId();
        $customerdata['preference'] = $customerpref;
        // $customerpreferenceData = Mage::getModel('incentive/preference')->setData($customerdata);
        // $customerpreferenceData->save();
        Mage::helper('incentive')->saveCustomerPreference($customerdata);
        // print_r('customerprefersdfghfdsfenceData');exit;
        // if()

        $templateId = 22;
        // print_r($templateId);
        $orderModel = Mage::getModel('sales/order');
        $sender = Mage::getStoreConfig($orderModel::XML_PATH_EMAIL_IDENTITY, Mage::app()->getStore()->getId());

        $emailParameters = [
            'name' => $customerfirstname.' '.$customerlastname,
        ];
        // print_r($sender);
        try {
            Mage::getModel('core/email_template')->sendTransactional($templateId,
                $sender,
                $customeremail,
                $customerfirstname.' '.$customerlastname,
                $emailParameters
            );
            $changeGratificationStatus = Mage::getModel('incentive/records')->load($originalemail, 'email');
            $changeGratificationStatus->setGratified(1);
            $changeGratificationStatus->save();
            $response = 'success';
        } catch (\Exception $e) {
            $response = 'failure';
        }

        return new Response($response);
    }

    public function forgotpasswordAction(Request $request)
    {
        $email = $request->get('email');
        // print_r($emaildata);exit;

        $session = Mage::getSingleton('customer/session');

        $response = [
            'success' => false,

        ];

        $customer = Mage::getModel('customer/customer')
                ->setWebsiteId(Mage::app()->getWebsite()->getId())
                ->loadByEmail($email);

       // print_r($customer->getId());exit;

        if (! $customer->getId()) {
            $session->setForgottenEmail($email);
            $response['success'] = false;
        } else {
            $new_pass = $customer->generatePassword();
                // print_r($new_pass);
                $customer->changePassword($new_pass, false);
            $customer->sendPasswordReminderEmail();
            $response['success'] = true;
        }

        return json_encode($response);
    }

    public function fbloginAction(Request $request)
    {
        $presentFacebookId = $request->get('id');
        $originalemail = $request->get('email');
        $response = [
            'success' => false,

        ];

        $customerInstance = Mage::getModel('customer/customer')
            ->setWebsiteId(Mage::app()->getWebsite()->getId())
            ->loadByEmail($originalemail);

        $customerId = $customerInstance->getEntityId();
        $customerEmail = $customerInstance->getEmail();
        $customersByFacebookId = $customerInstance->getInchooSocialconnectFid();

        if ($customersByFacebookId  == $presentFacebookId) {
            Mage::getSingleton('core/session', ['name' => 'frontend']);
            $session = Mage::getSingleton('customer/session');
            $customer = $session->getCustomer();
            $session->loginById($customerId);
            $customer = $session->getCustomer();
            $session->setCustomerAsLoggedIn($customer);
            $response['success'] = true;
        } else {
            $response['success'] = false;
        }

        return json_encode($response);
    }

    public function googleloginAction(Request $request)
    {
        $presentGoogleId = $request->get('id');
        $originalemail = $request->get('email');
        $presentGoogleEmail = $request->get('gmail');
        $response = [
            'success' => false,
        ];

        $customerInstance = Mage::getModel('customer/customer')
            ->setWebsiteId(Mage::app()->getWebsite()->getId())
            ->loadByEmail($originalemail);

        $customerId = $customerInstance->getEntityId();
        $customerEmail = $customerInstance->getEmail();
        $customersByGoogleId = $customerInstance->getInchooSocialconnectGid();

        if ($customersByGoogleId  == $presentGoogleId) {
            Mage::getSingleton('core/session', ['name' => 'frontend']);
            $session = Mage::getSingleton('customer/session');
            $customer = $session->getCustomer();
            $session->loginById($customerId);
            $customer = $session->getCustomer();
            $session->setCustomerAsLoggedIn($customer);
            $response['success'] = true;
        } else {
            $response['success'] = false;
        }

        return json_encode($response);
    }
}
