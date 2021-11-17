import { createAsyncThunk } from "@reduxjs/toolkit"

import { removeCollection, removeStyle, removeThemeGroup } from "./crud"
import { RootState } from "client/features"
import { updateStylename } from "./helpers"
import { cloneDeep } from "utils/helpers"
import { Collection } from "../types"
import * as Payload from "./payload"
import * as api from "client/api"
import { RawStyle } from "models"
import { setGroupOpened } from ".."

const { values } = Object

const renameStyleCollection = (name: string) => (raw: RawStyle) => {
  const key = raw.base.theme ? "theme" : "group"
  return updateStylename(cloneDeep(raw), { [key]: name })
}

const renameStyleThemeGroup = (name: string) => (raw: RawStyle) => {
  return updateStylename(cloneDeep(raw), { group: name })
}

export const renameCollection = createAsyncThunk<Payload.UpdatedStyles, Payload.RenameCollection, { state: RootState }>(
  "themes/renameCollection",
  async ({ type, ...options }, { getState, dispatch }) => {
    const state = getState()
    const collection = state.themes[type][options.old] as Collection<RawStyle>

    const updatedDraft = values(collection.items).map(renameStyleCollection(options.new))
    const styles = await api.syncThemeStyles(updatedDraft)

    dispatch({
      type: removeCollection.fulfilled.type,
      payload: { name: options.old, type },
    })

    return { styles, type }
  },
)

export const renameThemeGroup = createAsyncThunk<Payload.UpdatedStyles, Payload.RenameThemeGroup, { state: RootState }>(
  "themes/renameThemeGroup",
  async ({ type, ...options }, { getState, dispatch }) => {
    const state = getState()
    const collection = state.themes[type]?.[options.theme]
    const groupIds = collection?.groups[options.group].ids

    // prettier-ignore
    const draft = values(collection.items)
      .filter(({ base: { id } }) => (groupIds.includes(id)))
      .map(renameStyleThemeGroup(options.new))

    const styles = await api.syncThemeStyles(draft)

    // Fix broken opened keys
    Promise.all([
      dispatch(
        setGroupOpened({
          theme: collection.name,
          group: options.group,
          opened: false,
        } as any),
      ),
      dispatch(
        setGroupOpened({
          theme: collection.name,
          group: options.new,
          opened: true,
        } as any),
      ),
    ])

    dispatch({
      type: removeThemeGroup.fulfilled.type,
      payload: { theme: options.theme, group: options.group, type },
    })

    return { styles, type }
  },
)

export const renameStyle = createAsyncThunk<Payload.UpdatedStyles, Payload.RenameStyle, { state: RootState }>(
  "themes/renameStyle",
  async (payload, { getState, dispatch }) => {
    const { type, collection, names, id } = payload
    const state = getState()

    const style = cloneDeep(state.themes[type]?.[collection].items[id])
    updateStylename(style, names)

    dispatch({
      type: removeStyle.fulfilled.type,
      payload: {
        type: payload.type,
        id: payload.id,
        collection,
      },
    })

    const updated = await api.syncThemeStyle(style)

    return {
      styles: [updated],
      type,
    }
  },
)