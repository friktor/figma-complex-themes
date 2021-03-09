import { makeObservable, observable, action, IObservableArray } from "mobx"

import { RpcAction, SelectionEvent } from "models"
import { RpcResponse } from "utils/rpc/event"
import { ThemeStore } from "./themeStore"
import * as api from "client/api"

export class Services {
    #themes: ThemeStore

    @observable
    public currentSelection: IObservableArray<SelectionEvent> = observable.array([])

    constructor(themes: ThemeStore) {
        this.#themes = themes
        makeObservable(this)

        api.getCurrentSelection().then(
            (selections) => this.updateSelection(selections)
        )

        api.RpcService.registerServiceReceiver(
            RpcAction.ON_SELECTION_CHANGE,
            (response: RpcResponse<SelectionEvent[]>) => {
                if (response.type === "success") {
                    this.updateSelection(response.data)
                }
            },
        )
    }

    @action
    public updateSelection(selections: SelectionEvent[]) {
        this.currentSelection.replace(selections)
    }
}
