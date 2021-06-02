#!/usr/bin/env node

import createPrivateKey, { createKeyStore } from "./index"

const { derived } = createPrivateKey(process.argv[2])
createKeyStore({ derived, password: process.argv[3] })
