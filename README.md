# Smirk ;)
> A user-friendly Grin client

## Inspiration
Grin is a [lightweight, privacy-focused cryptocurrency](http://grin-tech.org) set to launch in early 2019. Community financed from the beginning, Grin has bootstrapped a development team through some lean times. As a result, the urgency for a user-focused Grin client has (understandably) taken a back seat to protocol development.

Today, the need exists for a client and user experience that matches the promise of Grin's simplicity and the spirit of its community. 

__Enter Smirk.__

## Design Research
With IDEO design research in its DNA, Smirk was kicked off by talking with the people likely to comprise Grin's initial user base; this ranged from savvy cryptocurrency developers and GPU miners, to those who have only heard the term UTXO. Smirk moved through several rounds of design and UX iteration to arrive at its design language and principles.

## Desing Principles

### Simplicity
Most notably, Grin is challenging for people to use (...often a property of alpha software). But when something is hard to use, people get nervous when taking any action—especially when those actions deal with money. Smirk abstracts away the protocol's complexity to support confidence and understanding when using Grin. 

### Digital Cash
With its emission rate and community ethos, Grin is setting itself up to be digital cash. Smirk asks what is necessary when a wallet deals primarily with digital cash as the operative metaphor—explicitly not solving for the advanced and merchant use cases (perhaps in another wallet). Smirk subordinates extraneous data and functionality to the prmiary functions of sending, receiving and managing pending transactions.

-----

## Engineering 
Smirk is an Electron client. To get it running, follow the directions below: 

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
