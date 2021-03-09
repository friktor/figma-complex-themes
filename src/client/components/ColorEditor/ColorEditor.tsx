import Color from "rc-color-picker/lib/helpers/color"
import RibbonPicker from "rc-color-picker/lib/Ribbon"
import AlphaPicker from "rc-color-picker/lib/Alpha"
import ColorBoard from "rc-color-picker/lib/Board"
import * as React from "react"
import chroma from "chroma-js"

import { FormatInputs } from "./FormatInputs"

interface IProps {
    onChange: (paint: Paint) => void,
    paint: Paint,
}

export function ColorEditor(props: IProps) {
    const [ color, setColor ] = React.useState(new Color("#000"))
    const [ opacity, setOpacity ] = React.useState(100)

    if (props.paint.type !== "SOLID") {
        throw new Error("Only 'SOLID' paint type is accepted")
    }

    React.useEffect(() => {
        if (props.paint.type !== "SOLID") {
            return
        }

        const { r, g, b } = props.paint.color
        const hex = chroma(r, g, b, 'gl').hex()

        if (`#${hex}` !== color.toHexString()) {
            setColor(new Color(hex))
        }

        if ((props.paint.opacity * 100) !== opacity) {
            setOpacity(props.paint.opacity * 100)
        }
    }, [])

    const updateParent = React.useCallback((color: Color, opacity: number) => {
        const hex = color.toHexString()
        const [ r, g, b ] = chroma(hex).gl()

        props.onChange({
            opacity: opacity / 100,
            blendMode: "NORMAL",
            color: { r, g, b },
            type: "SOLID",
        })
    }, [])

    const onChange = React.useCallback((_color: Color) => {
        const __color = new Color(_color.toHexString())
        setColor(__color)

        updateParent(__color, opacity)
    }, [ color, opacity ])

    const onChangeOpacity = React.useCallback((_opacity: number) => {
        setOpacity(_opacity)

        updateParent(color, _opacity)
    }, [ opacity, color ])

    const onChangeInputs = React.useCallback((params: {
        opacity: number,
        color: Color,
    }) => {
        setOpacity(params.opacity)
        setColor(params.color)

        updateParent(params.color, params.opacity)
    }, [])

    return (
        <div className="color-editor">
            <ColorBoard
                rootPrefixCls="rc-color-picker-panel"
                onChange={onChange}
                color={color}
            />

            <div className="sliders">
                <div className="picker">
                    <RibbonPicker
                        rootPrefixCls="rc-color-picker-panel"
                        onChange={onChange}
                        color={color}
                    />
                </div>
                <div className="picker">
                    <AlphaPicker
                        rootPrefixCls="rc-color-picker-panel"
                        onChange={onChangeOpacity}
                        alpha={opacity}
                        color={color}
                    />
                </div>
            </div>

            <FormatInputs
                onChange={onChangeInputs}
                opacity={opacity}
                color={color}
            />
        </div>
    )
}
