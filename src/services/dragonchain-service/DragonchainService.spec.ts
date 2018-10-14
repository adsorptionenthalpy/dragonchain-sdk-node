import { expect } from 'chai'
import { DragonchainService } from './DragonchainService'

describe('DragonchainService', () => {
  describe('constructor', () => {
    it('returns instance of DragonchainService', () => {
      const dragonchainService = new DragonchainService('banana')
      expect(dragonchainService instanceof DragonchainService).to.equal(true)
    })

    it('assigns dragonchainId', () => {
      const dragonchainService = new DragonchainService('banana')
      expect(dragonchainService.dragonchainId).to.equal('banana')
    })

    it('assigns verify', () => {
      const verify = false
      const dragonchainService = new DragonchainService('banana', verify)
      expect(dragonchainService.verify).to.equal(verify)
    })

    it('sets default verify to true', () => {
      const dragonchainService = new DragonchainService('banana')
      expect(dragonchainService.verify).to.equal(true)
    })

    it('sets default defaultFetchOptions', () => {
      const dragonchainService = new DragonchainService('banana')
      expect(dragonchainService.defaultFetchOptions).to.deep.equal({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    })
  })

  describe('.isValidRuntime', () => {
    it('returns true when valid', () => {
      expect(DragonchainService.isValidRuntime('nodejs6.10')).to.equal(true)
      expect(DragonchainService.isValidRuntime('nodejs8.10')).to.equal(true)
      expect(DragonchainService.isValidRuntime('java8')).to.equal(true)
      expect(DragonchainService.isValidRuntime('python2.7')).to.equal(true)
      expect(DragonchainService.isValidRuntime('python3.6')).to.equal(true)
      expect(DragonchainService.isValidRuntime('dotnetcore1.0')).to.equal(true)
      expect(DragonchainService.isValidRuntime('dotnetcore2.0')).to.equal(true)
      expect(DragonchainService.isValidRuntime('dotnetcore2.1')).to.equal(true)
      expect(DragonchainService.isValidRuntime('go1.x')).to.equal(true)
    })
    it('returns false when invalid', () => {
      expect(DragonchainService.isValidRuntime('derp')).to.equal(false)
    })
  })

  describe('.isValidSmartContractType', () => {
    it('returns true when valid', () => {
      expect(DragonchainService.isValidSmartContractType('transaction')).to.equal(true)
      expect(DragonchainService.isValidSmartContractType('cron')).to.equal(true)
    })
    it('returns false when invalid', () => {
      expect(DragonchainService.isValidSmartContractType('derp')).to.equal(false)
    })
  })

  describe('.setDragonchainId', () => {
    it('sets dragonchainId', () => {
      const dragonchainService = new DragonchainService('banana')
      dragonchainService.setDragonchainId('not a banana')
      expect(dragonchainService.dragonchainId).to.equal('not a banana')
    })
  })

})

/**
 * All Humans are welcome.
 */
