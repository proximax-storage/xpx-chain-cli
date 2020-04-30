# ProximaX CLI - xpx-chain-cli

Proof of concept. Installation from github only.

## Installation

```
$ mkdir cli-test
$ cd cli-test

# install and build tsjs-xpx-chain-sdk dependency from a branch

# inside cli-test folder
$ git clone --branch xpx-chain-cli-support https://github.com/proximax-storage/tsjs-xpx-chain-sdk.git
$ cd tsjs-xpx-chain-sdk

# inside tsjs-xpx-chain-sdk folder
$ npm install && npm run build
$ cd ..

# inside cli-test folder
$ git clone --branch merge-from-upstream https://github.com/proximax-storage/xpx-chain-cli.git
$ cd xpx-chain-cli

# inside xpx-chain-cli folder
$ npm install && npm run build

# now you can run the xpx-chain-cli executable
$ ./bin/xpx-chain-cli

# read help, add commands, i.e.
$ ./bin/xpx-chain-cli profile create
# for testnet, use i.e. http://bctestnet1.brimstone.xpxsirius.io:3000/
# for mainnet, use i.e. https://arcturus.xpxsirius.io/

$ ./bin/xpx-chain-cli chain height

```

# Symbol CLI

[![npm version](https://badge.fury.io/js/symbol-cli.svg)](https://badge.fury.io/js/symbol-cli)
[![Build Status](https://api.travis-ci.org/nemtech/symbol-cli.svg?branch=master)](https://travis-ci.org/nemtech/symbol-cli)
[![Coverage Status](https://coveralls.io/repos/github/nemtech/symbol-cli/badge.svg?branch=master)](https://coveralls.io/github/nemtech/symbol-cli?branch=master)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Command Line Interface (CLI) to interact with Symbol.

:information_source: Use the software for testing/development purposes.

## Important Notes

- [0.18.1](CHANGELOG.md#0181-19-Feb-2020) - **Fushicho5 Network Compatibility (catapult-server@0.9.3.1)**

:warning: 0.18.x breaks compatibility with the ``profiles`` (public key derivation) saved using previous versions of the software.
Private keys have now a new public key and address associated.
Before installing ``symbol-cli@0.18.1``, backup and delete the file ``~ \.nem2rc.json``.

- [0.17.1](CHANGELOG.md#0171-31-Jan-2020) - **Fushicho4 Network Compatibility (catapult-server@0.9.2.1)**

The release notes for the symbol-cli can be found [here](CHANGELOG.md).

## Requirements

- Node v12.13.0 (LTS)

## Installation

The Symbol CLI is distributed using the node package manager npm.

```
npm install -g symbol-cli
```

## Usage

Surf the [NEM Developer Center][docs] to get started into NEM development. You will find self-paced guides and useful code snippets using the Symbol CLI.

To get the full list of available commands, check the [CLI reference][docs].

## Contributing

This project is developed and maintained by NEM Foundation. Contributions are welcome and appreciated. You can find [Symbol CLI on GitHub][self];
Feel free to start an issue or create a pull request. Check [CONTRIBUTING](CONTRIBUTING.md) before start.

## Getting help

- [Symbol CLI documentation][docs]
- Join the community [slack group (#sig-client)][slack]
- If you found a bug, [open a new issue][issues]

## License

Copyright 2018-present NEM

Licensed under the [Apache License 2.0](LICENSE)

[self]: https://github.com/nemtech/symbol-cli
[docs]: https://nemtech.github.io/cli.html
[issues]: https://github.com/nemtech/symbol-cli/issues
[slack]: https://join.slack.com/t/nem2/shared_invite/enQtMzY4MDc2NTg0ODgyLWZmZWRiMjViYTVhZjEzOTA0MzUyMTA1NTA5OWQ0MWUzNTA4NjM5OTJhOGViOTBhNjkxYWVhMWRiZDRkOTE0YmU
