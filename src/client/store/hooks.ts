import { MobXProviderContext } from "mobx-react"
import * as React from "react"

import { ThemeStore } from "./themeStore"

export const useThemes = () => {
    const stores = React.useContext(MobXProviderContext)
    const themeStore: ThemeStore = stores.themeStore
    return themeStore
}

export const useServices = () => {
    const stores = React.useContext(MobXProviderContext)
    const themeStore: ThemeStore = stores.themeStore
    return themeStore.services
}

export const useLibrary = () => {
    const stores = React.useContext(MobXProviderContext)
    const themeStore: ThemeStore = stores.themeStore
    return themeStore.library
}