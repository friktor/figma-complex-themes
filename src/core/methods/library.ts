import { Library, LibraryRenameOptions, SerializedTheme } from "models"
import { deserialize, serialize } from "utils/serde"
import { processStyles } from "./processing"
import { getRawStyles } from "./queries"

(async function init() {
    const library = await figma.clientStorage.getAsync("libraryThemes")

    if (!library) {
        await figma.clientStorage.setAsync("libraryThemes", {})
    }
})()

export const getLibrary = async (): Promise<Library | undefined> => {
    const library: Library | undefined = await figma.clientStorage.getAsync("libraryThemes")
    return library
}

export const setLibrary = async (library: Record<string, SerializedTheme>) => {
    await figma.clientStorage.setAsync("libraryThemes", library)
}

export const setLibraryTheme = async (theme: SerializedTheme): Promise<Library> => {
    const library = await getLibrary()
    library[theme.name] = theme
    await setLibrary(library)
    return library
}

export const removeThemeFromLibrary = async (theme: SerializedTheme) => {
    const library = await getLibrary()
    delete library[theme.name]
    await setLibrary(library)
    return library
}

export const renameLibraryTheme = async (params: LibraryRenameOptions) => {
    const library = await getLibrary()
    
    const theme = library[params.oldname]
    theme.name = params.newname

    delete library[params.oldname]
    library[params.newname] = theme

    await setLibrary(library)
    return library
}

export const serializeCurrentPageTheme = async (name: string = figma.currentPage.name) => {
    const { paintStyles: paint, textStyles: text } = await getRawStyles()
    const serializedTheme = serialize(name, { text, paint }) as SerializedTheme
    setLibraryTheme(serializedTheme)
}

// Merge styles, if style is exists by id or fullname - replace it, if not exists create
export const mergeSerializedThemeWithCurrent = async (serializedTheme: SerializedTheme) => {
    const deserialized = deserialize(serializedTheme)
    
    await Promise.all([
        processStyles(deserialized.paint),
        processStyles(deserialized.text),
    ])

    return true
}
