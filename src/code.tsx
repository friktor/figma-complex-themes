import { RpcHandler } from "./utils/rpc/handler"
import { rpc } from "./core"
import map from "lodash-es/map"
import { RpcAction } from "models"

class Main {
    public rpc: RpcHandler

    constructor() {
        this.rpc = rpc
    }

    public setup = () => {
        figma.ui.onmessage = rpc.matcher
        figma.on("selectionchange", this.onSelectionChange)
    }

    public onSelectionChange = () => {
        const selection = map(
            figma.currentPage.selection,
            ({ name, type, id }) => ({ name, type, id })
        )

        figma.ui.postMessage({
            action: RpcAction.ON_SELECTION_CHANGE,
            actionId: "service",
            type: "success",
            data: selection,
        })
    }

    public start = () => {
        this.setup()

        figma.showUI(__html__, {
            height: 600,
            width: 340,
        })        
    }
}

new Main().start()
