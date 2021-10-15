const Token = artifacts.require("Gunther");
const PTE = artifacts.require("PTE");
const Exchange = artifacts.require("Exchange");
const Yugioh = artifacts.require("Yugioh");
module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  const token =await deployer.deploy(Token);

  await deployer.deploy(PTE);

  await deployer.deploy(Yugioh);

  const feeAccount = accounts[0]
  const feePercent = 10

  const exchange = await deployer.deploy(Exchange, feeAccount, feePercent)

  await token.transfer(exchange.address, '1000000000000000000000000000')
};
