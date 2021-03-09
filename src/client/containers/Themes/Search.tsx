import { observer } from "mobx-react"
import * as React from "react"

import { Icons } from "client/components"
import { useThemes } from "client/store"

export const Search = observer(function Search() {
    const [ value, setValue ] = React.useState("")
    const themeStore = useThemes()
    
    const onChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }, [])

    const onBlur = React.useCallback(() => {
        themeStore.search = value
    }, [ value ])

    const onClear = React.useCallback(() => {
        themeStore.search = ""
        setValue("")
    }, [])

    const onKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            themeStore.search = value
        }
    }, [ value ])

    return (
        <div className="search">
            <Icons.Search size={16} />

            <input
                placeholder="Search Style"
                onKeyDown={onKeyDown}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                type="text"
            />

            {value.length > 0 && (
                <div className="clear" onClick={onClear}>
                    <Icons.Close size={18} />
                </div>
            )}
        </div>
    )
})
