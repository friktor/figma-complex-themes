import map from "lodash-es/map"
import * as React from "react"

import { Input, Icons, SelectPopup } from "client/components"
import { RawStyle, StyleType } from "models"
import { PaintEditor } from "./Paint"
import { TextEditor } from "./Text"

interface onChangeNameParams {
    name: "style" | "group",
    value: string,
}

interface IProps {
    availableCollections: string[],
    style: RawStyle,

    onChangeName?: (params: onChangeNameParams) => void,
    onChangeCollection?: (name: string) => void,
    onReplacePaints?: (paints: Paint[]) => void,
    onClose?: () => void,
}

export function StyleEditor({ style, ...props }: IProps) {
    const [ nameEditable, setNameEditable ] = React.useState(false)

    const [ collection, setCollection ] = React.useState<string | undefined>()
    const [ groupName, setGroupName ] = React.useState("")
    const [ styleName, setStyleName ] = React.useState("")

    React.useEffect(() => {
        setCollection(style.base.collection)
        setGroupName(style.base.groupName)
        setStyleName(style.base.styleName)
    }, [ style ])

    const onChange = React.useCallback((params: onChangeNameParams) => {
        if (params.name === "style") {
            setStyleName(params.value)
        } else {
            setGroupName(params.value)
        }

        if (props.onChangeName) {
            props.onChangeName(params)
        }
    }, [])

    const onChangeCollection = React.useCallback((name: string) => () => {
        if (props.onChangeCollection) {
            props.onChangeCollection(name)
        }
    }, [])

    const actions = map(props.availableCollections, (name) => ({
        onClick: onChangeCollection(name),
        title: name,
    }))

    const collectionSelector = !nameEditable && collection && (
        <SelectPopup 
            title={collection}
            items={actions}
        />
    )

    const editor = style.inner.type === StyleType.PAINT
        ? <PaintEditor
            onReplacePaints={props.onReplacePaints}
            style={style}
        />
        : <TextEditor
            style={style}
        />

    const header = (
        <div className="header">
            <div className="names">
                <Input
                    onStateChange={({ editable }) => setNameEditable(editable)}
                    validator={/^[a-zA-Z]+$/g}
                    onChange={onChange}
                    value={groupName}
                    name="group"
                />
                
                <span>/</span>
                
                <Input
                    onStateChange={({ editable }) => setNameEditable(editable)}
                    validator={/^[a-zA-Z]+$/g}
                    onChange={onChange}
                    value={styleName}
                    name="style"
                />
            </div>

            <div className="actions">
                {collectionSelector}

                <div className="close" onClick={props.onClose}>
                    <Icons.Close size={20} color="#000" />
                </div>
            </div>
        </div>
    )
        
    return (
        <div className="editor">
            {header}

            <div className="content">
                {editor}
            </div>
        </div>
    )
}
