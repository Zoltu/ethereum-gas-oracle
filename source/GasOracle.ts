import { BlockAndLogStreamer, Log } from 'ethereumjs-blockstream';
import fetch from 'node-fetch';
import Deque = require('collections/deque');

interface JsonRpcResponse<T> {
	jsonrpc: '2.0';
	id: number;
	result?: T;
	error?: { code: number, message: string, data?: any };
}

interface Transaction {
	gasPrice: string;
	from: string;
}

interface Block {
	readonly number: string;
	readonly hash: string;
	readonly parentHash: string;
	readonly miner: string;
	readonly transactions: Array<Transaction>;
}

export class GasOracle {
	private readonly ethereumUrl: string;
	private readonly blockAndLogStreamer: BlockAndLogStreamer<Block, Log>;
	private readonly blockMinGasPrices = new Deque<{ hash: string, minGas: number }>();

	public constructor(ethereumUrl: string) {
		this.ethereumUrl = ethereumUrl;
		this.blockAndLogStreamer = new BlockAndLogStreamer(this.getBlock, this.getLogs);
		this.blockAndLogStreamer.subscribeToOnBlockAdded(this.onBlockAdded);
		this.blockAndLogStreamer.subscribeToOnBlockRemoved(this.onBlockRemoved);
		this.getLatestBlock();
		setInterval(() => this.getLatestBlock(), 1000);
	}

	public getPercentile = async (percentile: number): Promise<number> => {
		if (percentile > 100 || percentile < 1) throw new Error(`Percentile must be between 1 and 100.`);
		const sorted = this.blockMinGasPrices.map(x => x.minGas).sort((a, b) => a - b);
		if (sorted.length <= 0) throw new Error(`Please wait until the service has fetched at least one block.`);
		const index = Math.ceil(sorted.length * percentile / 100) - 1;
		return sorted[index];
	}

	public getNumberOfBlocks = async (): Promise<number> => {
		return this.blockMinGasPrices.length;
	}

	private onBlockAdded = (block: Block) => {
		console.log(`Block ${block.hash} seen.`);
		const prices = block.transactions
			.filter(transaction => transaction.from !== block.miner)
			.map(transaction => parseInt(transaction.gasPrice, 16));
		const minPrice = Math.min(...prices);
		if (minPrice === 0 || !isFinite(minPrice)) return;
		this.blockMinGasPrices.push({ hash: block.hash, minGas: minPrice });
		if (this.blockMinGasPrices.length > 200) {
			this.blockMinGasPrices.shift();
		}
	}

	private onBlockRemoved = (block: Block) => {
		const poppedBlock = this.blockMinGasPrices.pop();
		if (poppedBlock.hash !== block.hash) throw new Error(`Received notification to remove block ${block.hash} but found ${poppedBlock.hash} on the top of the stack.`);
	}

	private getLatestBlock = async () => {
		try {
			const payload = {
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getBlockByNumber',
				params: ['latest', true],
			};
			const response = await fetch(this.ethereumUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
			const result = <JsonRpcResponse<Block>>await response.json();
			if (result.error) throw new Error(`Failed to fetch first block: ${result.error.code}\n${result.error.message}`);
			if (!result.result) throw new Error(`Received unexpected response:\n${result}`);
			this.blockAndLogStreamer.reconcileNewBlock(result.result);
		} catch (error) {
			console.log(error);
		}
	}

	private getBlock = async (hash: string) => {
		const payload = {
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_getBlockByHash',
			params: [hash, true],
		};
		const response = await fetch(this.ethereumUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
		const result = <JsonRpcResponse<Block>>await response.json();
		if (result.error) throw new Error(`Failed to fetch block with hash ${hash}: ${result.error.code}\n${result.error.message}`);
		if (!result.result) throw new Error(`Received unexpected response:\n${result}`);
		return result.result;
	}

	private getLogs = async (filterOptions: any) => {
		return [];
	}
}
