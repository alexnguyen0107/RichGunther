import {realToken, tokens, ether, EVM_REVERT, ETHER_ADDRESS} from './helpers'

const Token = artifacts.require('./Gunther')
const Yugioh = artifacts.require('./Yugioh')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Yugioh', ([deployer, user1,user2]) => {
    let token
    let yugioh
    let balance
    beforeEach(async () => {
        // Deploy token
        token = await Token.new()

        // Transfer some tokens to user1
        console.log("deployer:", deployer);
        console.log("user1:", user1);
        console.log("user2:", user2);

        balance = await token.balanceOf(deployer)
        await token.transfer(user1, tokens(800000), {from: deployer})
        await token.transfer(user2, tokens(600000), {from: deployer})

        balance = await token.balanceOf(deployer)

        console.log("balance:", balance.toString());
        balance = await token.balanceOf(user1)
        console.log("balance user1:", balance.toString());

        balance = await token.balanceOf(user2)
        console.log("balance user2:", balance.toString());
        // Deploy exchange
        yugioh = await Yugioh.new()

    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = yugioh.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        // it('has a name', async () => {
        //     const name = await yugioh.name()
        //     assert.equal(name, 'Yugioh')
        // })
        //
        // it('has a symbol', async () => {
        //     const symbol = await yugioh.symbol()
        //     assert.equal(symbol, 'YUGI')
        // })


    })

    describe('Mint nft', async () => {
        it('lists colors', async () => {
            // Mint 3 more tokens

            await yugioh.mint(token.address, {from: user1})
            await yugioh.mintN(token.address,5, {from: user2})
            await yugioh.mint(token.address, {from: user1})
            await yugioh.mint(token.address, {from: user2})
            await yugioh.mintN(token.address,10, {from: user1})

            let balanceAfter
            balanceAfter = await token.balanceOf(user1)
            console.log("balanceAfter1:", balanceAfter.toString());

            balanceAfter = await token.balanceOf(user2)
            console.log("balanceAfter2:", balanceAfter.toString());

            // const balancedeployerAfter = await token.balanceOf(deployer)
            // console.log("balancedeployerAfter:", balancedeployerAfter.toString());
            let nftUser1
            nftUser1 = await yugioh.tokensOfOwner11({from: user1})
            for (var i = 0; i < nftUser1.length; i++) {
                console.log("tokenId nftUser1 :", nftUser1[i].toString());
            }

            let nftUser2
            nftUser2 = await yugioh.tokensOfOwner11({from: user2})
            for (var i = 0; i < nftUser2.length; i++) {
                console.log("tokenId nftUser2:", nftUser2[i].toString());
            }

            await yugioh.createProduct(1, tokens(20000), {from: user1})
            await yugioh.createProduct(7, tokens(30000), {from: user1})

            const product1 = await yugioh.getPrice(1)
            console.log("product 1:",product1.toString())
            const product3 = await yugioh.products(3)
            console.log("product 3:",product3.price.toString())


            await token.approve(yugioh.address, tokens(20000), { from: user2 })
            await yugioh.purchaseProduct(token.address, 1, {from: user2})

            nftUser1 = await yugioh.tokensOfOwner11({from: user1})
            for (var i = 0; i < nftUser1.length; i++) {
                console.log("tokenId nftUser1:", nftUser1[i].toString());
            }
            nftUser2 = await yugioh.tokensOfOwner11({from: user2})
            for (var i = 0; i < nftUser2.length; i++) {
                console.log("tokenId nftUser2:", nftUser2[i].toString());
            }
            balance = await token.balanceOf(user1)
            console.log("balance user1:", balance.toString());

            balance = await token.balanceOf(user2)
            console.log("balance user2:", balance.toString());

            await yugioh.createProduct(1, tokens(100000), {from: user2})

            await token.approve(yugioh.address, tokens(100000), { from: user1 })
            await yugioh.purchaseProduct(token.address, 1, {from: user1})

            nftUser1 = await yugioh.tokensOfOwner11({from: user1})
            for (var i = 0; i < nftUser1.length; i++) {
                console.log("tokenId nftUser1:", nftUser1[i].toString());
            }
            nftUser2 = await yugioh.tokensOfOwner11({from: user2})
            for (var i = 0; i < nftUser2.length; i++) {
                console.log("tokenId nftUser2:", nftUser2[i].toString());
            }
            balance = await token.balanceOf(user1)
            console.log("balance user1:", balance.toString());

            balance = await token.balanceOf(user2)
            console.log("balance user2:", balance.toString());
        })
    })

})