<?php

namespace App\Controller;

use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * DefaultController.
 *
 * You would probably put most of your actions in other more domain specific
 * controller classes.
 *
 * Controllers are completely separated from Silex, any dependencies should be
 * injected through the constructor. When used with a smart controller resolver,
 * the Request object can be automatically added as an argument if you use type
 * hinting.
 *
 * @author Gunnar Lium <gunnar@aptoma.com>
 */
class DefaultController
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
        $this->logger->debug('Executing DefaultController::indexAction');

        return $this->twig->render('index.twig');
    }

    public function get(Request $req)
    {
        print_r('hello');
        exit;

        return $this->index();
    }
}
