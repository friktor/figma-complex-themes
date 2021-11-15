import { Store } from "redux"

import { setSelections } from "client/features/themes"
import { RpcAction, SelectionEvent } from "models"
import { RpcResponse } from "utils/rpc/event"
import * as api from "client/api"

export const registerSyncSelectionsService = (store: Store) => {
  api.getCurrentSelection().then(selections => store.dispatch(setSelections(selections)))

  api.RpcService.registerServiceReceiver(RpcAction.ON_SELECTION_CHANGE, (response: RpcResponse<SelectionEvent[]>) => {
    if (response.type === "success") {
      store.dispatch(setSelections(response.data))
    }
  })
}
