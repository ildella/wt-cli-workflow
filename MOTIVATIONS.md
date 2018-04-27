# Motivations, approach and conventions

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
* env is used as suffix in .env files (eg: .env.dev, .env.prod)
* env is used as suffix in deploying the webtask (eg: myfile-test, myfile-prod)
* task name is the file name without the '.js' extension
