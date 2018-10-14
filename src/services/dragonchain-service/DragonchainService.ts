/**
 * DragonchainService
 * This module is meant to encapsulate the HTTP transactions bound for your Dragonchain.
 */
import { FailureByDesign } from 'src/errors/FailureByDesign'
import { DragonchainRequestObject } from './DragonchainRequestObject'
import { CredentialService } from '../credential-service/CredentialService'

/**
 * @class DragonchainService
 * @description HTTP Client that interfaces with the dragonchain api, using credentials stored on your machine.
 */
export class DragonchainService {
  dragonchainId: string
  verify: boolean
  defaultFetchOptions: FetchOptions

  /**
   * @public
   * @name constructor
   * @returns {DragonchainService} an instance of a Dragonchain HTTP Client
   * @param {string} dragonchainId dragonchain id to associate with this client
   * @param {string|undefined} verify (Optional: true) Verify the TLS certificate of the dragonchain
   */
  constructor (dragonchainId: string, verify = true) {
    if (typeof dragonchainId !== 'string') throw new FailureByDesign('VALIDATION_ERROR', 'dragonchainId must be a string.')
    if (dragonchainId === undefined) throw new FailureByDesign('VALIDATION_ERROR', 'dragonchainId not be undefined.')
    this.dragonchainId = dragonchainId
    this.verify = verify
    this.defaultFetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    } as FetchOptions
  }

  /**
   * @static
   * @name isValidRuntime
   * @description Checks if a runtime string is valid
   * @param {string} runtime runtime to validate
   * @returns {boolean} true if runtime is valid, false if not.
   */
  static isValidRuntime = (runtime: string) => validRuntimes.includes(runtime)

  /**
   * @static
   * @name isValidSmartContractType
   * @description Checks if a smart contract type string is valid
   * @param {string} smartContractType smartContractType to validate
   * @returns {boolean} true if smart contract type is valid, false if not
   */
  static isValidSmartContractType = (smartContractType: string) => validSmartContractTypes.includes(smartContractType)

  /**
   * @name setDragonchainId
   * @description setter for dragonchainId
   * @param {string} dragonchainId
   */
  public setDragonchainId = (dragonchainId: string) => {
    this.dragonchainId = dragonchainId
  }

  get (path: string) {
    const options = { method: 'GET' } as FetchOptions
    return this.makeRequest(path, options)
  }

  post (path: string, body: object) {
    const options = { method: 'POST', body: JSON.stringify(body) } as FetchOptions
    return this.makeRequest(path, options)
  }

  put (path: string, body: object) {
    const options = { method: 'PUT', body: JSON.stringify(body) } as FetchOptions
    return this.makeRequest(path, options)
  }

  delete (path: string) {
    const options = { method: 'DELETE' } as FetchOptions
    return this.makeRequest(path, options)
  }

  async makeRequest (path: string, options: FetchOptions) {
    const requestParams = { ...this.defaultFetchOptions, ...options } as FetchOptions
    const dro = new DragonchainRequestObject(requestParams.method, path, this.dragonchainId, options.body || '')
    requestParams.headers.Authorization = await CredentialService.getAuthorizationHeader(dro)
    try {
      const url = `https://${this.dragonchainId}.api.dragonchain.com${path}`
      console.debug(`[DragonchainClient][${options.method}] => ${url}`)
      const res = await fetch(url, requestParams)
      const jsonAsObject = await res.json()
      if (res.status === 403) {
        throw new FailureByDesign('TOKEN_INVALID', jsonAsObject)
      }

      if (res.status === 401) {
        throw new FailureByDesign('UNAUTHORIZED', jsonAsObject)
      }

      if (res.status === 409) {
        throw new FailureByDesign('ALREADY_CLAIMED', jsonAsObject)
      }

      if (res.status === 404) {
        throw new FailureByDesign('NOT_FOUND', jsonAsObject)
      }

      if (res.status === 500) {
        throw new FailureByDesign('GENERIC_ERROR', jsonAsObject)
      }
      console.debug(`[DragonchainClient][${options.method}] ${url} <= ${res.status} ${JSON.stringify(jsonAsObject)}`)

      return jsonAsObject
    } catch (e) {
      console.debug('[DragonchainClient] ERROR', e)
      throw new FailureByDesign('REQUEST_ERROR', `Error while communicating with the dragonchain: ${JSON.stringify(e)}`)
    }
  }
}

const validRuntimes = [
  'nodejs6.10',
  'nodejs8.10',
  'java8',
  'python2.7',
  'python3.6',
  'dotnetcore1.0',
  'dotnetcore2.0',
  'dotnetcore2.1',
  'go1.x'
]

const validSmartContractTypes = [
  'transaction',
  'cron'
]

interface FetchOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers: {
    'Content-Type': 'application/json'
    Authorization: string
  }
  body: string
}

/**
 * All Humans are welcome.
 */
