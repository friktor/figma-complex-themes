import { makeObservable, observable, computed, action, toJS } from "mobx"
import assign from "lodash-es/assign"
import * as api from "client/api"

import { styleNames, paints, createDraftStyle, createStyleFromRaw } from "utils/style"
import { BaseProperties, DeepMutable, InnerProperties, StyleType } from "models"
import { StylesCollection } from "./collection"
import { ThemeStore } from "./themeStore"
import { StylesGroup } from "./group"

export class Style {
    static formatDraft(collection?: string, groupName?: string, styleName?: string) {
        return createDraftStyle(collection, groupName, styleName)
    }

    // helper constructor for create from figma raw styles
    static formatFromRaw(style: DeepMutable<PaintStyle> | DeepMutable<TextStyle>) {
        return createStyleFromRaw(style)
    }
    
    static fromRawStyle(style: DeepMutable<PaintStyle> | DeepMutable<TextStyle>): Style {
        const { inner, base } = Style.formatFromRaw(style)
        return new this(base, inner)
    }

    // Instanse of parent container store
    #themes: ThemeStore | undefined
    // Instanse of parent container store
    #collection: StylesCollection | undefined
    // Instanse of parent container group
    #group: StylesGroup | undefined

    @observable
    public inner: InnerProperties
    @observable
    public base: BaseProperties
    @observable
    public isRemoved: boolean = false

    constructor(
        base: BaseProperties, // base properties with names & flags
        inner: InnerProperties, // inner properties of style

        collection?: StylesCollection,
        group?: StylesGroup,
        themeStore?: ThemeStore, 
    ) {
        this.#collection = collection
        this.#themes = themeStore
        this.#group = group

        makeObservable(this)

        this.inner = observable.object(inner)
        this.base = observable.object(base)
    }

    @action
    public async sync() {
        try {
            const updated = await api.syncThemeStyle({
                inner: toJS(this.inner),
                base: toJS(this.base),
            })

            this.inner = observable.object(updated.inner)
            this.base = observable.object(updated.base)
        } catch (error) {
            console.error(error)
        }
    }

    @action // remove self style only from source
    public async removeFromSource() {
        await api.removeThemeStyle(this.base.id)
        this.isRemoved = true
    }

    @action // remove self style from source and parent containers
    public async remove() {
        if (this.isRemoved) {
            return
        }

        try {            
            this.removeFromSource()

            // If style part of group - remove from group, otherwise remove from collection
            if (this.hasParentGroup) {
                this.#group.removeStyleFromContainer(this)
            } else {
                if (this.hasParentCollection) {
                    this.#collection.removeStyleFromContainer(this)
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    // Core methods
    @action
    public updateFullname() {
        this.base.name = styleNames.generate(
            this.base.collection,
            this.base.groupName,
            this.base.styleName,
        )

        this.sync()
    }

    @action // move style to another group in current collection
    public moveToGroup(groupName: string) {
        this.renameGroup(groupName)

        if (
            this.hasParentCollection &&
            this.hasParentGroup
        ) {
            this.#group.removeStyleFromContainer(this)
            this.#collection.addStyle(this)
        }
    }

    @action
    public moveToCollection(collection: string) {
        this.renameCollection(collection)

        if (this.hasParentGroup && this.hasParentThemes) {
            this.#group.removeStyleFromContainer(this)
            this.#themes.distributeStyle(this)
        }
    }

    @action
    public renameStyle(styleName: string) {
        this.base.styleName = styleName
        this.updateFullname()
    }

    @action
    public renameGroup(groupName: string) {
        this.base.groupName = groupName
        this.updateFullname()
    }

    @action
    public renameCollection(collection?: string) {
        this.base.collection = collection
        this.updateFullname()
    }

    @action
    public replacePaints(paints: Paint[]) {
        if (this.inner.type !== StyleType.PAINT) {
            return
        }

        (this.inner.properties.paints as any).replace(paints);
        this.sync()
    }

    // Parent Context`s
    public setParentCollection(collection: StylesCollection) {
        this.#collection = collection
    }

    public setParentThemes(themes: ThemeStore) {
        this.#themes = themes
    }

    public setParentGroup(group: StylesGroup) {
        this.#group = group
    }

    public equals(style: Style) {
        return this.base.id === style.base.id
    }

    get hasParentThemes() {
        return !!this.#themes
    }

    get hasParentCollection() {
        return !!this.#collection
    }

    get hasParentGroup() {
        return !!this.#group
    }
}
