import Mnemonic from "bitcore-mnemonic"

import { test } from "uvu"
import * as assert from "uvu/assert"
import { createPrivateKey } from "../src/index.js"

test("can convert a seed phrase to private key", () => {
  const mnemonic =
    "garlic pupil february legend morning bright section stool action stadium course busy"
  const { key } = createPrivateKey(mnemonic)
  assert.is(key, "c59a88c1cfe3820af1ace19af5f928e434c0499ee4236ac19162b6ac0066d498")
})

test("can generate a private key", () => {
  const { phrase } = createPrivateKey()
  assert.is(Mnemonic.isValid(phrase), true)
})

test.run()
