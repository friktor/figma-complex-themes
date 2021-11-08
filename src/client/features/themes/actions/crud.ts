import { createAsyncThunk } from "@reduxjs/toolkit"

import { createDraftStyle } from "utils/style"
import { StyleType } from "models"
import * as api from "client/api"

interface CreateStyle {
  styleType: StyleType
  collection?: string
  groupName?: string
  styleName?: string
} 

export const createStyle = createAsyncThunk("themes/createStyle", async (payload: CreateStyle) => {
  const style = await api.syncThemeStyle(createDraftStyle(
    payload.collection,
    payload.groupName,
    payload.styleName,
    payload.styleType
  ))

  return style
})
