import { createAsyncThunk } from "@reduxjs/toolkit"

import { Collections } from "./types"
import { RawPaintStyle, RawTextStyle } from "models"
import * as Style from "utils/style"
import * as api from "client/api"

const generateCollections = <T = RawPaintStyle | RawTextStyle>(styles: Array<T>): Collections<T> => {
  const themes: Collections<T> = {}

  const _addCollection = (name) => {
    if (!themes[name]) {
      themes[name] = {
        groups: {},
        items: {},
        name,
      }
    }
  }

  const _addGroup = (collection, groupName) => {
    if (!themes[collection].groups[groupName]) {
      themes[collection].groups[groupName] = {
        name: groupName,
        ids: [],
      }
    }
  }

  const _addStyle = (style) => {
    const { collection, groupName, id } = style.base
    themes[collection].groups[groupName].ids.push(id)
    themes[collection].items[id] = style
  }

  styles.forEach((style) => {
    const { collection, groupName } = (style as any).base
    _addCollection(collection)
    _addGroup(collection, groupName)
    _addStyle(style)
  })

  return themes
}

export const getCurrentThemes = createAsyncThunk(
  "themes/getCurrentThemes",
  async () => {
    const response = await api.getRawStyles()

    const paint = response?.paintStyles.map(Style.createStyleFromRaw)
    const text = response?.textStyles.map(Style.createStyleFromRaw)

    return {
      paint: generateCollections(paint || []),
      text: generateCollections(text || []),
    }
  }
)
