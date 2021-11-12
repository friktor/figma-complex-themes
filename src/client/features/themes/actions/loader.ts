import { createAsyncThunk } from "@reduxjs/toolkit"
import * as Style from "utils/style"
import * as api from "client/api"

export const getCurrentThemes = createAsyncThunk("themes/getCurrentThemes", async () => {
  const response = await api.getRawStyles()

  const paint = response?.paintStyles.map(Style.createStyleFromRaw) || []
  const text = response?.textStyles.map(Style.createStyleFromRaw) || []

  return {
    paint,
    text,
  }
})
