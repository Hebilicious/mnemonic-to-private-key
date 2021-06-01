import Mnemonic from "bitcore-mnemonic"
import elliptic from "elliptic"
import { pubToAddress } from "ethereumjs-util"
import Wallet from "ethereumjs-wallet"

function padTo32(msg: Buffer) {
  while (msg.length < 32) {
    msg = Buffer.concat([Buffer.from([0]), msg])
  }
  if (msg.length !== 32) {
    throw new Error(`invalid key length: ${msg.length}`)
  }
  return msg
}

export const createPrivateKey = (seedPhrase?: string) => {
  const mnemonic = new Mnemonic(seedPhrase)
  const phrase = mnemonic.toString()

  const derived = mnemonic.toHDPrivateKey().derive("m/44'/60'/0'/0/0")

  const key = derived.privateKey.toBuffer().toString("hex")
  const publicKey = derived.publicKey.toBuffer()
  //@ts-ignore
  const ecPublic = new elliptic.ec("secp256k1").keyFromPublic(publicKey).getPublic().toJSON()
  const ethPublic = Buffer.concat([
    padTo32(Buffer.from(ecPublic[0].toArray())),
    padTo32(Buffer.from(ecPublic[1].toArray()))
  ])
  const address = `0x${pubToAddress(ethPublic).toString("hex")}`

  // console.dir(derived)
  console.log(`
    Mnemonic phrase: ${phrase}
    Address: ${address}
    Private Key : ${key}
    `)
  return { phrase, address, key, derived }
}

interface ICreateKeyStore {
  derived: any
  password: string
  options?: any
}

export const createKeyStore = async ({
  derived,
  password = "password",
  options
}: ICreateKeyStore) => {
  if (!derived) throw new Error("No derived HD key")
  if (!password) throw new Error("No Password")
  const wallet = Wallet.fromPrivateKey(derived.privateKey.toBuffer())
  const keystore = await wallet.toV3(password, options)
  console.dir({ password, keystore }, { depth: null })
  return keystore
}

export default createPrivateKey
