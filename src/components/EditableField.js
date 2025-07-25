import { useState } from 'react'
import { CFormInput } from '@coreui/react'
const EditebleCell = ({ value, key, onEnter }) => {
  const [cellVal, setCellVal] = useState(value)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault() // Prevents form submission behavior
      onEnter(cellVal) // Call the provided function with the value
    }
  }

  return (
    <CFormInput
      className="form-control-table"
      key={key}
      value={cellVal}
      onChange={(e) => setCellVal(e.target.value)}
      onKeyDown={handleKeyDown} // Detect Enter key
    ></CFormInput>
  )
}

export default EditebleCell 
