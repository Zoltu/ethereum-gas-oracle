import { Context } from 'koa';

export async function errorHandler(context: Context, next: () => Promise<any>) {
	try {
		await next();
	} catch (error) {
		error.expose = true;
		throw error;
	}
}
