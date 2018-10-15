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

  describe('!200', () => {
    const fakeResponseObj = { body: 'fakeResponseBody' }
    const fakeCredentialService = { getAuthorizationHeader: stub().resolves('fakeCreds') }
    const fakeLogger = { log: stub(), debug: stub() }

    describe('403', () => {
      const fakeFetch = stub().resolves({ status: 403, json: stub().resolves(fakeResponseObj) })
      const client = new DragonchainClient('fakeDragonchainId', true, fakeFetch, fakeCredentialService, fakeLogger)
      it('throws TOKEN_INVALID', async () => {
        try {
          await client.getBlock('whocares')
        } catch (e) {
          expect(e.code).to.equal('TOKEN_INVALID')
        }
      })
    })

    describe('401', () => {
      const fakeFetch = stub().resolves({ status: 401, json: stub().resolves(fakeResponseObj) })
      const client = new DragonchainClient('fakeDragonchainId', true, fakeFetch, fakeCredentialService, fakeLogger)
      it('throws UNAUTHORIZED', async () => {
        try {
          await client.getBlock('whocares')
        } catch (e) {
          expect(e.code).to.equal('UNAUTHORIZED')
        }
      })
    })

    describe('409', () => {
      const fakeFetch = stub().resolves({ status: 409, json: stub().resolves(fakeResponseObj) })
      const client = new DragonchainClient('fakeDragonchainId', true, fakeFetch, fakeCredentialService, fakeLogger)
      it('throws ALREADY_CLAIMED', async () => {
        try {
          await client.getBlock('whocares')
        } catch (e) {
          expect(e.code).to.equal('ALREADY_CLAIMED')
        }
      })
    })

    describe('404', () => {
      const fakeFetch = stub().resolves({ status: 404, json: stub().resolves(fakeResponseObj) })
      const client = new DragonchainClient('fakeDragonchainId', true, fakeFetch, fakeCredentialService, fakeLogger)
      it('throws NOT_FOUND', async () => {
        try {
          await client.getBlock('whocares')
        } catch (e) {
          expect(e.code).to.equal('NOT_FOUND')
        }
      })
    })

    describe('500', () => {
      const fakeFetch = stub().resolves({ status: 500, json: stub().resolves(fakeResponseObj) })
      const client = new DragonchainClient('fakeDragonchainId', true, fakeFetch, fakeCredentialService, fakeLogger)
      it('throws GENERIC_ERROR', async () => {
        try {
          await client.getBlock('whocares')
        } catch (e) {
          expect(e.code).to.equal('GENERIC_ERROR')
        }
      })
    })

    describe('unexpected', () => {
      const fakeFetch = stub().resolves({ status: 111, json: stub().resolves(fakeResponseObj) })
      const client = new DragonchainClient('fakeDragonchainId', true, fakeFetch, fakeCredentialService, fakeLogger)
      it('throws REQUEST_ERROR', async () => {
        try {
          await client.getBlock('whocares')
        } catch (e) {
          expect(e.code).to.equal('REQUEST_ERROR')
        }
      })
    })
  })

  describe('GET', () => {
    let fakeResponseObj
    let fakeFetch: any
    let fakeCredentialService
    let fakeLogger
    let client: DragonchainClient
    let expectedFetchOptions: any

    beforeEach(() => {
      fakeResponseObj = { body: 'fakeResponseBody' }
      fakeFetch = stub().resolves({ status: 200, json: stub().resolves(fakeResponseObj) })
      fakeCredentialService = { getAuthorizationHeader: stub().resolves('fakeCreds') }
      fakeLogger = { log: stub(), debug: stub() }
      client = new DragonchainClient('fakeDragonchainId', true, fakeFetch, fakeCredentialService, fakeLogger)
      expectedFetchOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'fakeCreds'
        }
      }
    })
    describe('.getTransaction', () => {
      it('calls #fetch() with correct params', async () => {
        const id = 'batman-transaction-id'
        await client.getTransaction(id)
        assert.calledWith(fakeFetch, `https://fakeDragonchainId.api.dragonchain.com/transaction/${id}`, expectedFetchOptions)
      })
    })

    describe('.setDragonchainId', () => {
      it('allows resetting the dragonchainId', async () => {
        const id = 'goo-transaction-id'
        client.setDragonchainId('hotBanana')
        await client.getTransaction(id)
        assert.calledWith(fakeFetch, `https://hotBanana.api.dragonchain.com/transaction/${id}`, expectedFetchOptions)
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
