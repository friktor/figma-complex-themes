import React from "react"

import { IconProps, defaultProps } from "./props"

export function MenuDots(props: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg" className="prefix__ionicon" viewBox="0 0 512 512"
            height={props?.size || defaultProps.size}
            width={props?.size || defaultProps.size}
        >
            <circle fill={props?.color || defaultProps.color} cx={256} cy={256} r={48} />
            <circle fill={props?.color || defaultProps.color} cx={416} cy={256} r={48} />
            <circle fill={props?.color || defaultProps.color} cx={96} cy={256} r={48} />
        </svg>
    )
}
