import { GradientPicker, AnglePicker } from "react-linear-gradient-picker"
import { Panel as ColorPicker } from "rc-color-picker"
import * as React from "react"

import { paints } from "utils/style"
import { DeepMutable } from "models"

interface IProps {
    onChange: (paint: Paint) => void,
    paint: DeepMutable<Paint>,
}

const WrappedColorPicker = ({ onSelect, ...rest }: any) => (
    <ColorPicker {...rest}
        onChange={(color) => onSelect(color.color, color.alpha / 100)}
        className="color-picker"
        mode="RGB"
    />
)

export function GradientEditor({ paint, onChange }: IProps) {
    const [ angle, setAngle ] = React.useState(25)

    const [ stops, setStops ] = React.useState<paints.Stop[]>([
        { offset: "0.0", color: "rgb(0,0,0)" },
        { offset: "1.0", color: "rgb(255,255,255)" },
    ])

    if (paint.type !== "GRADIENT_LINEAR") {
        throw new Error("Only 'GRADIENT_LINEAR' paint type is accepted")
    }

    React.useEffect(() => {
        if (paint.type !== "GRADIENT_LINEAR") {
            return
        }

        setAngle(paints.convertGradientAngle.fromMatrix(paint.gradientTransform))
        setStops(paints.convertGradientStops.fromFigma(paint.gradientStops))
    }, [ paint ])

    const onChangeStops = (_stops: paints.Stop[]) => {
        onChange(paints.createGradientLinear(angle, _stops))
        setStops(_stops)
    }

    const onChangeAngle = (_angle: number) => {
        onChange(paints.createGradientLinear(_angle, stops))
        setAngle(_angle)
    }

    const gradientProps = {
        onPaletteChange: onChangeStops,
        paletteHeight: 32,
        palette: stops,
        width: 246,
    }

    const _stops = stops.map(({ offset, color }) => {
        const _offset = (parseFloat(offset) * 100).toFixed(0)
        return `${color} ${_offset}%`
    }).join(", ")
    
    const background = `linear-gradient(${angle}deg, ${_stops})`

    return (
        <div className="gradient-editor">
            <GradientPicker {...gradientProps}>
                <WrappedColorPicker />
            </GradientPicker>

            <div className="angle">
                <AnglePicker angle={angle} setAngle={onChangeAngle} />
                
                <div
                    style={{ backgroundImage: background }}
                    className="gradient preview"
                />  
            </div>
        </div>
    )
}
