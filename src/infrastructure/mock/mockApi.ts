export function mockResponse<T>(data: T, delay = 200): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
}
