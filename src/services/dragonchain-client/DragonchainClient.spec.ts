import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { stub, assert } from 'sinon'
import { DragonchainClient } from './DragonchainClient'

const { expect } = chai
chai.use(sinonChai)

describe('DragonchainClient', () => {
  describe('constructor', () => {
    it('returns instance of DragonchainClient', () => {
      const client = new DragonchainClient('banana')
      expect(client instanceof DragonchainClient).to.equal(true)
    })
  })

  describe('.isValidRuntime', () => {
    it('returns true when valid', () => {
      expect(DragonchainClient.isValidRuntime('nodejs6.10')).to.equal(true)
      expect(DragonchainClient.isValidRuntime('nodejs8.10')).to.equal(true)
      expect(DragonchainClient.isValidRuntime('java8')).to.equal(true)
      expect(DragonchainClient.isValidRuntime('python2.7')).to.equal(true)
      expect(DragonchainClient.isValidRuntime('python3.6')).to.equal(true)
      expect(DragonchainClient.isValidRuntime('dotnetcore1.0')).to.equal(true)
      expect(DragonchainClient.isValidRuntime('dotnetcore2.0')).to.equal(true)
      expect(DragonchainClient.isValidRuntime('dotnetcore2.1')).to.equal(true)
      expect(DragonchainClient.isValidRuntime('go1.x')).to.equal(true)
    })
    it('returns false when invalid', () => {
      expect(DragonchainClient.isValidRuntime('derp')).to.equal(false)
    })
  })

  describe('.isValidSmartContractType', () => {
    it('returns true when valid', () => {
      expect(DragonchainClient.isValidSmartContractType('transaction')).to.equal(true)
      expect(DragonchainClient.isValidSmartContractType('cron')).to.equal(true)
    })
    it('returns false when invalid', () => {
      expect(DragonchainClient.isValidSmartContractType('derp')).to.equal(false)
    })
  })

  describe('GET', () => {
    const fakeResponseObj = { body: 'fakeResponseBody' }
    const fakeFetch = stub().resolves({ status: 200, json: stub().resolves(fakeResponseObj) })
    const fakeCredentialService = { getAuthorizationHeader: stub().resolves('fakeCreds') }
    const fakeLogger = { log: stub(), debug: stub() }
    const client = new DragonchainClient('fakeDragonchainId', true, fakeFetch, fakeCredentialService, fakeLogger)
    const expectedFetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'fakeCreds'
      }
    }
    describe('.getTransaction', () => {
      it('calls #fetch() with correct params', async () => {
        const id = 'batman-transaction-id'
        await client.getTransaction(id)
        assert.calledWith(fakeFetch, `https://fakeDragonchainId.api.dragonchain.com/transaction/${id}`, expectedFetchOptions)
      })
    })

    describe('.getBlock', () => {
      it('calls #fetch() with correct params', async () => {
        const id = 'robin-block-id'
        await client.getBlock(id)
        assert.calledWith(fakeFetch, `https://fakeDragonchainId.api.dragonchain.com/block/${id}`, expectedFetchOptions)
      })
    })

    describe('.getSmartContract', () => {
      it('calls #fetch() with correct params', async () => {
        const id = 'joker-smartcontract-id'
        await client.getSmartcontract(id)
        assert.calledWith(fakeFetch, `https://fakeDragonchainId.api.dragonchain.com/smartcontract/${id}`, expectedFetchOptions)
      })
    })
  })

  describe('POST', () => {
    const fakeResponseObj = { body: 'fakeResponseBody' }
    const fakeFetch = stub().resolves({ status: 200, json: stub().resolves(fakeResponseObj) })
    const fakeCredentialService = { getAuthorizationHeader: stub().resolves('fakeCreds') }
    const fakeLogger = { log: stub(), debug: stub() }
    const client = new DragonchainClient('fakeDragonchainId', true, fakeFetch, fakeCredentialService, fakeLogger)
    const expectedFetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'fakeCreds'
      }
    }

    describe('.postTransaction', () => {
      it('calls #fetch() with correct params', async () => {
        const transactionCreatePayload = {
          version: '1',
          txn_type: 'transaction',
          payload: 'hi!' ,
          tag: 'Awesome!'
        }
        await client.postTransaction(transactionCreatePayload)
        const obj = { ...expectedFetchOptions, body: JSON.stringify(transactionCreatePayload) }
        assert.calledWith(fakeFetch, `https://fakeDragonchainId.api.dragonchain.com/transaction`, obj)
      })
    })
  })

})

/**
 * All Humans are welcome.
 */