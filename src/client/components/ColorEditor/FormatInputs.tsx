import Color from "rc-color-picker/lib/helpers/color"
import clone from "lodash-es/clone"
import map from "lodash-es/map"
import * as React from "react"
import chroma from "chroma-js"
import cx from "classnames"

interface IProps {
    opacity: number,
    color: Color,

    onChange: (params: {
        opacity: number,
        color: Color,
    }) => void,
}

export function FormatInputs(props: IProps) {
    const [ rgb, setRgb ] = React.useState([ "255", "255", "255" ])
    const [ opacity, setOpacity ] = React.useState("100")
    const [ hex, setHex ] = React.useState("FFFFFF")

    React.useEffect(() => {
        const color = props.color.toHexString()

        setRgb(chroma(color).rgb().map(n => n.toString()))
        setOpacity(props.opacity.toFixed(0))
        setHex(color.replace("#", ""))
    }, [ props.color, props.opacity ])

    const formats = {
        hex: [
            { name: "hex", label: "#" },
            { name: "alpha", label: "alpha" },
        ],

        rgb: [
            { name: "r", label: "R" },
            { name: "g", label: "G" },
            { name: "b", label: "B" },
        ]
    }

    const _iterator = (item: typeof formats.hex[0], index: number): JSX.Element => {
        let value

        if (item.name === "hex") {
            value = hex
        }
        
        if (item.name === "alpha") {
            value = opacity
        }

        if (["r", "g", "b"].includes(item.name)) {
            value = rgb[index]
        }

        const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value: newValue } = event.target

            if (item.name === "hex") {
                setHex(newValue)
            }
            
            if (item.name === "alpha") {
                setOpacity(newValue)
            }
    
            if (["r", "g", "b"].includes(item.name)) {
                const _rgb = clone(rgb)
                _rgb[index] = newValue
                setRgb(_rgb)
            }
        }

        const onBlur = () => {
            if (item.name === "hex") {
                const changed = hex !== props.color.toHexString().replace("#", "")

                if (chroma.valid(hex) && changed) {
                    props.onChange({
                        opacity: parseInt(opacity),
                        color: new Color(hex),
                    })
                } else {
                    setHex(props.color.toHexString().replace("#", ""))
                }
            }
            
            if (item.name === "alpha") {
                const _opacity = parseInt(opacity)

                if (
                    _opacity &&
                    _opacity !== props.opacity &&
                    _opacity >= 0 &&
                    _opacity <= 100
                ) {
                    props.onChange({
                        color: new Color(hex),
                        opacity: _opacity,
                    })
                } else {
                    setOpacity(props.opacity.toFixed(0))
                }
            }
    
            if (["r", "g", "b"].includes(item.name)) {
                const target = parseInt(rgb[index])
                
                if (target && target >= 0 && target <= 255) {
                    const _hex = chroma(rgb.map(n => parseInt(n))).hex()
                    
                    props.onChange({
                        opacity: parseInt(opacity),
                        color: new Color(_hex),
                    })
                } else {
                    const _rgb = chroma(props.color.toHexString()).rgb().map(n => n.toString())
                    const _newRgb = clone(rgb)
                    _newRgb[index] = _rgb[index]
                    
                    setRgb(_newRgb)
                }
            }
        }

        const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
                onBlur()
            }
        }

        return (
            <div className={cx("cinput", item.name)} key={`item-${item.name}`}>
                <label htmlFor={item.name}>
                    {item.label}
                </label>
                
                <input
                    onKeyDown={onKeyDown}
                    onChange={onChange}
                    name={item.name}
                    onBlur={onBlur}
                    value={value}
                    type="text"
                />
            </div>
        )
    }

    const rgbInputs = map(formats.rgb, _iterator)
    const hexInputs = map(formats.hex, _iterator)

    return (
        <div className="format">
            <div className="inputs">
                {hexInputs}
            </div>

            <div className="inputs">
                {rgbInputs}
            </div>
        </div>
    )
}
