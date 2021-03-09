// RPC services for handle common methods from plugin core side

import { FigmaMessage, RpcRequest, RpcResponse } from "./event"
import { id as currentPluginId } from "../../../manifest.json"

type Handler = (opts?: any) => Promise<any | undefined>
type Handlers = Record<string, Handler>

export class RpcHandler {
    private handlers: Handlers = {}

    constructor(handlers: Handlers) {
        this.handlers = handlers
    }
    
    public matcher = async (event: RpcRequest) => {
        // console.log("Received event from UI:", event)

        if (event.action && event.actionId) {
            const handler = this.handlers[event.action]

            if (handler) {
                try {
                    const result = await handler(event.data)

                    const response: RpcResponse<any> = {
                        actionId: event.actionId,
                        action: event.action,
                        type: "success",
                        data: result,
                    }

                    figma.ui.postMessage(response)
                } catch (error) {
                    const response: RpcResponse<any> = {
                        actionId: event.actionId,
                        action: event.action,

                        type: "failed",
                        error,
                    }

                    figma.ui.postMessage(response)
                }
            } else {
                console.log(`Unknown received event data`, event)
            }
        }
    }
}
