import { createAsyncThunk } from "@reduxjs/toolkit"

import { createDraftStyle } from "utils/style"
import { StyleType } from "models"
import * as api from "client/api"

interface CreateStyle {
  styleType: StyleType
  theme?: string
  group?: string
  name?: string
} 

export const createStyle = createAsyncThunk("themes/createStyle", async (payload: CreateStyle) => {
  const style = await api.syncThemeStyle(createDraftStyle(
    payload.theme,
    payload.group,
    payload.name,
    payload.styleType
  ))

  return style
})
