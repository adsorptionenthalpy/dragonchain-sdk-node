# Typescript NODE module starter kit

> A damn simple es5, es7 and Typescript starter kit for creating node modules.

* Use [yarn](https://yarnpkg.com/lang/en/) as main package manager.
* Use [typescript compiler](https://www.typescriptlang.org/) for generating node module.
* Use [tslint](https://palantir.github.io/tslint/) for linting code.
* Use [mocha](https://mochajs.org/) and [chai](http://chaijs.com/) for testing, support code coverage
* Use [Travis-ci](https://travis-ci.org/) for continuous integration
* Use [Commitizen](https://github.com/commitizen/cz-cli) and [Husky](https://github.com/typicode/husky) for git commits

## Getting started

```bash
git clone git@github.com:friends-of-js/typescript-node-module-starter-kit.git
cd typescript-node-module-starter-kit
yarn install
```

You should change package name and repository url in package.json

## Commands
you can see a list of all available commands with description by typing in the console
```bash
yarn h
```
or
```bash
yarn i
```

## Project structure
|Name                 | Description                                                             |
| ------              | :---------------------------:                                           |
| src                 | Your source files placed here                                           |
| spec                | Contains your tests files                                               |
| node_modules        | Contains all your npm dependencies                                      |
| build               | Scripts that responsible for building package                           |
| build/declarations  | Typescript declarations for packages that does not provide declarations |
| lib                 | Generated package                                                       |
| lib/module          | Node module packages                                                    |
| lib/module/commonjs | Commonjs node module using es5 features                                 |
| lib/module/esnext   | Node module using es7 and esnext features                               |
| coverage            | Code coverage report files                                              |
| tools               | Tools for publication release and github pages                          |
| tsconfig.json       | Main typescript configuration file                                      |
| tslint.json         | Main tslint configuration file                                          |
