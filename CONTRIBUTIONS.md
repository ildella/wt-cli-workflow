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