import { createAsyncThunk } from "@reduxjs/toolkit"

import { createDraftStyle } from "utils/style"
import { RootState } from "client/features"
import { StyleType } from "models"
import * as api from "client/api"

const { keys } = Object

export interface CreateStyleParams {
  styleType: StyleType
  theme?: string
  group?: string
  name?: string
}

export interface RemoveCollectionParams {
  type: "paint" | "text"
  name: string
}

export interface RemoveThemeGroupParams {
  type: "paint" | "text"
  theme: string
  group: string
}

export const createStyle = createAsyncThunk("themes/createStyle", async (payload: CreateStyleParams) => {
  const style = await api.syncThemeStyle(
    createDraftStyle(payload.theme, payload.group, payload.name, payload.styleType),
  )

  return style
})

// remove "theme" or "group"
export const removeCollection = createAsyncThunk<any, any, { state: RootState }>(
  "themes/removeCollection",
  async (payload: RemoveCollectionParams, { getState }) => {
    const state = getState()

    const collection = state.themes[payload.type][payload.name]
    const tasks = keys(collection.items).map(id => api.removeThemeStyle(id))
    Promise.all(tasks)

    return payload
  },
)

export const removeThemeGroup = createAsyncThunk<any, any, { state: RootState }>(
  "themes/removeThemeGroup",
  async (payload: RemoveThemeGroupParams, { getState }) => {
    const state = getState()

    const group = state.themes[payload.type][payload.theme].groups[payload.group]
    const tasks = group.ids.map(id => api.removeThemeStyle(id))
    Promise.all(tasks)

    return payload
  },
)