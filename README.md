# wtw - WebTask Workflow 

A simple workflow for the [Webtask CLI](https://github.com/auth0/wt-cli)

## Quickstart
Assuming you already know and have a Webtask account:
```shell
npm i -g wt-cli
npm i -g wtw
wtw --help
wt init
```
This last command will go trough the account setup to use the remote runtimes provided by webtask.io

Now, let's create a remote webtask from an existing file (wraps 'wt create'):
```shell
wtw create myfile.js
```

You can read about [motivations and general conventions](MOTIVATIONS.md)

## Usage

### Pre-requisites
Obviously, Webtask is required. The setup takes 1 minute
Create an account and a install a CLI with npm following this [instructions](https://webtask.io/cli)

Once the basic environment has been setup, working with serverless functions is mostly about:
1. Creating a new function (not very often)
2. code, test, deploy, release (most of the time)

Well, exactly what happens in any other kind of development, right?
Webtask cli offer great foundamentals but in real world there are 2 things we almost always need that are not immediate (for lazy people like me) to get with simple commands:
1. secret environment variable to connect to databases, APIs...
2. different environments for development, testing, staging, production...

Here comes wt-cli-workflow, or wtw.

### Setup Webtask Profile (for Node 8)
```
wt init -p CHOOSE_A_NAME
module.exports = function (cb) { cb(null, {versions: process.versions}) }
wt create hello.js
```
That won't work cause is Node 8 code and wt containers by default are still Node 4.
Follow [this guide](https://bit.ly/2HdA3rl) to migrate the profile to Node 8.

### Create a new Task
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
This will create a new function named "myfile-test", with a specific url that will look like this:
```https://XXX-some-code-XXX.sandbox.auth0-extend.com/myfile-test```
And the test.env file will be used

### Run a Task
Run the file *after* it has already been created
```shell
wtw run myfile.js
```
This will update the myfile-dev version with the latest local code and will stay open to publish any new local changes

Here as well, a second parameter will change the environment, affecting which .env file will be used and the remote URL

### Scheduled functions with cron
Crete a function that with a specified schedule using cron
```shell
wtw cron myfile.js "*/10 * * * *"
```
That schedule mean every ten minues past the hour. 
Use [Corntab](http://corntab.com) to master cron :)

### More commands
This improves the original 'wt ls' and 'wt rm' commands:
```shell
wtw ls // accepts a search params that grep TS out of standard 'wt ls'
wtw rm //accepts a series of webtasks named and removed them using basic 'wt rm'
```

Please let me know what commands you would like to see, or feel free to fork and make pull requests :)

## Developers
If you want to contribute to this project, [here's how](CONTRIBUTIONS.md)