import Mnemonic from "bitcore-mnemonic"

import { test } from "uvu"
import * as assert from "uvu/assert"
import getPrivateKey from "../src/index.js"

test("can convert a seed phrase to private key", () => {
  const mnemonic =
    "garlic pupil february legend morning bright section stool action stadium course busy"
  const privateKey = getPrivateKey(mnemonic)
  assert.is(privateKey, "c59a88c1cfe3820af1ace19af5f928e434c0499ee4236ac19162b6ac0066d498")
})

test.run()
