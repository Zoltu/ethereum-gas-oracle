declare module 'ethers' {
	type NetworkName = 'unspecified'|'homestead'|'mainnet'|'morden'|'testnet'|'ropsten'|'rinkeby'|'kovan';
	type BlockTag = number|string;
	interface BigNumber {
		add(other: BigNumber): BigNumber;
		sub(other: BigNumber): BigNumber;
		mul(other: BigNumber): BigNumber;
		div(other: BigNumber): BigNumber;
		mod(other: BigNumber): BigNumber;
		eq(other: BigNumber): boolean;
		lt(other: BigNumber): boolean;
		lte(other: BigNumber): boolean;
		gt(other: BigNumber): boolean;
		gte(other: BigNumber): boolean;
		isZero(): boolean;
		toNumber(): number;
		toString(): string;
		toHexString(): string;
	}
	interface Block {
		parentHash: string;
		hash: string;
		number: number;
		difficulty: number;
		timestamp: number;
		nonce: string;
		extraData: string;
		gasLimit: BigNumber;
		gasUsed: BigNumber;
		miner: string;
		transactions: Array<Transaction>|Array<string>;
	}
	interface Transaction {
		blockHash: string;
		blockNumber: number;
		transactionIndex: number;
		creates: null|string;
		to: null|string;
		hash: string;
		data: string;
		from: string;
		gasLimit: BigNumber;
		gasPrice: BigNumber;
		nonce: number;
		value: BigNumber;
		networkId: number;
		r: string;
		s: string;
		v: number;
		raw: string;
	}
	interface TransactionReceipt {
		transactionHash: string;
		blockHash: string;
		blockNumber: number;
		transactionIndex: number;
		contractAddress: null|string;
		cumulativeGasUsed: BigNumber;
		gasUsed: BigNumber;
		logs: Array<Log>;
		logsBloom: string;
		root: string;
	}
	interface Log {

	}

	export namespace providers {
		class Provider {
			public name: NetworkName;
			public chainId: number;
			public getBalance(addressOrName: string, blockTag?: BlockTag): Promise<BigNumber>;
			public getTransactionCount(addressOrName: string, blockTag?: BlockTag): Promise<number>;
			public lookupAddress(address: string): Promise<string|null>;
			public resolveName(ensName: string): Promise<string|null>;
			public getBlockNumber(): Promise<number>;
			public getGasPrice(): Promise<BigNumber>;
			public getBlock(blockHashOrBlockNumber: string|number): Promise<Block>;
			public getTransaction(transactionHash: string): Promise<Transaction>;
			public getTransactionReceipt(transactionHash: string): Promise<TransactionReceipt>;
		}
		export class EtherscanProvider extends Provider {
			public constructor(network?: NetworkName, apiToken?: null|string);
			public apiToken: null|string;
		}
		export class JsonRpcProvider extends Provider {
			public constructor(url?: string, network?: NetworkName);
			public url: string;
			public send(method: string, params: Array<void>): Promise<void>;
		}
		export class InfuraProvider extends Provider {
			public constructor(network?: NetworkName, apiAccessToken?: string);
			public apiAccessToken: null|string;
		}
		export class FallbackProvider extends Provider {
			public constructor(providers: Array<Provider>);
			public providers: Array<Provider>;
		}
		export function getDefaultProvider(network: NetworkName): Provider;
	}

	export namespace utils {
		export function bigNumberify(value: string|number|Array<number>): BigNumber;
		export const etherSymbol: string;
		export function parseEther(etherString: string): BigNumber;
		export function formatEther(attoeth: BigNumber, options?: { commify?: boolean, pad?: boolean }): string;
		export function getAddress(address: string, generateIcap?: boolean): string;
		export function toUtf8Bytes(text: string): Array<number>;
		export function toUtf8String(value: Array<number>|string): string;
		export function keccak256(value: Array<number>|string): string;
		export function id(valueToHash: string): string;
		export function sha256(value: Array<number>|string): string;
		export function randomBytes(length: number): Array<number>;
	}
}
