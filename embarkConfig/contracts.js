const LICENSE_PRICE = "10000000000000000000"; // 10 * Math.pow(10, 18)

const FEE_AMOUNT = "1000000000000000000"; // 1 * Math.pow(10, 18)
const BURN_ADDRESS = "0x0000000000000000000000000000000000000001";

const dataMigration = require('./data.js');

let secret = {};
try {
  secret = require('../.secret.json');
} catch(err) {
  console.dir("warning: .secret.json file not found; this is only needed to deploy to testnet or livenet etc..");
}

module.exports = {
  // default applies to all environments
  default: {
    // Blockchain node to deploy the contracts
    deployment: {
      host: "localhost", // Host of the blockchain node
      port: 8546, // Port of the blockchain node
      type: "ws" // Type of connection (ws or rpc),
      // Accounts to use instead of the default account to populate your wallet
      // The order here corresponds to the order of `web3.eth.getAccounts`, so the first one is the `defaultAccount`
      /*,accounts: [
        {
          privateKey: "your_private_key",
          balance: "5 ether"  // You can set the balance of the account in the dev environment
                              // Balances are in Wei, but you can specify the unit with its name
        },
        {
          privateKeyFile: "path/to/file", // Either a keystore or a list of keys, separated by , or ;
          password: "passwordForTheKeystore" // Needed to decrypt the keystore file
        },
        {
          mnemonic: "12 word mnemonic",
          addressIndex: "0", // Optionnal. The index to start getting the address
          numAddresses: "1", // Optionnal. The number of addresses to get
          hdpath: "m/44'/60'/0'/0/" // Optionnal. HD derivation path
        },
        {
          "nodeAccounts": true // Uses the Ethereum node's accounts
        }
      ]*/
    },
    // order of connections the dapp should connect to
    dappConnection: [
      "$WEB3",  // uses pre existing web3 object if available (e.g in Mist)
      "ws://localhost:8546",
      "http://localhost:8545"
    ],

    // Automatically call `ethereum.enable` if true.
    // If false, the following code must run before sending any transaction: `await EmbarkJS.enableEthereum();`
    // Default value is true.
    // dappAutoEnable: true,

    gas: "auto",

    // Strategy for the deployment of the contracts:
    // - implicit will try to deploy all the contracts located inside the contracts directory
    //            or the directory configured for the location of the contracts. This is default one
    //            when not specified
    // - explicit will only attempt to deploy the contracts that are explicity specified inside the
    //            contracts section.
    strategy: 'implicit',

    contracts: {
      License: {
        args: [
          "$SNT",
          "0x0000000000000000000000000000000000000000",
          LICENSE_PRICE,
          86400 * 365
        ]
      },
      "MetadataStore": {
        args: ["$License"]
      },
      Arbitration: {
        args: ["$accounts[1]"]
      },
      Escrow: {
        args: ["$License", "$Arbitration", "$MetadataStore", "$SNT", BURN_ADDRESS, FEE_AMOUNT],
        onDeploy: ["Arbitration.methods.setEscrowAddress('$Escrow').send()"]
      },
      "MiniMeToken": { "deploy": false },
      "MiniMeTokenFactory": {

      },
      "Fees": {
        "deploy": false
      },
      "SNT": {
        "instanceOf": "MiniMeToken",
        "args": [
          "$MiniMeTokenFactory",
          "0x0000000000000000000000000000000000000000",
          0,
          "TestMiniMeToken",
          18,
          "STT",
          true
        ]
      }
    }
  },

  // default environment, merges with the settings in default
  // assumed to be the intended environment by `embark run`
  development: {
    contracts: {
      StandardToken: { }
    },
    deployment: {
      // The order here corresponds to the order of `web3.eth.getAccounts`, so the first one is the `defaultAccount`
      accounts: [
        {
          nodeAccounts: true
        },
        {
          mnemonic: "foster gesture flock merge beach plate dish view friend leave drink valley shield list enemy",
          balance: "5 ether",
          numAddresses: "10"
        }
      ]
    },
    afterDeploy: dataMigration.bind(null, LICENSE_PRICE, FEE_AMOUNT)
  },

  // merges with the settings in default
  // used with "embark run privatenet"
  privatenet: {
  },

  // merges with the settings in default
  // used with "embark run testnet"
  testnet: {
    deployment: {
      accounts: [
        {
          mnemonic: secret.mnemonic,
          hdpath: "m/44'/1'/0'/0/",
          numAddresses: "10"
        }
      ],
      host: `rinkeby.infura.io/${secret.infuraKey}`,
      port: false,
      protocol: 'https',
      type: "rpc"
    },
    afterDeploy: dataMigration.bind(null, LICENSE_PRICE, FEE_AMOUNT)
  },

  // merges with the settings in default
  // used with "embark run livenet"
  livenet: {
  }

  // you can name an environment with specific settings and then specify with
  // "embark run custom_name" or "embark blockchain custom_name"
  //custom_name: {
  //}
};