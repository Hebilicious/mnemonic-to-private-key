import Mnemonic from "bitcore-mnemonic"

const getPrivateKey = (phrase) => {
  const key = new Mnemonic(phrase)
    .toHDPrivateKey()
    .derive("m/44'/60'/0'/0/0")
    .privateKey.toBuffer()
    .toString("hex")

  console.log(`
    Mnemonic phrase: ${phrase}
    Private Key : ${key}
    `)
  return key
}

export default getPrivateKey
