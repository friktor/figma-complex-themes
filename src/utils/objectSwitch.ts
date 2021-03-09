export default function objectSwitch<T>(value: string, target: { [key: string]: T }, exec = false): T {
    return (target[value]
        ? (exec ? (target as any)[value]() : target[value])
        : (target.default ? (exec ? (target as any).default() : target.default) : null)
    )
}
