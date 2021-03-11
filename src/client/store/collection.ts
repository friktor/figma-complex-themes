import { makeObservable, observable, action, ObservableMap, toJS } from "mobx"
import objectSwitch from "utils/objectSwitch"
import { StyleType } from "models"

import { ThemeStore } from "./themeStore"
import { StylesGroup } from "./group"
import { Style } from "./style"

export type UnionStylesMap = ObservableMap<string, Style | StylesGroup>
export type StylesMap = ObservableMap<string, Style>

export class StylesCollection {
    // Instanse of parent container store
    #themes: ThemeStore | undefined

    // "theme" - values with `collection` field and with groups
    // "group" - values with `groupName` field but without collection (common value not used for redraws)
    @observable
    public storeType: "theme" | "group"
    @observable
    public id: string // unique local collection in store

    @observable
    public paintStyles: UnionStylesMap = observable.map({})
    @observable
    public textStyles: UnionStylesMap = observable.map({})

    @observable
    public name: string

    constructor(
        name: string,
        storeType: "theme" | "group",

        themeStore?: ThemeStore,
    ) {
        this.id = Math.random().toString(16).slice(2)
        this.#themes = themeStore
        this.storeType = storeType
        makeObservable(this)

        this.name = name
    }

    @action // rename by storeType - if theme rename `collection` else `groupName`
    public rename(name: string) {
        this.name = name

        const _iterator = (item: Style | StylesGroup) => {
            // `StylesGroup` haved only in `theme` with collection
            if (item instanceof StylesGroup) {
                item.renameCollection(name)
            }

            // `Style` haved only in `group` with groupName
            if (item instanceof Style) {
                item.renameGroup(name)
            }
        }

        for (const [ _id, item ] of this.paintStyles.entries()) {
            _iterator(item)
        }

        for (const [ _id, item ] of this.textStyles.entries()) {
            _iterator(item)
        }
    }

    @action
    public clone(name: string) {
        const target = this.#themes.addCollection(name, this.storeType)
        
        const _iterator = (item: Style | StylesGroup) => {
            target.importStyleFromOriginal(item)
        }

        for (const [ _id, item ] of this.paintStyles.entries()) {
            _iterator(item)
        }

        for (const [ _id, item ] of this.textStyles.entries()) {
            _iterator(item)
        }

        return target
    }

    @action
    public addGroup(styleType: StyleType, name: string): StylesGroup {
        const targetKey: "textStyles" | "paintStyles" = objectSwitch(styleType, {
            [StyleType.PAINT]: "paintStyles",
            [StyleType.TEXT]: "textStyles",
        })

        let founded: StylesGroup
        for (const [ _id, item ] of this[targetKey].entries()) {
            if (item instanceof StylesGroup && item.name === name) {
                founded = item
                break
            }
        }

        if (founded) {
            return founded
        } else {
            const group = new StylesGroup(name, this, styleType.toLowerCase() as any)
            this[targetKey].set(group.id, group)
            return group
        }
    }

    @action
    public addStyle(style: Style) {
        style.setParentCollection(this)
        style.setParentThemes(this.#themes)

        // If this collection store type is "theme" - all styles must have `collection` & `groupName`
        if (this.storeType === "theme") {
            if (style.base.groupName) {
                const group = this.addGroup(style.inner.type, style.base.groupName)
                group.addStyle(style)
            } else {
                console.log("Style for themes must have `groupName` in `theme` collections", style)
            }
        } else {
            const targetKey: "textStyles" | "paintStyles" = objectSwitch(style.inner.type, {
                [StyleType.PAINT]: "paintStyles",
                [StyleType.TEXT]: "textStyles",
            })

            this[targetKey].set(style.base.id, style)
        }
    }

    @action
    public addDraftStyle(
        styleType: "paint" | "text",
        styleName?: string,
    ) {
        let args
        
        if (this.storeType === "theme") {
            args = [this.name, "Temp", styleName || "Untitled", styleType.toUpperCase()]
        } else {
            args = [undefined, this.name, styleName || "Untitled", styleType.toUpperCase()]
        }

        const { base, inner } = Style.formatDraft(...args)
        const style = new Style(base, inner)
        
        this.addStyle(style)
        style.sync()
    }

    // get original style from other source (like another collection),
    // and create copy with changed names
    // names changed by current collection storeType
    @action
    public importStyleFromOriginal(item: Style | StylesGroup) {
        if (item instanceof StylesGroup) {
            for (const [ _id, style ] of item.styles.entries()) {
                this.importStyleFromOriginal(style)
            }
        } else {
            const inner = toJS(item.inner)
            const base = toJS(item.base)

            base.id = `$temp:${Math.random().toString(16).slice(2)}`
            base.isDraft = true
            base.isDirty = true

            const style = new Style(base, inner)
            
            if (this.storeType === "theme") {
                style.renameCollection(this.name)
            } else {
                style.renameGroup(this.name)
            }

            this.addStyle(style)
        }
    }

    @action // detach group container (without remove styles)
    public detachGroupContainer(group: StylesGroup) {
        const targetKey: "textStyles" | "paintStyles" = objectSwitch(group.storeType.toUpperCase(), {
            [StyleType.PAINT]: "paintStyles",
            [StyleType.TEXT]: "textStyles",
        })

        for (const [ _mapId, item ] of this[targetKey].entries()) {
            if (item instanceof StylesGroup) {
                if (item.id === group.id) {
                    this[targetKey].delete(_mapId)
                    break
                }
            }
        }
    }

    @action // remove target style from this container, but not start remove from source
    public removeStyleFromContainer(target: Style): boolean {
        const _iterator = (container: "paint" | "text") => (_mapId: string, item: Style | StylesGroup): boolean => {
            let targetKey = `${container}Styles` as "paintStyles" | "textStyles"

            // `StylesGroup` haved only in `theme` with collection
            if (item instanceof StylesGroup) {
                const isRemoved = item.removeStyleFromContainer(target)

                // Remove group container if its empty
                if (item.isEmpty) {
                    this[targetKey].delete(_mapId)
                }

                return isRemoved
            }

            // `Style` haved only in `group` with groupName
            if (item instanceof Style) {
                if (item.equals(target)) {
                    return this[targetKey].delete(_mapId)
                } else {
                    return false
                }
            }
        }

        for (const [ _mapId, item ] of this.paintStyles.entries()) {
            const isRemoved = _iterator("paint")(_mapId, item)

            if (isRemoved) {
                return true
            }
        }

        for (const [ _mapId, item ] of this.textStyles.entries()) {
            const isRemoved = _iterator("text")(_mapId, item)

            if (isRemoved) {
                return true
            }
        }

        return false
    }

    @action
    public removeStyle(style: Style): boolean {
        const isRemoved = this.removeStyleFromContainer(style)
        
        if (isRemoved) {
            style.removeFromSource()
        }

        return isRemoved
    }

    @action // remove it from parent container and from sources with all styles
    public remove() {
        const targetKey = `${this.storeType}s` as "themes" | "groups"
        this.#themes[targetKey].delete(this.id) // remove from parent cointainer
        
        const _iterator = (item: Style | StylesGroup) => {
            // `StylesGroup` haved only in `theme` with collection
            if (item instanceof StylesGroup) {
                item.remove()
            }

            // `Style` haved only in `group` with groupName
            if (item instanceof Style) {
                item.removeFromSource()
            }
        }

        for (const [ _mapId, item ] of this.paintStyles.entries()) {
            _iterator(item)
        }

        for (const [ _mapId, item ] of this.textStyles.entries()) {
            _iterator(item)
        }

        this.paintStyles.clear()
        this.textStyles.clear()
    }
}
