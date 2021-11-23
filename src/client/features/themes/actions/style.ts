import { createAsyncThunk } from "@reduxjs/toolkit"

import { createSolidPaint } from "utils/style/paints"
import { RawPaintStyle, StyleType } from "models"
import { RootState } from "client/features"
import { cloneDeep } from "utils/helpers"
import * as Payload from "./payload"
import * as api from "client/api"

export const addPaintStyle = createAsyncThunk<Payload.UpdatedStyles, Payload.AddPaintStyle, { state: RootState }>(
  "themes/addPaintStyle",
  async (payload, { getState }) => {
    const state = getState()

    const style: RawPaintStyle = cloneDeep(state.themes.PAINT?.[payload.collection].items?.[payload.id])
    style.inner.properties.paints.push(payload.paint || createSolidPaint())
    const updated = await api.syncThemeStyle(style)

    return {
      styles: [updated],
      type: StyleType.PAINT,
    }
  },
)

export const updatePaintStyle = createAsyncThunk<Payload.UpdatedStyles, Payload.UpdatePaintStyle, { state: RootState }>(
  "themes/updatePaintStyle",
  async (payload, { getState }) => {
    const state = getState()

    const style: RawPaintStyle = cloneDeep(state.themes.PAINT?.[payload.collection].items?.[payload.id])
    style.inner.properties.paints.splice(payload.index, 1, payload.paint)
    const updated = await api.syncThemeStyle(style)

    return {
      styles: [updated],
      type: StyleType.PAINT,
    }
  },
)

export const removePaintStyle = createAsyncThunk<Payload.UpdatedStyles, Payload.RemovePaintStyle, { state: RootState }>(
  "themes/removePaintStyle",
  async (payload, { getState }) => {
    const state = getState()

    const style: RawPaintStyle = cloneDeep(state.themes.PAINT?.[payload.collection].items?.[payload.id])
    style.inner.properties.paints.splice(payload.index, 1)
    const updated = await api.syncThemeStyle(style)

    return {
      styles: [updated],
      type: StyleType.PAINT,
    }
  },
)