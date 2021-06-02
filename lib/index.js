"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKeyStore = exports.createPrivateKey = void 0;
const bitcore_mnemonic_1 = __importDefault(require("bitcore-mnemonic"));
const elliptic_1 = __importDefault(require("elliptic"));
const ethereumjs_util_1 = require("ethereumjs-util");
const ethereumjs_wallet_1 = __importDefault(require("ethereumjs-wallet"));
function padTo32(msg) {
    while (msg.length < 32) {
        msg = Buffer.concat([Buffer.from([0]), msg]);
    }
    if (msg.length !== 32) {
        throw new Error(`invalid key length: ${msg.length}`);
    }
    return msg;
}
const createPrivateKey = (seedPhrase) => {
    const mnemonic = new bitcore_mnemonic_1.default(seedPhrase);
    const phrase = mnemonic.toString();
    const derived = mnemonic.toHDPrivateKey().derive("m/44'/60'/0'/0/0");
    const key = derived.privateKey.toBuffer().toString("hex");
    const publicKey = derived.publicKey.toBuffer();
    //@ts-ignore
    const ecPublic = new elliptic_1.default.ec("secp256k1").keyFromPublic(publicKey).getPublic().toJSON();
    const ethPublic = Buffer.concat([
        padTo32(Buffer.from(ecPublic[0].toArray())),
        padTo32(Buffer.from(ecPublic[1].toArray()))
    ]);
    const address = `0x${ethereumjs_util_1.pubToAddress(ethPublic).toString("hex")}`;
    // console.dir(derived)
    console.log(`
    Mnemonic phrase: ${phrase}
    Address: ${address}
    Private Key : ${key}
    `);
    return { phrase, address, key, derived };
};
exports.createPrivateKey = createPrivateKey;
const createKeyStore = async ({ derived, password = "password", options }) => {
    if (!derived)
        throw new Error("No derived HD key");
    if (!password)
        throw new Error("No Password");
    const wallet = ethereumjs_wallet_1.default.fromPrivateKey(derived.privateKey.toBuffer());
    const keystore = await wallet.toV3(password, options);
    console.dir({ password, keystore }, { depth: null });
    return keystore;
};
exports.createKeyStore = createKeyStore;
exports.default = exports.createPrivateKey;
