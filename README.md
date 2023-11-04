# i18n-file-generator

![NPM Version](https://img.shields.io/npm/v/i18n-file-generator.svg?style=flat)
![NPM Downloads](https://img.shields.io/npm/dm/i18n-file-generator.svg)
![GitHub release](https://img.shields.io/github/release/shiv-source/i18n-file-generator)
![License](https://img.shields.io/github/license/shiv-source/i18n-file-generator)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/shiv-source/i18n-file-generator)](https://github.com/shiv-source/i18n-file-generator/pulls)



This Node.js module simplifies i18n translation file management, making it effortless to generate and manage multiple translation files. It streamlines the localization process, providing an efficient and convenient solution for your projects.


## Installation

```sh
npm install i18n-file-generator

yarn add i18n-file-generator

pnpm add i18n-file-generator

```


```sh

npx i18n-file-generator 

npx i18n-file-generator --config=your_config_file --provider=AWS --accessKeyId=your_accessKeyId --secretAccessKey=your_secretAccessKey

```


Note: If you have installed it globally, you can use the following command. You can choose your preferred package manager, whether it's npm, yarn, or pnpm; the choice is yours.

```sh

npm i18n-file-generator 

npm i18n-file-generator --config=your_config_file --provider=AWS --accessKeyId=your_accessKeyId --secretAccessKey=your_secretAccessKey

```


Note: You can pass additional parameters but these are optional. It will override the value of the config file.
 
- --config=your_config_file
- --provider=AWS
- --accessKeyId=your_accessKeyId
- --secretAccessKey=your_secretAccessKey 




# Usages

Folder structure:

    +-- node_modules
    +-- src
    |   +-- index.js
    |   +-- file1.js
    |   +-- file1.js
    +---locale
    |   +-- en.json
    | 
    +-- package.json
    +-- package-lock.json
    +-- i18n.config.js
    +-- README.md


If you'd like to generate multiple language files, such as 'hi.json,' 'es.json,' and 'fr.json' from your 'en.json,' please follow the examples below.

### Example 1:

```sh
npx i18n-file-generator
```

```js
// i18n.config.js

/** @type {import('i18n-file-generator').Config} */

module.exports = {
  provider: "AWS",
  accessKeyId: "YOUR_ACCESS_KEY",
  secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
  awsRegion: "YOUR_REGION",                             // (optional) : Default = us-east-1
  sourceLanguageCode: "en"                              // Input language ISO code.
  targetLanguageCodes: ["fr", "hi", "es", "ru",'ja'],   // Output language ISO code list.
  sourceLanguageFilePath: "./locale/en.json",           // Input language file path                    
};

/**
 *It will generate JSON files for multiple languages within the 'locale' directory. 
 */

```

In that case, the folder structure will resemble the following:

    +-- node_modules
    +-- src
    |   +-- index.js
    |   +-- file1.js
    |   +-- file1.js
    +---locale
    |   +-- en.json
    |   +-- fr.json
    |   +-- hi.json
    |   +-- es.json
    |   +-- ru.json
    |   +-- js.json
    | 
    +-- package.json
    +-- package-lock.json
    +-- i18n.config.js
    +-- README.md



### Example 2:

If you wish to generate the output in a different directory, simply provide the 'outputDirectory' path


```sh
npx i18n-file-generator
```


```js

// i18n.config.js

/** @type {import('i18n-file-generator').Config} */

module.exports = {
  provider: "AWS",
  accessKeyId: "YOUR_ACCESS_KEY",
  secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
  awsRegion: "YOUR_REGION",                             // (optional) : Default = us-east-1
  sourceLanguageCode: "en"                              // Input language ISO code.
  targetLanguageCodes: ["fr", "hi", "es", "ru",'ja'],   // Output language ISO code list.
  sourceLanguageFilePath: "./locale/en.json",           // Input language file path
  outputDirectory: './i18n'                             // Output folder path
};

/**
 *It will generate multiple lanaguage json file in the i18n directory. 
 */

```

In that case, the folder structure will resemble the following:

    +-- node_modules
    +-- src
    |   +-- index.js
    |   +-- file1.js
    |   +-- file1.js
    |
    +---locale
    |   +-- en.json
    |
    +---118n
    |   +-- en.json
    |   +-- fr.json
    |   +-- hi.json
    |   +-- es.json
    |   +-- ru.json
    |   +-- js.json
    | 
    +-- package.json
    +-- package-lock.json
    +-- i18n.config.js
    +-- README.md


### Example 3:

If you want to pass secrets as external parameters, simply provide the additional arguments.

```sh
npx i18n-file-generator --secretAccessKey=YOUR_ACCESS_KEY --secretAccessKey=YOUR_SECRET_ACCESS_KEY
```


This functionality proves invaluable for generating translation files within the CI/CD environment.

```sh
npx i18n-file-generator --secretAccessKey=${{ secrets.AWS_ACCESS_KEY }} --secretAccessKey=${{ secrets.AWS_ACCESS_SSECRET_KEY }}

```


```js
// i18n.config.js

/** @type {import('i18n-file-generator').Config} */

module.exports = {
  provider: "AWS",
  awsRegion: "YOUR_REGION",                             // (optional) : Default = us-east-1
  sourceLanguageCode: "en"                              // Input language ISO code.
  targetLanguageCodes: ["fr", "hi", "es", "ru",'ja'],   // Output language ISO code list.
  sourceLanguageFilePath: "./locale/en.json",           // Input language file path                    
};

/**
 *It will generate JSON files for multiple languages within the 'locale' directory. 
 */

```
In that case, the folder structure will resemble the following:

    +-- node_modules
    +-- src
    |   +-- index.js
    |   +-- file1.js
    |   +-- file1.js
    +---locale
    |   +-- en.json
    |   +-- fr.json
    |   +-- hi.json
    |   +-- es.json
    |   +-- ru.json
    |   +-- js.json
    | 
    +-- package.json
    +-- package-lock.json
    +-- i18n.config.js
    +-- README.md


### Example 4:

Within the GitHub Action triggered upon a push to the 'master' branch, we have the capability to generate and update multiple translation files.


```yml

# ci.yml

name: CI workflow

on:
    push:
        branches: [master]

jobs:
    build:
        name: "Building source code"
        runs-on: ubuntu-latest
        strategy:
            matrix:
                node-version: [18.x]
        steps:
            - uses: actions/checkout@v3
            - name: Use Node.js ${{ matrix.node-version }}
              uses: actions/setup-node@v3
              with:
                  node-version: ${{ matrix.node-version }}
                  cache: "npm"
            - run: npm install
            - run: npx i18n-file-generator --secretAccessKey=${{ secrets.AWS_ACCESS_KEY }} --secretAccessKey=${{ secrets.AWS_ACCESS_SSECRET_KEY }}    
            - run: npm run build
            - run: npm run test

# Please note that you should execute this command immediately after npm installation to prevent any potential disruptions, especially if you are utilizing test cases.
```


```js
// i18n.config.js

/** @type {import('i18n-file-generator').Config} */

module.exports = {
  provider: "AWS",
  awsRegion: "YOUR_REGION",                             // (optional) : Default = us-east-1
  sourceLanguageCode: "en"                              // Input language ISO code.
  targetLanguageCodes: ["fr", "hi", "es", "ru",'ja'],   // Output language ISO code list.
  sourceLanguageFilePath: "./locale/en.json",           // Input language file path                    
};

/**
 * Note: Note: The configuration file should be in the root directory of your project. If it's in a different location, you have to specify it, as failing to do so may lead to runtime errors.
 * 
 *It will generate JSON files for multiple languages within the 'locale' directory. 
 */

```

In that case, the folder structure will resemble the following:

    +-- node_modules
    +-- src
    |   +-- index.js
    |   +-- file1.js
    |   +-- file1.js
    +---locale
    |   +-- en.json
    |   +-- fr.json
    |   +-- hi.json
    |   +-- es.json
    |   +-- ru.json
    |   +-- js.json
    | 
    +-- package.json
    +-- package-lock.json
    +-- i18n.config.js
    +-- README.md


### Example 4:

When using this package as a function method in your code, follow these steps:

```js

const { TranslationManager } = require("i18n-file-generator");

const translationMAnager = new TranslationManager({
  awsRegion: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SSECRET_KEY,
  provider: "AWS",
});


translationMAnager.translateI18n({
  sourceLanguageCode: "en",
  targetLanguageCodes:   ["fr", "hi", "es", "ru"],
  sourceLanguageFilePath: "./locale/en.json",
  outputDirectory: './i18n'                         // (optional)
});

/**
 * 
 * The default output directory is set to the location of your input 'sourceLanguageFilePath' file, where all the generated translation files will be stored.
 * 
 * /

```



<br/>
<br/>

# Contributors

<a href = "https://github.com/shiv-source">
  <img 
    src = "https://avatars.githubusercontent.com/u/56552766?v=4" 
    width="100" 
    height="100"
    style="border-radius: 50%; margin: 5px;" 
  />
</a>

# License

[MIT](https://opensource.org/licenses/MIT)

**Free Software**