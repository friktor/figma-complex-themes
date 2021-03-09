import { makeObservable, observable, action, ObservableMap, toJS } from "mobx"
import { StylesCollection } from "./collection"
import { StyleType } from "models"
import { Style } from "./style"

type StylesMap = ObservableMap<string, Style>

export class StylesGroup {
    #collection: StylesCollection | undefined

    @observable
    public id: string // unique local groupId in store
    @observable
    public name: string // style.groupName
    @observable
    public styles: StylesMap = observable.map({})
    @observable
    public storeType: "paint" | "text" = "paint"

    constructor(name: string, collection?: StylesCollection, storeType?: "paint" | "text") {
        this.id = Math.random().toString(16).slice(2)
        this.storeType = storeType || "paint"
        this.#collection = collection
        this.name = name

        makeObservable(this)
    }

    @action
    public renameGroup(groupName: string) {
        this.name = groupName

        for (const [ _mapId, style ] of this.styles.entries()) {
            style.renameGroup(groupName)
        }
    }

    @action
    public renameCollection(collection: string) {
        for (const [ _mapId, style ] of this.styles.entries()) {
            style.renameCollection(collection)
        }
    }
    
    @action
    public addStyle(style: Style) {
        style.setParentGroup(this)
        this.styles.set(style.base.id, style)
    }

    @action
    public addDraftStyle(styleName?: string) {
        let names = [this.#collection.name, this.name, styleName || "Untitled"]

        if (this.storeType === "paint") {
            const { base, inner } = Style.formatDraft(...names)
            const style = new Style(base, inner)
            
            this.addStyle(style)
            style.sync()
        } else {
            // @TODO: implement create draft of text style later
        }
    }

    @action
    public clone(name: string) {
        const target = this.#collection.addGroup(
            this.storeType.toUpperCase() as StyleType,
            name,
        )

        for (const [ _id, item ] of this.styles.entries()) {
            target.importStyleFromOriginal(item)
        }

        return target
    }

    // get original style from other source (like another collection),
    // and create copy with changed names
    // names changed by current collection storeType
    @action
    public importStyleFromOriginal(item: Style) {
        const inner = toJS(item.inner)
        const base = toJS(item.base)
        
        base.id = `$temp:${Math.random().toString(16).slice(2)}`
        base.isDraft = true
        base.isDirty = true

        const style = new Style(base, inner)
        
        style.renameGroup(this.name)
        this.addStyle(style)
    }

    @action // remove target style from this container, but not start remove from source
    public removeStyleFromContainer(target: Style): boolean {
        let targetStyleMapId: string | undefined
        
        for (const [ _mapId, style ] of this.styles.entries()) {
            if (style.equals(target)) {
                targetStyleMapId = _mapId
                break
            }
        }

        if (targetStyleMapId) {
            const removed = this.styles.delete(targetStyleMapId)

            if (this.isEmpty) {
                this.#collection.detachGroupContainer(this)
            }

            return removed
        }

        return false
    }

    @action // remove target style from container and from sources
    public removeStyle(target: Style): boolean {
        target.removeFromSource()
        const removed = this.removeStyleFromContainer(target)

        if (this.isEmpty) {
            this.#collection.detachGroupContainer(this)
        }

        return removed
    }

    @action // remove it with all styles from container & sources
    public remove() {
        for (const [ _mapId, style ] of this.styles.entries()) {
            style.removeFromSource()
        }

        this.styles.clear()
    }

    // Context methods
    public includes(target: Style) {
        let exists = false
        
        for (const [ _mapId, style ] of this.styles.entries()) {
            if (style.equals(target)) {
                exists = true
                break
            }
        }

        return exists
    }

    public setParentCollection(theme: StylesCollection) {
        this.#collection = theme
    }

    get hasParentCollection() {
        return !!this.#collection
    }

    get isEmpty() {
        return this.styles.size <= 0
    }
}
