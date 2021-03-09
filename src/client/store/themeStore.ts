import { makeObservable, observable, action, ObservableMap } from "mobx"
import each from "lodash-es/each"
import map from "lodash-es/map"

import { DeepMutable } from "models"
import * as api from "client/api"

import { StylesCollection } from "./collection"
import { Services } from "./services"
import { Library } from "./library"
import { Style } from "./style"

export class ThemeStore {
    @observable
    public groups: ObservableMap<string, StylesCollection> = observable.map()
    @observable
    public themes: ObservableMap<string, StylesCollection> = observable.map()
    @observable
    public services: Services
    @observable
    public library: Library

    @observable
    public modal: {
        opened: boolean,
        style?: Style,
    } = observable.object({
        opened: false,
    })

    @observable
    public isLoading: boolean = false
    @observable
    public search: string = ""

    constructor() {
        this.services = new Services(this)
        this.library = new Library(this)
        
        makeObservable(this)
    }

    @action
    public toggleModal(style?: Style) {
        if (style) {
            this.modal.opened = true
            this.modal.style = style
        } else {
            this.modal.style = undefined
            this.modal.opened = false
        }
    }

    @action
    public async loadStyles() {
        this.themes.clear()
        this.groups.clear()
        
        const iterator = (
            rawStyle: DeepMutable<PaintStyle> | DeepMutable<TextStyle>,
        ) => {
            const style = Style.fromRawStyle(rawStyle)

            if (style.base.collection) {
                const container = this.addCollection(style.base.collection, "theme")
                container.addStyle(style)
            } else if (style.base.groupName) {
                const container = this.addCollection(style.base.groupName, "group")
                container.addStyle(style)
            } else {
                // @NOTE handle variants without group & collection later
                console.log("@NOTE: Style without `collection` & `groupName` not supported", style)
            }
        }

        try {
            this.isLoading = true

            const { paintStyles, textStyles } = await api.getRawStyles()
            each(paintStyles, iterator)
            each(textStyles, iterator)

            this.isLoading = false
        } catch (error) {
            // @TODO: handle it in future
        }
    }

    @action
    public findCollection(name: string, storeType: "theme" | "group") {
        const targetKey = `${storeType}s` as "themes" | "groups"
        let founded: StylesCollection | undefined

        for (const [ _id, collection ] of this[targetKey].entries()) {
            if (collection.name === name) {
                founded = collection
                break
            }
        }

        return founded
    }

    @action
    public async importStylesFromSelected() {
        const sourceFrameIds = map(this.services.currentSelection, ({ id }) => id)
        await api.importStyleFromFrameToTheme({ sourceFrameIds })
        await this.loadStyles()
    }

    @action
    public addCollection(
        name: string,
        storeType: "theme" | "group",
    ): StylesCollection {
        const targetKey = `${storeType}s` as "themes" | "groups"
        const collection = this.findCollection(name, storeType)
        
        if (collection) {
            return collection
        } else {
            const collection = new StylesCollection(name, storeType, this)
            this[targetKey].set(collection.id, collection)
            return collection
        }
    }

    @action
    public distributeStyle(style: Style) {
        if (style.base.collection) {
            const container = this.addCollection(style.base.collection, "theme")
            container.addStyle(style)
        } else if (style.base.groupName) {
            const container = this.addCollection(style.base.groupName, "group")
            container.addStyle(style)
        } else {
            // @NOTE handle variants without group & collection later
            console.log("@NOTE: Style without `collection` & `groupName` not supported", style)
        }
    }
}
