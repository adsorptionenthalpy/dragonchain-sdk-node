import { expect } from 'chai'
import { CredentialService } from './CredentialService'
import { DragonchainRequestObject } from '../dragonchain-client/DragonchainRequestObject'
import { stub } from 'sinon'

describe('CredentialService', () => {
  describe('.getAuthorizationHeader', () => {
    it('returns expected hmac', async () => {
      const authKey = 'fake-api-key'
      const authKeyId = 'fake-api-key-id'
      stub(CredentialService, 'getDragonchainCredentials').onFirstCall().returns(Promise.resolve({ authKey, authKeyId }))
      const dro = {
        method: 'GET',
        path: 'fake-path',
        dragonchainId: 'fake-dcid',
        timestamp: 'fake-imestamp',
        message: 'hi!',
        headers: {},
        body: '',
        contentType: 'fakeContentType',
        url: 'http.fake.org',
        hmacAlgo: 'sha256',
        version: '1',
        asFetchOptions: () => ({ method: dro.method, headers: dro.headers, body: dro.body })
      } as DragonchainRequestObject
      const result = await CredentialService.getAuthorizationHeader(dro)
      expect(result).to.equal('DC1-HMAC-sha256 fake-api-key-id:dKRbNGk1QxbSHLL4J3kbIBcsE/7Al8BdDyb8o3Mxt9s=')
    })
  })
})
