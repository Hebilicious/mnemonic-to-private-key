import Mnemonic from "bitcore-mnemonic"
import elliptic from "elliptic"
import { pubToAddress } from "ethereumjs-util"
import Wallet from "ethereumjs-wallet"
import bip39 from "bip39"
import Cardano from "@emurgo/cardano-serialization-lib-nodejs"

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

const harden = (num: number) => 0x80000000 + num

export const createCardanoWallet = async ({ length = 24 } = {}) => {
  const network = Cardano.NetworkInfo.mainnet().network_id()
  const phrase = bip39.generateMnemonic((32 * length) / 3)
  const entropy = bip39.mnemonicToEntropy(phrase)
  const rootKey = Cardano.Bip32PrivateKey.from_bip39_entropy(
    Buffer.from(entropy, "hex"),
    Buffer.from("")
  )
  const privateKey = rootKey.derive(harden(1852)).derive(harden(1815)).derive(harden(0))
  const stakeKey = privateKey.derive(2).derive(0).to_public()
  const rewardAddress = Cardano.RewardAddress.new(
    network,
    Cardano.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash())
  )
  const publicKey = Cardano.Bip32PublicKey.from_bech32(privateKey.to_public().to_bech32())
  const utxoPublicKey = publicKey.derive(0).derive(0)
  const address = Cardano.BaseAddress.new(
    network,
    Cardano.StakeCredential.from_keyhash(utxoPublicKey.to_raw_key().hash()),
    Cardano.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash())
  )
  return {
    phrase,
    privateKey: privateKey.to_bech32(),
    rewardAddress: rewardAddress.to_address().to_bech32(),
    address: address.to_address().to_bech32()
  }
}
export default createPrivateKey
