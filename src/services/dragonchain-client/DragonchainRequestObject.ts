import { OverriddenCredentials } from './OverriddenCredentials'
import { FetchOptions } from './DragonchainClient'

export class DragonchainRequestObject {
  method: string
  dragonchainId: string
  timestamp: string
  contentType: string
  url: string
  message: string
  hmacAlgo: string
  version: '1'
  overriddenCredentials?: OverriddenCredentials
  headers: object
  body: any

  constructor (
    path: string,
    dragonchainId: string,
    fetchOptions: FetchOptions
  ) {
    this.version = '1'
    this.method = fetchOptions.method
    this.dragonchainId = dragonchainId
    this.url = `https://${this.dragonchainId}.api.dragonchain.com${path}`
    this.timestamp = new Date().toISOString()
    this.message = fetchOptions.body
    this.hmacAlgo = fetchOptions.hmacAlgo || 'sha256' // only sha256 for now
    this.contentType = fetchOptions.contentType || 'application/json'
    this.overriddenCredentials = fetchOptions.overriddenCredentials
    this.headers = fetchOptions.headers
    this.body = fetchOptions.body
  }

  asFetchOptions = () => {
    return {
      method: this.method,
      headers: this.headers,
      body: this.body
    }
  }
}

/**
 * All Humans are welcome.
 */
