import Mnemonic from "bitcore-mnemonic"

import { test } from "uvu"
import * as assert from "uvu/assert"
import { createCardanoWallet, createKeyStore, createPrivateKey } from "../src/index"

const mnemonic =
  "garlic pupil february legend morning bright section stool action stadium course busy"

test("can convert a seed phrase to private key", () => {
  const { key } = createPrivateKey(mnemonic)
  assert.is(key, "c59a88c1cfe3820af1ace19af5f928e434c0499ee4236ac19162b6ac0066d498")
})

test("can generate a private key", () => {
  const { phrase } = createPrivateKey()
  assert.is(Mnemonic.isValid(phrase), true)
})

test("can generate a keystore", async () => {
  const { derived, address } = createPrivateKey(mnemonic)
  const expectedKeystore = `{"version":3,"id":"0f166e69-735e-4fe8-9567-cd4063086ba1","address":"198f2aac1a3065a7a58f3ad86b028ddf128441c4","crypto":{"ciphertext":"0693ba7d503b69e9b2614154f6830b6b9eb877a52b888200df76abc424c92ea1","cipherparams":{"iv":"08f065f557d812f0e66140bc9aea24d1"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"06bd5ec9a6d2e0d0cb18fdc7ab37108c5678af4b310da876407ccf2e1f4c3d12","n":262144,"r":8,"p":1},"mac":"802910cf73361347e5acaf0515dc5b7545b8aa4d74774b2220fd67eaead6211b"}}`
  const options = {
    cipher: "aes-128-ctr",
    kdf: "scrypt",
    salt: Buffer.from("06bd5ec9a6d2e0d0cb18fdc7ab37108c5678af4b310da876407ccf2e1f4c3d12", "hex"),
    iv: Buffer.from("08f065f557d812f0e66140bc9aea24d1", "hex"),
    uuid: Buffer.from("0f166e69735e4fe89567cd4063086ba1", "hex"),
    dklen: 32,
    c: 262144,
    n: 262144,
    r: 8,
    p: 1
  }
  const keystore = await createKeyStore({ derived, password: "password", options })
  //@ts-ignore Address is not part of the v3keystore spec
  assert.is("0x" + keystore.address, address)
  assert.is(JSON.stringify(keystore), expectedKeystore)
})

test("Can create a Cardano wallet", async () => {
  const result = await createCardanoWallet()
  console.log(result)
  assert.is(true, true)
})
test.run()
