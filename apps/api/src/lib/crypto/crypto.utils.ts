import {
	createCipheriv,
	createDecipheriv,
	randomBytes,
	scrypt
} from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)

const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32
const IV_LENGTH = 12

let cachedKey: Buffer | null = null

async function getCryptoKey(): Promise<Buffer> {
	if (cachedKey) return cachedKey

	const password = process.env.ENCRYPTION_PASSWORD
	const salt = process.env.ENCRYPTION_SALT

	if (!password || !salt) {
		throw new Error(
			'As variáveis ENCRYPTION_PASSWORD e ENCRYPTION_SALT não foram definidas.'
		)
	}

	cachedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer
	return cachedKey
}

export async function encrypt(text: string): Promise<string> {
	if (!text) return text

	const key = await getCryptoKey()
	const iv = randomBytes(IV_LENGTH)
	const cipher = createCipheriv(ALGORITHM, key, iv)
	const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
	const authTag = cipher.getAuthTag()

	return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
}

export async function decrypt(encryptedText: string): Promise<string> {
	if (!encryptedText) return encryptedText

	const [ivHex, authTagHex, encryptedHex] = encryptedText.split(':')

	if (!ivHex || !authTagHex || !encryptedHex) {
		throw new Error('Texto criptografado inválido.')
	}

	const iv = Buffer.from(ivHex, 'hex')
	const authTag = Buffer.from(authTagHex, 'hex')
	const encryptedBuffer = Buffer.from(encryptedHex, 'hex')

	if (iv.length !== IV_LENGTH) {
		throw new Error('IV inválido.')
	}

	const key = await getCryptoKey()
	const decipher = createDecipheriv(ALGORITHM, key, iv)
	decipher.setAuthTag(authTag)
	const decrypted = Buffer.concat([
		decipher.update(encryptedBuffer),
		decipher.final()
	])

	return decrypted.toString('utf8')
}
