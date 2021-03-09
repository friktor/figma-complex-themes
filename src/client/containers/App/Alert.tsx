import * as React from "react"
import cx from "classnames"

interface IProps {
    options: { type: "info" | "success" | "error" },
    close: () => void,
    message: string,
    style: any,
}

export function AlertMessage({ message, close, options }: IProps) {
    return (
        <div className={cx("alert", options.type)} onClick={close}>
            <div className="message">
                {message}
            </div>
        </div>
    )
}
