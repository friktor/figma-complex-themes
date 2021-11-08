import { createAsyncThunk } from "@reduxjs/toolkit"

import { RawPaintStyle, RawTextStyle } from "models"
import { Collections } from "../types"
import * as Style from "utils/style"
import * as api from "client/api"

const normalizeStyles = <T = RawPaintStyle | RawTextStyle>(styles: Array<T>): Collections<T> => {
  const themes: Collections<T> = {}

  const _addCollection = (name, type: "theme" | "group") => {
    if (!themes[name]) {
      themes[name] = {
        groups: {},
        items: {},
        type,
        name,
      }
    }
  }

  const _addTheme = (name) => _addCollection(name, "theme")
  const _addGroup = (name) => _addCollection(name, "group")

  const _addThemeGroup = (theme, group) => {
    if (!themes[theme].groups[group]) {
      themes[theme].groups[group] = {
        name: group,
        ids: [],
      }
    }
  }

  const _addStyle = style => {
    const { theme, group, id } = (style as any).base
    
    if (theme) {
      themes[theme].groups[group].ids.push(id)
      themes[theme].items[id] = style
    } else {
      themes[group].items[id] = style
    }
  }

  styles.forEach(style => {
    const { theme, group } = (style as any).base

    if (theme) {
      _addTheme(theme)
      _addThemeGroup(theme, group)
    } else {
      _addGroup(group)
    }

    _addStyle(style)
  })

  return themes
}

export const getCurrentThemes = createAsyncThunk("themes/getCurrentThemes", async () => {
  const response = await api.getRawStyles()

  const paint = response?.paintStyles.map(Style.createStyleFromRaw)
  const text = response?.textStyles.map(Style.createStyleFromRaw)

  return {
    paint: normalizeStyles(paint || []),
    text: normalizeStyles(text || []),
  }
})
