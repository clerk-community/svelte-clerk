export function getRequestEvent(): never {
	throw new Error('getRequestEvent is not mocked — override with vi.mock in the test');
}

export function query<T>(fn: T): T {
	return fn;
}
