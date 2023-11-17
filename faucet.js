import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import { BN } from "bn.js";
import { checkAddress } from "@polkadot/util-crypto";

/**
 * The Faucet class
 */
class Faucet {

    constructor(config) {
        this.config = config;
        this.api = null;
        // this.emitter = new EventEmitter();
        this.init();
    };

    async init() {
        let provider = new WsProvider(this.config.ws)
        this.api = await ApiPromise.create({
            provider,
        })
        await this.api.isReady
        console.log('api is ready')
        const [chain, nodeName, nodeVersion] = await Promise.all([
            this.api.rpc.system.chain(),
            this.api.rpc.system.name(),
            this.api.rpc.system.version(),
        ]);
        console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);

    };

    /**
     * Drip tokens from the faucet and emit events on success or error
     * 
     * `address`: The address to drip to
     * `id`: The process id
     * `emitter`: The event emitter
     * 
     */
    async drip(address, id, emitter) {
        const check = checkAddress(address, this.config.address_type);
        let message;
        if (check[0] === false) { 
            message = 'InvalidAddress' + id;
            emitter.emit(id, message)
        }
        const keyring = new Keyring({ type: "sr25519" });
        const sender = keyring.addFromUri(process.env.MNEMONIC);
        const padding = new BN(10).pow(new BN(this.config.decimals));
        const amount = new BN(this.config.amount).mul(padding);
        console.log(`Sending ${this.config.amount} ${this.config.symbol} to ${address}`);
        
        const call = this.api.tx.balances
            .transferKeepAlive(address, amount);

        await call.signAndSend(sender, async result => {
            if (result.status.isInBlock) {
                console.log("Transfer sent with hash", call.hash.toHex());
                message = `Done! Transferred ${this.config.amount} ${this.config.symbol} to ${address} with hash ${call.hash.toHex()}`;
                emitter.emit(id, message)
            }
        });
    }
};

export default Faucet;