# Grin Wallet ツ
> A user-friendly Grin client

#### Important: this wallet is dependent on Grin and is not yet ready for production (though it is close!). This warning will be removed when the production app is bundled and shipped.

----

## Features

### Sending with Automatic File Downloads
![Send Grin](https://media.giphy.com/media/1wpMxeEcqgUKCnfQ9f/giphy.gif)<br />
Sending Grin—whether using http or transaction slates—can be a smooth experience. The wallet abstracts away extraneous details with reasonable defaults, presents you with JSON for copy/paste when needed, and automatically downloads slates.

### Drag & Drop Receive
![Receive Grin](https://media.giphy.com/media/fWgfStX6XoLa0VkcQY/giphy.gif)<br />
Simply drag and drop transaction slates into the wallet. The app will determine if the transaction needs to be received and route you appropriately. 

The app also handles automatic slate downloads and presents you with relevant transaction details.

### Drag & Drop Finalize
![Finalize Transactions](https://media.giphy.com/media/31Yk1dd6KraitdkJfv/giphy.gif)<br />
Drop in transaction slates that are ready to be finalized. The wallet signs and broadcasts the transaction, downloads the finalized slate to your preferred path, and presents you with the finalized transaction.

### Intelligent Abstractions
![Abstractions](https://media.giphy.com/media/47K4g01GHYl8es6nAZ/giphy.gif)<br />
The wallet tucks the idiosyncratic aspects of Grin into areas that make sense. For example, teaching people about their spendable balance only when they're focused on it.

### One-click Transaction Cancellation
![One Click Transaction Cancellation](https://media.giphy.com/media/1ziD7JGMnq9Eh29GKU/giphy.gif)<br />
The wallet allows you to quickly understand your balance, and view or cancel any pending transactions that have not confirmed or been finalized on the network.

-----

## Design Research
With IDEO design research in its DNA, this wallet was kicked off by talking with the people likely to comprise Grin's initial user base; this ranged from savvy cryptocurrency developers and GPU miners, to those who don't know the difference between a UTXO and UX. The wallet moved through several rounds of design and UX iteration to arrive at its design language and principles.

## Desing Principles

### Simplicity
Grin is notably challenging for people to use (...often a property of alpha software, but mimblewimble has its own complexity). But when something is hard to use, people get nervous when taking any action—especially when those actions deal with money. This wallet softens the mimblewimble's unique edges to create moments of confidence and understanding when using this new technology. 

### The Digital Cash Metaphor
With its emission rate and community ethos, Grin is setting itself up to be digital cash. This wallet asks what is necessary when a wallet deals primarily with digital cash as the operative metaphor—explicitly not solving for the advanced and merchant use cases (perhaps in another wallet). The wallet subordinates extraneous data and functionality to the prmiary functions of sending, receiving, and managing pending transactions.

### Abstraction
To maintain a minimal surface area and present one action in a given section, we abstract Grin's wallet information and actions into sensible areas that present themselves when needed.

-----

## Engineering 

### Notes
- The engineering docs are a wip; more on the way.
- The app (obviously) has Grin as a dependency. As a result, smirk is almost ready for production, but not yet. There are some patches that need to land in Grin first.
- There will be a signed/bundled electron app build when the wallet ships, but you need to run locally for now
- The code is in its last legs of moving from prototype to production; reviewer beware ;)

The wallet is an Electron client that will be bundled into an app when it ships. 

To run locally, follow the instructions below: 

#### Run Locally

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:9080
yarn run dev

# build electron application for production
yarn run build

# run unit & end-to-end tests
yarn test

# lint all JS/Vue component files in `src/`
yarn run lint

```
