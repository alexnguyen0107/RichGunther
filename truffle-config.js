require('babel-register');
require('babel-polyfill');
require('dotenv').config();
// const HDWalletProvider = require('truffle-hdwallet-provider-privkey');
const HDWalletProvider = require('@truffle/hdwallet-provider');


const mnemonics = 'hello corn Button sea config day curtain embody compilers work jazz Form'

    //process.env.PRIVATE_KEYS || ""

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    // kovan: {
    //   provider: function() {
    //     return new HDWalletProvider(
    //       privateKeys.split(','), // Array of account private keys
    //       `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`// Url to an Ethereum Node
    //     )
    //   },
    //   gas: 5000000,
    //   gasPrice: 25000000000,
    //   network_id: 42
    // },
    bscTest: {
      provider: () => {
        return new HDWalletProvider(
             mnemonics, // Array of account private keys
            `https://speedy-nodes-nyc.moralis.io/be5bcc02f06a9eb42e453bbb/bsc/testnet`// Url to an Ethereum Node
        )
      },
      gas: 5500000,
      gasPrice: 25000000000,
      network_id: 97,
      confirmations:2,
      timeoutBlocks:200,
      skipDryRun: true
    },
    testnet: {
      provider: () => new HDWalletProvider(mnemonics, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    bsc: {
      provider: () => new HDWalletProvider(mnemonics, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}