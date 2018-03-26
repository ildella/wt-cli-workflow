# wt-cli-workflow
Simple, standard and opinionated workflow for Webtask CLI

## Why Webtask
A basic CLI that helps working with [Webtask CLI](https://github.com/auth0/wt-cli)
Webtask is a general purpose Function as a Service (or serverless) provider. Simple NodeJS functions can become a task executed on a remote server almost instantly and has a public accessible URL. That's a Webtask

## Why an addional CLI
Webtask comes with a convenient CLI that already offer all basic commands. 
As always, it get useful to have some basic best practices and standard workflows to deal with frameworks and service providers. 

wt-cli-workflow deals with
1. providing easy to use CLI commands to *create* and *run* webtasks based on some  *conventions*
2. define a set standard run mode and make it easy to work with them: local, development, test, stage, production
3. make it easy to setup a continuous testing, integration and deliver environment based on Webtask (TBD)

## Conventions
* Use .env to store keys, credentials and various secrets
* stage is used as prefix in .env file (eg: test.env, prod.env)
* stage is used suffix in deploying the webtask (eg: myfile-test, myfile-prod)
* task name is the file name without the '.js' extension

## Usage

TBD: complete npm package and deploy to npmjs

## Development Setup

Checkout the code, then
```
npm install
npm link
```
This will create a symboli link under user home, something like
```
~/.nvm/versions/node/v8.9.4/lib/node_modules/wt-cli-workflow -> ~/{project folder}/wt-cli-workflow
```

Now create a symbolic link to use the CLI globally. In Ubuntu I recomment:
```
sudo update-alternatives --install /usr/bin/wtw wtw ~/.nvm/versions/node/v8.9.4/lib/node_modules/wt-cli-workflow/src/cli.js 1
```

Now from anywhere:
```
$ wtw --help

Usage: wtw [options] [command]

Webtask Workflow CLI

Options:

  -V, --version              output the version number
  -h, --help                 output usage information

Commands:

  create <filepath> [stage]  create a new webtask (will override an exiting one that has the same name)
  run <taskname> [stage]     run a webtask
```

To try it:

## Usage
Using generator, is simple to create a basic webtask function and then create + run with Webtask Workflow cli that we just installed
TBD: missing basic wt setup is needed here, add instructions
```
npm install --global generate-webtask
gen webtask:context
touch .env
wtw create index.js
wtw run index.js
```