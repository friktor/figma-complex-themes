const nameMatchers = {
    themes: /\[(\w+|\w+:\w+)\]/,
    group: /^(\w+)\/(.*)$/,
}

export const parse = (rawname: string): {
    collection?: string,
    groupName?: string,
    styleName: string,
} => {
    let result: any = {}

    const _names = (_name) => {
        if (nameMatchers.group.test(_name)) {
            const [ $_, groupName, styleName ] = _name.match(nameMatchers.group)
            
            return {
                groupName,
                styleName,
            }
        } else {
            return {
                styleName: _name,
            }
        }
    }

    if (nameMatchers.themes.test(rawname)) {
        const [ $themeFull, collection ] = rawname.match(nameMatchers.themes)
        result.collection = collection

        const names = _names(rawname.replace($themeFull, "").replace(" ", ""))

        if (names) {
            result = Object.assign({}, result, names)
        }
    } else {
        const names = _names(rawname.replace(" ", ""))

        if (names) {
            result = Object.assign({}, result, names)
        }
    }

    return result
}

export const generate = (collection?: string, group?: string, styleName?: string) => {
    const _collection = collection ? `[${collection}]` : ""
    const _group = group || "Temp"
    const _style = styleName || "Untitled"

    return `${_group}${_collection}/${_style}`
}
