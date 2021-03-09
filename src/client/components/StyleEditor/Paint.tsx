import { Scrollbar } from "react-scrollbars-custom"
import map from "lodash-es/map"
import * as React from "react"
import { toJS } from "mobx"

import { ColorEditor, GradientEditor, Icons, SelectPopup } from "client/components"
import * as paintsHelpers from "utils/style/paints"
import { RawStyle, StyleType } from "models"
import objectSwitch from "utils/objectSwitch"

function UnsupportedEditor(props: any) {
    return (
        <div className="unsupported-editor">
            <div className="title">
                Thats paint type not supported is this plugin <br />
                Use Figma instead for edit style
            </div>
        </div>
    )
}

interface ItemProps {
    update: (index: number, paint: Paint) => void,
    remove: (index: number) => void,

    index: number,
    paint: Paint,
}

function PaintItem({ paint, index, update, remove }: ItemProps) {
    const types = {
        GRADIENT_LINEAR: "Linear Gradient",
        SOLID: "Color",
    }

    const TargetEditor = objectSwitch(paint.type, {
        GRADIENT_LINEAR: GradientEditor,
        SOLID: ColorEditor,

        default: UnsupportedEditor,
    })

    const onChangePaint = React.useCallback((_paint: Paint) => {
        update(index, _paint)
    }, [ paint ])

    const onChangePaintType = React.useCallback((paintType: "SOLID" | "GRADIENT_LINEAR") => () => {
        const _paint = paintsHelpers.createDraftPaint(paintType)
        update(index, _paint)
    }, [ paint ])

    const onRemovePaint = React.useCallback(() => {
        remove(index)
    }, [ paint ])

    return (
        <div className="item paint">
            <div className="header">
                <SelectPopup
                    title={types[paint.type] || paint.type}
                    triggerClassName="switch"
                    iconSize={11}
                    icon="Caret"

                    items={[
                        { title: "Linear Gradient", onClick: onChangePaintType("GRADIENT_LINEAR") },
                        { title: "Color", onClick: onChangePaintType("SOLID") },
                    ]}
                />

                <div className="remove" onClick={onRemovePaint}>
                    <Icons.Trash color="#f44336" size={16} />
                </div>
            </div>

            <TargetEditor
                onChange={onChangePaint}
                paint={toJS(paint as any)}
            />
        </div>
    )
}

interface IProps {
    onReplacePaints?: (paints: Paint[]) => void,
    style: RawStyle,
}

export function PaintEditor({ style, onReplacePaints }: IProps) {
    const [ paints, setPaints ] = React.useState<Paint[]>([])

    React.useEffect(() => {
        if (style.inner.type !== StyleType.PAINT) {
            return null
        }

        setPaints(style.inner.properties.paints as any)
    }, [])

    const updatePaints = React.useCallback((_paints: Paint[]) => {
        setPaints(_paints)

        if (onReplacePaints) {
            onReplacePaints(_paints)
        }
    }, [ paints ])

    const onInsertDraft = React.useCallback(() => {
        const _paint = paintsHelpers.createDraftPaint("SOLID") as any
        const _paints = [ ...paints, _paint ]
        updatePaints(_paints)
    }, [ paints ])

    const onUpdatePaint = React.useCallback((index: number, paint: Paint) => {
        const _paints = [ ...paints ]
        _paints[index] = paint
        updatePaints(_paints)
    }, [ paints ])

    const onRemovePaint = React.useCallback((index: number) => {
        const _paints = [ ...paints ]
        _paints.splice(index, 1)
        updatePaints(_paints)
    }, [ paints ])
    
    const items = map(paints, (paint, index) => (
        <PaintItem 
            key={`item-${paint.type}-${index}`}
            update={onUpdatePaint}
            remove={onRemovePaint}
            paint={paint}
            index={index}
        />
    ))

    return (
        <Scrollbar noScrollX native={false} className="paint-editor">
            <div className="items">
                {items}
            </div>

            <div className="style-editor-actions">
                <div className="action add" onClick={onInsertDraft}>
                    <Icons.Plus color="#18a0fb" size={20} />
                    <span>Add Paint</span>
                </div>
            </div>
        </Scrollbar>
    )
}
