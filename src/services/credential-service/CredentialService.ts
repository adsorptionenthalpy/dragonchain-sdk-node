import { readFile } from 'fs'
const path = require('path') // import does not work
const os = require('os') // import does not work
import * as crypto from 'crypto'
import ini from 'ini'
import { DragonchainRequestObject } from '../dragonchain-client/DragonchainRequestObject'
import { DragonchainCredentials } from './DragonchainCredentials'
import { FailureByDesign } from '../../errors/FailureByDesign'
import { promisify } from 'util'

/**
 * @class CredentialService
 * @description Stateless service to retrieve Dragonchain credentials for use in API requests
 */
export class CredentialService {
  /**
   * @hidden
   */
  private static iPromiseToReadThisFile = promisify(readFile)

  /**
   * Return the HMAC signature used as the Authorization Header on REST requests to your dragonchain.
   * By default, this function searches for credentials on your hard-drive for the requested dragonchainId.
   * If you do not have matching dragonchain credentials in your home directory, you must directly override
   * the credentials using the `DragonchainRequestObject#overridenCredentials` member.
   *
   * An easy way to achieve this is to use the `DragonchainClient#overrideCredentials` method.
   * @public
   */
  public static getAuthorizationHeader = async (dro: DragonchainRequestObject) => {
    const { version, hmacAlgo, dragonchainId } = dro
    const dcCreds = await CredentialService.getDragonchainCredentials(dragonchainId)
    const { authKey, authKeyId } = dcCreds
    const message = CredentialService.getHmacMessageString(dro)
    const hmac = crypto.createHmac(hmacAlgo, authKey)
    const signature = hmac.update(message).digest('base64')
    return `DC${version}-HMAC-${hmacAlgo} ${authKeyId}:${signature}`
  }

  /**
   * @hidden
   * @private
   * @name getDragonchainCredentials
   * @description Get an authKey/authKeyId pair
   * @param {string} DragonchainId (optional) dragonchainId to get keys for (default pulling from config files)
   * @returns {DragonchainCredentials}
   * @throws {FailureByDesign<NOT_FOUND|UNEXPECTED_ERROR>}
   */
  static getDragonchainCredentials = async (dragonchainId: string): Promise<DragonchainCredentials> => {
    // check env vars first
    const creds = CredentialService.getCredsFromEnvVars()
    if (creds) return creds

    // make sure dragonchainId is passed so we can look on disk
    if (dragonchainId === undefined) { throw new FailureByDesign('VALIDATION_ERROR', '"dragonchainId" can not be undefined when checking Dragonchain credential file.') }

    // check credential file on disk.
    const credentialFilePath = CredentialService.getCredentialFilePath()
    try {
      const file = await CredentialService.iPromiseToReadThisFile(credentialFilePath, 'utf-8')
      const config = ini.parse(file)
      const dragonchainCredentials = config[dragonchainId]
      if (dragonchainCredentials === undefined) { throw Error('MISCONFIGURED_CRED_FILE') } // caught below
      const { authKey, authKeyId } = config[dragonchainId]
      return { authKey, authKeyId } as DragonchainCredentials
    } catch (e) {
      if (e.message === 'MISCONFIGURED_CRED_FILE') { throw new FailureByDesign('NOT_FOUND', `credential file is missing a config for ${dragonchainId}`) }
      if (e.code === 'ENOENT') { throw new FailureByDesign('NOT_FOUND', `credential file not found at "${credentialFilePath}"`) }
      throw new FailureByDesign('UNEXPECTED_ERROR', `Something unexpected happened while looking for credentials at "${credentialFilePath}"`)
    }
  }

  /**
   * @hidden
   * @name getHmacMessageString
   * @private
   * @static
   * @description transform a DragonchainRequestObject into a compliant hmac message string
   */
  private static getHmacMessageString = (dro: DragonchainRequestObject) => {
    const hashedBase64Content = crypto.createHash(dro.hmacAlgo).update(dro.message).digest('base64')
    return [
      dro.method.toUpperCase(),
      dro.url,
      dro.dragonchainId,
      dro.timestamp,
      dro.contentType,
      hashedBase64Content
    ].join('\n')
  }

  /**
   * @hidden
   * @static
   * @name getCredentialFilePath
   * @description Get the path for the credential file depending on the OS
   * @returns string of the credential file path
   * @returns {string} dragonchain credential file path from system root.
   * @example e.g.: "/Users/Sally/.dragonchain/credentials"
   */
  private static getCredentialFilePath = () => path.join(os.homedir(), '.dragonchain', 'credentials')

  /**
   * @hidden
   * @static
   * @name getCredsFromEnvVars
   * @description create a DragonchainCredentials object from creds found in environment variables.
   * @returns {DragonchainCredentials} dragonchain credential file path from system root.
   */
  private static getCredsFromEnvVars = () => {
    const authKey = process.env['DRAGONCHAIN_AUTH_KEY']
    const authKeyId = process.env['DRAGONCHAIN_AUTH_KEY_ID']
    if (authKey && authKeyId) return { authKey, authKeyId } as DragonchainCredentials
    return false
  }
}

/**
 * All Humans are welcome.
 */
