Silex Bootstrap
===============

This repository provides a starting point for building Silex applications. It
includes:

- A directory structure
- Stubs and default configuration
- CI/QA config

This repo is complemented by [aptoma/silex-extras](https://github.com/aptoma/silex-extras),


To start a new project, run:

    $ composer create-project aptoma/silex-bootstrap <target-dir>

To get started, you probably want to have a look at `app/app.php` to see the
config bootstrap, and then have a look `app/routing.php`,
`src/App/Controller/DefaultController.php` and `src/App/views` for some basic
actions.
