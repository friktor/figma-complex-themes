interface RpcCommon {
  action: string // target action handler
  actionId: string // id of request
}

export interface RpcRequest<A = any> extends RpcCommon {
  data: A // arguments
}

export type RpcResponse<R = any> = RpcCommon &
  (
    | {
        type: "success"
        data: R
      }
    | {
        type: "failed"
        error: Error
      }
  )

export interface FigmaMessage<T> {
  pluginId: string
  pluginMessage: T
}