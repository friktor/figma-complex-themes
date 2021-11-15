import * as React from "react"
import cx from "classnames"

interface IProps {
  onStateChange?: (res: { name: string; editable: boolean }) => void
  onChange: (res: { name: string; value: string }) => void

  validator?: RegExp
  value: string
  name: string
}

export function Input(props: IProps) {
  const { name, onChange, onStateChange, validator } = props
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [editable, setEditable] = React.useState(false)
  const [value, setValue] = React.useState("")

  React.useEffect(() => {
    setValue(props.value)
  }, [props.value])

  const onClickEdit = React.useCallback(() => {
    onStateChange && onStateChange({ name, editable: true })
    setEditable(true)

    setTimeout(() => inputRef.current && inputRef.current.focus(), 50)
  }, [])

  const onChangeValue = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    // @TODO: its very slow, update for fast check mask
    // if (validator) {
    //     if (validator.test(value)) {
    //         setValue(value)
    //     }
    // } else {
    //     setValue(value)
    // }

    setValue(value)
  }, [])

  const onPressEnter = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        onStateChange && onStateChange({ name, editable: false })
        setEditable(false)

        onChange({ value, name })
      }
    },
    [value],
  )

  const onBlur = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      onStateChange && onStateChange({ name, editable: false })
      onChange({ name, value })
      setEditable(false)
    },
    [value],
  )

  return (
    <div className={cx("input", name, { editable })}>
      {!editable ? (
        <span onDoubleClick={onClickEdit}>{value}</span>
      ) : (
        <input
          onKeyPress={onPressEnter}
          onChange={onChangeValue}
          onBlur={onBlur}
          ref={inputRef}
          value={value}
          type="text"
        />
      )}
    </div>
  )
}
