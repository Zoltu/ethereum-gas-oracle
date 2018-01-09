declare module 'collections/deque' {
	class Deque<T> {
		length: number;

		// head of collection
		push(...values: Array<T>): void;
		pop(): T;
		peekBack(): T;
		pokeBack(): T;

		// tail of collection
		unshift(...values: Array<T>): void;
		shift(): T;
		peek(): T;
		poke(): T;

		has(value: T): boolean;
		clear(): void;
		indexOf(value: T): number;
		forEach(callback: (value: T) => void): void;
		map<R>(mapper: (value: T) => R): Array<R>;
		filter(predicate: (value: T) => boolean): Array<T>;
		sorted(comparor: (left: T, right: T) => number): Array<T>;
	}
	export = Deque;
}
