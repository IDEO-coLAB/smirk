# Smirk ;)
> A user-friendly Grin client

## Inspiration
Grin is a [lightweight, privacy-focused cryptocurrency](http://grin-tech.org) set to launch in early 2019. Community financed from the beginning, Grin has bootstrapped a development team through some lean times. As a result, the urgency for a user-focused Grin client has (understandably) taken a back seat to protocol development.

Today, the need exists for a client and user experience that meets the promises of simplicity and levity. 

__Enter Smirk.__

## Design Research
With IDEO design research in its DNA, Smirk was started by identifying and interviewing the people likely to make up Grin's initial user base; this ranged from savvy cryptocurrency developers and GPU miners, to those who have only heard the term UTXO. Smirk moved through several rounds of design and UX iteration to arrive at its design language and principles.

## Desing Principles

### Simplicity
Grin was found to be notoriously hard to use for most people (even discounting the moving target of fast-moving software). When something is hard to use, people get nervous when taking actions—especially when those actions deal with money. Smirk migrates away from complexity to build a person's confidence and support their understanding. 

### Digital Cash
With its emission rate and community ethos, Grin is setting itself up to be digital cash. Smirk asks what would be necessary if a wallet dealt primarily with the digital cash as the operative metaphor—explicitly not solving for the advanced and merchant use cases (perhaps in another wallet). This path led Smirk to hide many extraneous data points and functionality that are typically bundled in with cryptocurrency wallets.

##### note: these docs are a wip

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
