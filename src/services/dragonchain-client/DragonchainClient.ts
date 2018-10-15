/**
 * DragonchainClient
 * This module is meant to encapsulate the HTTP transactions bound for your Dragonchain.
 */
import { FailureByDesign } from '../../errors/FailureByDesign'
import { DragonchainRequestObject } from './DragonchainRequestObject'
import { CredentialService } from '../credential-service/CredentialService'
import fetch from 'node-fetch'
import { DragonchainTransactionCreatePayload } from 'src/interfaces/DragonchainTransaction';

/**
 * @class DragonchainClient
 * @description HTTP Client that interfaces with the dragonchain api, using credentials stored on your machine.
 */
export class DragonchainClient {
  private dragonchainId: string
  private verify: boolean
  private defaultFetchOptions: FetchOptions
  private credentialService: any
  private fetch: any
  private logger: any

  /**
   * @public
   * @name constructor
   * @returns {DragonchainClient} an instance of a Dragonchain HTTP Client
   * @param {string} dragonchainId dragonchain id to associate with this client
   * @param {boolean|undefined} verify (Optional: true) Verify the TLS certificate of the dragonchain
   */
  constructor (dragonchainId: string, verify = true, injectedFetch: any = null, injectedCredentialService: any = null, logger: any = null) {
    this.dragonchainId = dragonchainId
    this.verify = verify
    this.logger = logger || console
    this.fetch = injectedFetch || fetch
    this.credentialService = injectedCredentialService || CredentialService
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

  public getTransaction = (transactionId: string) => {
    return this.get(`/transaction/${transactionId}`)
  }

  public getBlock = (blockId: string) => {
    return this.get(`/block/${blockId}`)
  }

  public getSmartcontract = (contractName: string) => {
    return this.get(`/smartcontract/${contractName}`)
  }

  public postTransaction = (transactionObject: DragonchainTransactionCreatePayload) => {
    return this.post(`/transaction`, transactionObject)
  }

  private get (path: string) {
    const options = { method: 'GET' } as FetchOptions
    return this.makeRequest(path, options)
  }

  private post (path: string, body: object) {
    const options = { method: 'POST', body: JSON.stringify(body) } as FetchOptions
    return this.makeRequest(path, options)
  }

  // private put (path: string, body: object) {
  //   const options = { method: 'PUT', body: JSON.stringify(body) } as FetchOptions
  //   return this.makeRequest(path, options)
  // }

  // private delete (path: string) {
  //   const options = { method: 'DELETE' } as FetchOptions
  //   return this.makeRequest(path, options)
  // }

  private async makeRequest (path: string, options: FetchOptions) {
    const requestParams = { ...this.defaultFetchOptions, ...options } as FetchOptions
    const dro = new DragonchainRequestObject(requestParams.method, path, this.dragonchainId, options.body || '')
    requestParams.headers.Authorization = await this.credentialService.getAuthorizationHeader(dro)
    try {
      this.logger.debug(`[DragonchainClient][${options.method}] => ${dro.url}`)
      const res = await this.fetch(dro.url, requestParams)
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
      this.logger.debug(`[DragonchainClient][${options.method}] <= ${dro.url} ${res.status} ${JSON.stringify(jsonAsObject)}`)

      return jsonAsObject
    } catch (e) {
      this.logger.debug('[DragonchainClient] ERROR', e)
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

export interface FetchOptions {
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
