#Contributions

## Setup development environment
Checkout the code, then
```
npm install
npm link
```
This will create a symbolic link under user home, something like
```
~/.nvm/versions/node/{NODE_VERSION}/lib/node_modules/wt-cli-workflow -> ~/{project folder}/wt-cli-workflow
```

Now create a symbolic link to use the CLI globally. In Ubuntu I recommend:
```
// sudo update-alternatives --install /usr/bin/wtw-dev wtw-dev ~/.nvm/versions/node/{NODE_VERSION}/lib/node_modules/wt-cli-workflow/src/cli.js 1
sudo update-alternatives --install /usr/bin/wtw-dev wtw-dev /usr/local/bin/wtw 1
```
Change {NODE_VERSION} with your installed version of node
I call this command wtw-dev so it will not be confused with released version on npmjs 

Now this will show the cli help in the console.
```shell
$ wtw-dev -h
```

## Use local version
Using [generator](https://github.com/generate/generate-webtask) is simple to create a basic Webtask function to be used as a test.
```shell
npm install -g generate generate-webtask
generate webtask:context
touch .env.dev
wtw-dev create index.js
wtw-dev run index.js
```

## Standard versioning
I'm trying to use [Standard Versioning](https://github.com/conventional-changelog/standard-version)
This means that using commit messages like
```shell
git commit -a -m "fix(parsing): fixed a bug in our parser"
git commit -a -m "feat(parser): we now have a parser \o/"
```
And then running
```shell
npm run release
npm run publish
```
Will make things get along pretty well. 