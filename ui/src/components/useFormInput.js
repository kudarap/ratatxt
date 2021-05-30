import { useState } from 'react'

function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue)

  function handleChange(e) {
    setValue(e.target.value)
  }

  return {
    value,
    onChange: handleChange,
  }
}

export default useFormInput

export function setValue(input, value) {
  input.onChange({
    target: {
      value,
    },
  })
}
