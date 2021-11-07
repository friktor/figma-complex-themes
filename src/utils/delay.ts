export const delay = (timeout: number) => new Promise<void>(resolve => setTimeout(() => resolve(), timeout))
