import { expect } from 'chai'
import { CredentialService } from './CredentialService'
import { DragonchainRequestObject } from '../dragonchain-service/DragonchainRequestObject'
import { stub } from 'sinon'

describe('CredentialService', () => {
  describe('.getAuthorizationHeader', () => {
    it('returns expected hmac', async () => {
      const authKey = 'api-key'
      const authKeyId = 'api-key-id'
      stub(CredentialService, 'getDragonchainCredentials').onFirstCall().returns(Promise.resolve({ authKey, authKeyId }))
      const dro = {
        method: 'GET',
        path: 'fake-path',
        dragonchainId: 'fake-dcid',
        timestamp: 'fake-imestamp',
        message: 'hi!',
        contentType: 'fakeContentType',
        url: 'http.fake.org',
        hmacAlgo: 'sha256',
        version: '1'
      } as DragonchainRequestObject
      const result = await CredentialService.getAuthorizationHeader(dro)
      expect(result).to.equal('DC1-HMAC-sha256 api-key-id:KUOpLFDyk+AhFmEg6n2e8RMC8yNlDaMMtkC5rC8hXLI=')
    })
  })
})
