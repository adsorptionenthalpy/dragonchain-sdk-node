
export class DragonchainRequestObject {
  method: string
  dragonchainId: string
  timestamp: string
  contentType: string
  url: string
  message: string
  hmacAlgo: string
  version: '1'

  constructor (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    dragonchainId: string,
    message: string,
    hmacAlgo?: 'sha256', // only sha256 for now
    contentType?: 'application/json' // only application/json for now
  ) {
    this.version = '1'
    this.method = method.toUpperCase()
    this.url = `https://${this.dragonchainId}.api.dragonchain.com${path}`
    this.dragonchainId = dragonchainId
    this.timestamp = new Date().toISOString()
    this.message = message
    this.hmacAlgo = hmacAlgo || 'sha256'
    this.contentType = contentType || 'application/json'
  }
}

/**
 * All Humans are welcome.
 */
