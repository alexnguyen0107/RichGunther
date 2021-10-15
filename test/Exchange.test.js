import {realToken, tokens, ether, EVM_REVERT, ETHER_ADDRESS} from './helpers'

const Token = artifacts.require('./Gunther')
const Exchange = artifacts.require('./Exchange')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Exchange', ([deployer, feeAccount, user1, user2]) => {
    let token
    let exchange
    const feePercent = 10

    beforeEach(async () => {
        // Deploy token
        token = await Token.new()

        // Transfer some tokens to user1
        token.transfer(user1, tokens(1000000000), {from: deployer})

        // Deploy exchange
        exchange = await Exchange.new(feeAccount, feePercent)

        // Transfer all Dapp tokens to farm (1 million)
        await token.transfer(exchange.address, tokens('1000000000'))
        // let balance
        // balance = await token.balanceOf(exchange.address)
        // console.log('balance',realToken(balance.toString()));
    })

    // describe('stake tokens', () => {
    //     let result
    //     let amount
    //
    //     describe('success', () => {
    //         beforeEach(async () => {
    //             amount = tokens(200000)
    //              const  currenTime = await exchange.getTime()
    //              console.log('currenTime',currenTime.toString());
    //             const frontEndHashed = web3.utils.soliditySha3({ type: 'int', value: 200000 }
    //                ,{ type: 'address', value: user1 }
    //                , { type: 'uint256', value: currenTime.toString() });
    //             console.log('frontEndHashed',frontEndHashed);
    //             console.log('user1',user1);
    //             await token.approve(exchange.address, amount, { from: user1 })
    //             result = await exchange.stakeTokens(token.address, amount, { from: user1 })
    //             await token.approve(exchange.address, tokens(1000000), { from: user1 })
    //             result = await exchange.stakeTokens(token.address, tokens(1000000), { from: user1 })
    //         })
    //
    //         it('tracks the token stake', async () => {
    //
    //             // Check exchange token balance
    //             let balance
    //             balance = await token.balanceOf(exchange.address)
    //             console.log('balance',realToken(balance.toString()));
    //             let myStaked
    //             myStaked = await exchange.getTotalStaked({ from: user1 })
    //             console.log('myStaked',realToken(myStaked.toString()));
    //             let balanceuser1
    //             balanceuser1 = await token.balanceOf(user1)
    //             console.log('balanceuser1',realToken(balanceuser1.toString()));
    //         })
    //
    //         it('tracks the token unstake', async () => {
    //             // unstokens
    //             result = await exchange.unstakeTokens(token.address, { from: user1 })
    //             console.log('unstake',result);
    //             let balance
    //             balance = await token.balanceOf(exchange.address)
    //             console.log('balance',realToken(balance.toString()));
    //             let myUnStaked
    //             myUnStaked = await exchange.getTotalStaked({ from: user1 })
    //             console.log('myUnStaked',realToken(myUnStaked.toString()));
    //             let balanceuser1
    //             balanceuser1 = await token.balanceOf(user1)
    //             console.log('balance',realToken(balanceuser1.toString()));
    //         })
    //
    //     })
    //
    // })


    describe('depositing tokens', () => {
        let result
        let amount

        describe('success', () => {
            beforeEach(async () => {
                amount = tokens(10)
                await token.approve(exchange.address, amount, {from: user1})
                result = await exchange.depositToken(token.address, tokens(10), {from: user1})

            })

            it('tracks the token deposit', async () => {
                // Check exchange token balance
                let balance
                // Check tokens on exchange
                balance = await exchange.tokens(token.address, user1)
                balance.toString().should.equal(amount.toString())
            })

            // it('emits a Deposit event', () => {
            //   const log = result.logs[0]
            //   log.event.should.eq('Deposit')
            //   const event = log.args
            //   event.token.should.equal(token.address, 'token address is correct')
            //   event.user.should.equal(user1, 'user address is correct')
            //   event.amount.toString().should.equal(amount.toString(), 'amount is correct')
            //   event.balance.toString().should.equal(amount.toString(), 'balance is correct')
            // })
        })

        // describe('failure', () => {
        //   it('rejects Ether deposits', () => {
        //     exchange.depositToken(ETHER_ADDRESS, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
        //   })
        //
        //   it('fails when no tokens are approved', () => {
        //     // Don't approve any tokens before depositing
        //     exchange.depositToken(token.address, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
        //   })
        // })
    })

    describe('withdrawing tokens', () => {
        let result
        let amount

        describe('success', async () => {
            beforeEach(async () => {
                // Deposit tokens first
                amount = tokens(10)
                const amountWith = tokens(100)
                await token.approve(exchange.address, amount, {from: user1})
                await exchange.depositToken(token.address, amount, {from: user1})

                // const currenTime = await exchange.getTime()
                // console.log('currenTime', currenTime.toString());
                // const frontEndHashed = web3.utils.soliditySha3({type: 'int', value: amountWith}
                //     , {type: 'address', value: user1}
                //     , {type: 'uint256', value: currenTime.toString()});
                // console.log('frontEndHashed', frontEndHashed);
                // let singtest
                // singtest  = await exchange.withdrawTokenSigned(amountWith, token.address, currenTime.toString(), frontEndHashed, {from: user1})
                // const sign = await token.sign()
                // console.log('signsignsignsignsignsign', sign);
                // Withdraw tokens
                result = await exchange.withdrawToken(token.address, amount, { from: user1 })
            })

            it('withdraws token funds', async () => {
                const balance = await exchange.tokens(token.address, user1)
                balance.toString().should.equal('0')
            })

            // it('emits a "Withdraw" event', () => {
            //   const log = result.logs[0]
            //   log.event.should.eq('Withdraw')
            //   const event = log.args
            //   event.token.should.equal(token.address)
            //   event.user.should.equal(user1)
            //   event.amount.toString().should.equal(amount.toString())
            //   event.balance.toString().should.equal('0')
            // })
        })

        // describe('failure', () => {
        //   it('rejects Ether withdraws', () => {
        //     exchange.withdrawToken(ETHER_ADDRESS, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
        //   })
        //
        //   it('fails for insufficient balances', () => {
        //     // Attempt to withdraw tokens without depositing any first
        //     exchange.withdrawToken(token.address, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
        //   })
        // })
    })
    //
    // describe('checking balances', () => {
    //  beforeEach(async () => {
    //   await exchange.depositEther({ from: user1, value: ether(1) })
    //  })
    //
    //  it('returns user balance', async () => {
    //    const result = await exchange.balanceOf(ETHER_ADDRESS, user1)
    //    result.toString().should.equal(ether(1).toString())
    //  })
    // })

})