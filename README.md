# Dragonchain JS SDK
![code-build status](https://codebuild.us-west-2.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiUFpHWHVOTHpQSHo4T3ZHSjBUT3JZQ0kzRHBybUFvbCt4WjB6MHFhY2F1dmxPTU1mUUZUYXk4d0QzTXpUMzhRek9sZ2dLclkwcTVjTEpJaElUN3cxQUdjPSIsIml2UGFyYW1ldGVyU3BlYyI6Ik56K0RLUFUxVnhpUHNCNWoiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)

This is the Javascript SDK for interacting with a dragonchain. It provides functionality to be able to interact with a dragonchain through a simple sdk with minimal configuration needed.

## Getting started

### Install
```bash
npm i dragonchain-sdk --save
```

### Examples
#### GetBlock
```javascript
const myDcId = '3f2fef78-0000-0000-0000-9f2971607130';
const dragonchain = new DragonchainClient(myDcId);
try {
  const blockAtRest = dragonchain.getBlock('block-id-here');
  // ... do stuff ...
} catch(e) {
  if (e.code === 'NOT_FOUND') {
    console.log('Oops! That Block does not exist!')
  }
}
```

#### QueryTransactions
```javascript
const searchResult = await dragonchain.searchTransaction(`tag:"MyAwesomeTransactionTag"`)
```

#### OverrideCredentials
This is fine for quick tests. For actual production use, you should use the [credential ini file](#configuration)
```javascript
dragonchain.overrideCredentials('DRAGONCHAIN_AUTH_KEY_ID','DRAGONCHAIN_AUTH_KEY')
dragonchain.clearOverriddenCredentials() // unset credentials
```
## Configuration

In order to use this SDK, you need to have an Auth Key as well as an Auth Key ID for a given dragonchain.
This can be loaded into the sdk in various ways, and are checked in the following order of precedence:

1. The environment variables `DRAGONCHAIN_AUTH_KEY` and `DRAGONCHAIN_AUTH_KEY_ID` can be set with the appropriate values
1. Write an ini-style credentials file at `~/.dragonchain/credentials` (or on Windows: `%LOCALAPPDATA%\dragonchain\credentials`) where the section name is the dragonchain id, with values for `auth_key` and `auth_key_id` like so:

```ini
[35a7371c-a20a-4830-9a59-5d654fcd0a4a]
auth_key_id = JSDMWFUJDVTC
auth_key = n3hlldsFxFdP2De0yMu6A4MFRh1HGzFvn6rJ0ICZzkE
```


## Documentation
[link to github pages]()

