import Koa = require('koa');
import KoaCors = require('koa2-cors');
import { errorHandler } from './ErrorHandler';
import { GasOracle } from './GasOracle';

process.on('SIGINT', () => process.exit());
process.on('SIGTERM', () => process.exit());

const ethereumUrl = process.env.ETHEREUM_URL;
if (!ethereumUrl) throw new Error('ETHEREUM_URL environment variable must be defined.');
const gasOracle = new GasOracle(ethereumUrl);

new Koa()
	.use(errorHandler)
	.use(KoaCors())
	.use(async context => {
		context.body = {
			number_of_blocks: await gasOracle.getNumberOfBlocks(),
			percentile_1: `${await gasOracle.getPercentile(1) / 10**9} nanoeth`,
			percentile_25: `${await gasOracle.getPercentile(25) / 10**9} nanoeth`,
			percentile_50: `${await gasOracle.getPercentile(50) / 10**9} nanoeth`,
			percentile_75: `${await gasOracle.getPercentile(75) / 10**9} nanoeth`,
			percentile_100: `${await gasOracle.getPercentile(100) / 10**9} nanoeth`,
		}
	})
	.listen(80);
