// RPC services for call common methods from UI

import { FigmaMessage, RpcRequest, RpcResponse } from "./event"
import manifest from "../../../manifest.json"

interface Caller {
    reply(response: RpcResponse<any>): void,
}

export class RpcOrchestrationService {
    public callers: Record<string, RpcCaller | Caller> = {}

    public addMethod<A, R>(action: string): (o?: A) => Promise<R> {
        const rpcCaller = new RpcCaller(action)
        this.callers[action] = rpcCaller
        return rpcCaller.call
    }

    public registerServiceReceiver<T>(
        action: string,
        handler: (data: RpcResponse<T>) => void,
    ) {
        this.callers[action] = {
            reply: handler,
        }
    }

    public matcher = (event: MessageEvent<FigmaMessage<RpcResponse>>) => {
        // console.log(`Received event from core:`, event)

        if (manifest.id === event.data.pluginId) {
            const payload = event.data.pluginMessage
            
            if (payload && payload.action && payload.actionId) {
                const caller = this.callers[payload.action]

                if (caller) {
                    caller.reply(payload)
                }
            }
        }
    }
}

// Client UI async caller wrapper over Figma event system
export class RpcCaller<A = any, R = any | undefined> {
    private tasks: Record<string, { resolve: any, reject: any }> = {}
        
    // action name
    public action: string
    // reject timeout
    public TIMEOUT = 10000

    constructor(action: string) {
        this.action = action
    }

    public reply = (response: RpcResponse<R>) => {
        const { actionId } = response
        const task = this.tasks[actionId]

        if (task) {
            if (response.type === "success") {
                task.resolve(response.data)
            } else {
                task.reject(response.error)
            }

            delete this.tasks[actionId]
        } else {
            console.log(`Action "${this.action}:${actionId}" completed`, response)
        }
    }

    public call = (opts?: A): Promise<R> => new Promise((resolve, reject) => {
        const actionId = Math.random().toString(16).slice(2)
        const { action } = this

        // register callbacks
        this.tasks[actionId] = { resolve, reject }

        const request: RpcRequest<A> = {
            data: opts,
            actionId,
            action,
        }

        // post action to handler
        window.parent.postMessage({ pluginMessage: request }, "*")

        // delete if time is up
        setTimeout(() => {
            if (this.tasks[actionId]) {
                const error = new Error(`Action "${this.action}:${actionId}" was rejected`)
                this.tasks[actionId].reject(error)
                delete this.tasks[actionId]
            }
        }, this.TIMEOUT)
    })
}
