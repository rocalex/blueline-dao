## TASK

To create a peer-to-peer bond marketplace working model in web3.

## Protocols

- [Gnosis Safe](https://safe.global)
- [Polygon](https://polygon.technology)
- [ENS](https://ens.domains)
- [EPNS](https://push.org)
- [IPFS](https://ipfs.tech)

## Workflow

- Install and set up the necessary tools and dependencies, including the Polygon SDK, Gnosis Safe SDK, and web3.js.
- Create a new project directory and initialize a new NPM project.
- Create a new Gnosis Safe using the Gnosis Safe SDK, and transfer funds to the Safe to be used as the marketplace's escrow account (TODO: Gnosis Safe SDK has an issue, so should be solved).
- Create a new ENS domain using the ENS SDK, and configure it to point to the marketplace's front-end.
- Design and implement the front-end of the marketplace using a framework such as React or Vue.js, and integrate it with the Gnosis Safe SDK and ENS SDK.
- Implement the back-end of the marketplace using a server-side framework such as Node.js, and integrate it with the Polygon SDK and Gnosis Safe SDK.
- Create smart contracts to represent the bonds to be listed on the marketplace, and deploy them to the Polygon network using the Polygon SDK. <br>
The first step in building a web3 bond marketplace is to create smart contracts that represent the bonds to be listed on the marketplace. These smart contracts should define the parameters of the bonds, such as the issuer, maturity date, coupon rate, collateral, and credit rating. Once the smart contracts are created, they should be deployed to the Polygon network using the Polygon SDK.
- Create smart contracts to facilitate the peer-to-peer trading of bonds on the marketplace, and deploy them to the Polygon network using the Polygon SDK.
- Write unit tests for the smart contracts and run them using a testing framework such as Truffle.
- Integrate the smart contracts with the front-end and back-end of the marketplace using web3.js.
- Create user authentication and profile management system for companies that want to list their bonds.
- Create a form for companies to list their bonds, including bond details such as name, duration, interest rate, and amount.
- Use IPFS to store and distribute the bond-related content such as prospectuses and other documents.
- Implement a search and filter functionality for users to discover available bonds based on their preferences.
- Create a system for users to invest in the listed bonds and transfer funds to the escrow account. <br/>
This system should be secure and easy to use, and should allow investors to connect their Metamask wallets to invest in bonds. To ensure the safety of the funds, we can use Gnosis Safe for creating an escrow account.
- Implement a notification system for companies and users to keep track of their investments and listing status.

## Hosting

Host the working model using Vercel or Netlify.

## Files

Here's a list of files that might be created as part of this workflow:

- `package.json` (NPM project configuration file)
- `index.html` (front-end HTML file & use the logo gusto2.png that is provided)
- `index.js` (front-end JavaScript file)
- `App.js` (React/Vue.js component)
- `server.js` (back-end server code)
- `Bond.sol` (bond smart contract)
- `BondMarket.sol` (marketplace smart contract)
- `test/Bond.test.js` (smart contract unit test file)
- `test/BondMarket.test.js` (smart contract unit test file)
- `userAuth.sol` (user authentication smart contract)
- `bondListing.sol` (bond listing smart contract)
- `investBond.sol` (bond investment smart contract)
- `prospectus.pdf` (example bond-related content stored on IPFS)