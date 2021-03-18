import { makeObservable, observable, action, ObservableMap } from "mobx"
import toPairs from "lodash-es/toPairs"
import each from "lodash-es/each"

import { ThemeStore } from "./themeStore"
import { SerializedTheme } from "models"
import * as api from "client/api"
import map from "lodash-es/map"

export class Library {
    #themeStore: ThemeStore

    @observable
    public themes: ObservableMap<string, SerializedTheme> = observable.map({})

    constructor(themes: ThemeStore) {
        this.#themeStore = themes
        makeObservable(this)

        this.importLibraries()
    }

    @action
    public async importLibraries() {
        const library = await api.getLibrary()
        this.themes.clear()
        
        each(toPairs(library), ([ name, theme ]) => {
            this.themes.set(name, theme)
        })
    }

    @action
    public async importThemes(serializedThemes: SerializedTheme[]) {
        await Promise.all(map(
            serializedThemes,
            (theme) => api.setLibraryTheme(theme),
        ))

        await this.importLibraries()
    }

    @action
    public async importCurrentTheme() {
        await api.serializeCurrentPageTheme()
    }

    @action
    public async mergeWithCurrent(serializedTheme: SerializedTheme) {
        await api.mergeSerializedThemeWithCurrent(serializedTheme)
        this.#themeStore.loadStyles()        
    }

    @action
    public async removeTheme(serializedTheme: SerializedTheme) {
        await api.removeThemeFromLibrary(serializedTheme)
        this.themes.delete(serializedTheme.name)
    }

    @action
    public async renameTheme(oldname: string, newname: string) {
        await api.renameLibraryTheme({ oldname, newname })
        
        const theme = this.themes.get(oldname)
        theme.name = newname

        this.themes.delete(oldname)
        this.themes.set(newname, theme)
    }
}
