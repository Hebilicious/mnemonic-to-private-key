"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const main = async () => {
    const result = await _1.createCardanoWallet();
    console.log(result);
};
main();
