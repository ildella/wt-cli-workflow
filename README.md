# wtw - WebTask Workflow 

A simple workflow for the [Webtask CLI](https://github.com/auth0/wt-cli)

## Installation and quickstart
Assuming you already know and have Webtask:
```shell
npm install -g wtw
wtw --help
```
Create a remote webtask from an existing file (wraps 'wt create'):
```shell
wtw create myfile.js
```
Run the remote webtask and keep monitoring for every local change (wraps 'wt update -w'):
```shell
wtw run myfile.js
```

## Motivations, approach and conventions

### Why Webtask
Webtask is a general purpose Function as a Service (or serverless) provider. Simple NodeJS functions can be a task executed on a remote server almost instantly and has a public accessible URL. That's a Webtask

### Why an addional CLI
Webtask comes with a convenient CLI that already offer all basic commands. 
As always, it get useful to have some basic best practices and standard workflows to deal with frameworks and service providers. 

### What problems addresses
wt-cli-workflow deals with
1. providing easy to use CLI commands to *create* and *run* webtasks based on some  *conventions*
2. define a set standard run mode and make it easy to work with them: local, development, test, stage, production
3. make it easy to setup a continuous testing, integration and deliver environment based on Webtask (TBD)

### Conventions
* Use .env files to store keys, credentials and various secrets
* stage is used as prefix in .env file (eg: test.env, prod.env)
* stage is used suffix in deploying the webtask (eg: myfile-test, myfile-prod)
* task name is the file name without the '.js' extension

## Usage

### Pre-requisites
Obviously, Webtask is required. The setup takes 1 minute
Create an account and a install a CLI with npm following this [instructions](https://webtask.io/cli)

Once the basic environment has been setup, working with serverless functions is mostly about:
1. Creating a new function (not very often)
2. code, test, deploy, release (most of the time)

Well, exactly what happens in any other kind of development, right?
Webtask cli offer great foundamentals but in real world there are 2 things we almost always need that are not easy to get with simple commands:
1. secret environment variable to connect to databases, APIs...
2. different environments for development, testing, staging, production...

Here comes wt-cli-workflow, or wtw.

### Create 
```shell
wtw create myfile.js
```
This will create a new function named "myfile-dev", with a specific url that will look like this:
```https://XXX-some-code-XXX.sandbox.auth0-extend.com/myfile-dev```
And the .env file will be used

To publish a different version for example to be used for testing
```shell
wtw create myfile.js test
```
This will create a new function named "myfile-dev", with a specific url that will look like this:
```https://XXX-some-code-XXX.sandbox.auth0-extend.com/myfile-test```
And the test.env file will be used

### Run
Run the file *after* it has already been created
```shell
wtw run myfile.js
```
This will update the myfile-dev version with the latest local code and will stay open to publish any new local changes

Here as well, a second parameter will change the environment, affecting which .env file will be used and the remote URL

## Developers

### Setup development environment

Checkout the code, then
```
npm install
npm link
```
This will create a symboli link under user home, something like
```
~/.nvm/versions/node/{NODE_VERSION}/lib/node_modules/wt-cli-workflow -> ~/{project folder}/wt-cli-workflow
```

Now create a symbolic link to use the CLI globally. In Ubuntu I recommend:
```
sudo update-alternatives --install /usr/bin/wtw-dev wtw-dev ~/.nvm/versions/node/{NODE_VERSION}/lib/node_modules/wt-cli-workflow/src/cli.js 1
```
Change {NODE_VERSION} with your installed version of node
I call this command wtw-dev so it will not be confused with released version on npmjs 

Now from anywhere:
```
$ wtw-dev --help

Usage: wtw [options] [command]

Webtask Workflow CLI

Options:

  -V, --version              output the version number
  -h, --help                 output usage information

Commands:

  create <filepath> [stage]  create a new webtask (will override an exiting one that has the same name)
  run <taskname> [stage]     run a webtask
```

### Use local version
Using [generator](https://github.com/generate/generate-webtask) is simple to create a basic Webtask function and then create and run it with the Webtask Workflow CLI that we just installed
```
npm install --global generate-webtask
gen webtask:context
touch .env
wtw-dev create index.js
wtw-dev run index.js
```