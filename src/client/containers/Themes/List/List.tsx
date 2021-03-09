import { observer } from "mobx-react"
import * as React from "react"
import cx from "classnames"

import { Style, StylesGroup, UnionStylesMap, useThemes } from "client/store"
import { Icons, Input, SelectPopup } from "client/components"
import { Item } from "./Item"

interface GroupProps {
    group: StylesGroup,
}

export const Group = observer(function Group({ group }: GroupProps) {
    const [ opened, setOpened ] = React.useState(true)
    const { search } = useThemes()

    const { styles, name } = group

    const onChange = React.useCallback((params: { value: string }) => {
        group.renameGroup(params.value)
    }, [ group ])

    const onCloneCollection = React.useCallback(() => {
        group.clone("untitled")
    }, [])
    
    const onRemoveCollection = React.useCallback(() => {
        group.remove()
    }, [])

    const onCreateDraftStyle = React.useCallback(() => {
        group.addDraftStyle()
    }, [])
    
    const items: JSX.Element[] = []
    
    for (const [ _id, style ] of styles.entries()) {
        const dontCompareSearch = search && (
            !style.base.name.includes(search)
        )

        if (!dontCompareSearch) {
            items.push(
                <Item
                    key={`group-${name}-style-${style.base.id}`}
                    style={style}
                />
            )
        }
    }

    // Return null if have search query and style name not compared with it
    return items.length <= 0 ? null : (
        <div className="group">
            <div className="header">
                <div className="name">
                    <div className={cx("icon", { opened })} onClick={() => setOpened(!opened)}>
                        <Icons.Caret color="rgba(0,0,0, 0.5)" size={12} />
                    </div>

                    <Input
                        validator={/^[a-zA-Z]+$/g}
                        onChange={onChange}
                        value={name}
                        name="group"
                    />
                </div>
                <div className="actions">
                    <SelectPopup
                        icon="MenuDots"
                        iconSize={16}
                        items={[{
                            onClick: onCloneCollection,
                            title: "Duplicate",
                            icon: "Copy",
                        }, {
                            onClick: onRemoveCollection,
                            title: "Remove",
                            icon: "Trash",
                        }]}
                    />
                    
                    <div className="action" onClick={onCreateDraftStyle}>
                        <Icons.Plus color="rgba(0,0,0, 0.8)" size={20} />
                    </div>
                </div>
            </div>

           <div className={cx("items", { opened })}>
               {items}
           </div>
        </div>
    )
})

interface ListProps {
    items: UnionStylesMap,
}

export const List = observer(function List(props: ListProps) {
    const items: JSX.Element[] = []

    for (const [ _key, item ] of props.items.entries()) {
        if (item instanceof StylesGroup) {
            items.push(
                <Group
                    key={`item-group-${item.id}`}
                    group={item}
                />
            )
        }

        if (item instanceof Style) {
            items.push(
                <Item
                    key={`item-style-${item.base.id}`}
                    style={item}
                />
            )
        }
    }

    return (
        <div className="items">
            {items}
        </div>
    )
})
