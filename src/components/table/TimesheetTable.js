import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTableFoot,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilX } from '@coreui/icons'

const TimesheetTable = () => {
  const headerStyle = {
    // border: '1px solid #ccc',
    padding: '8px',
    backgroundColor: 'rgba(37, 43, 54, 0.03)',
    fontWeight: 'bold',
  }

  const cellStyle = {
    // border: '1px solid #ccc',
    padding: '8px',
  }

  // Initial dummy data
  const [data, setData] = useState([
    {
      id: 1,
      task: 'Project A',
      monday: 2,
      tuesday: 3,
      wednesday: 4,
      thursday: 5,
      friday: 6,
      saturday: 0,
      sunday: 0,
    },
    {
      id: 2,
      task: 'Project B',
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 0,
      sunday: 1,
    },
    {
      id: 3,
      task: 'Project C',
      monday: 0,
      tuesday: 1,
      wednesday: 2,
      thursday: 2,
      friday: 3,
      saturday: 4,
      sunday: 5,
    },
  ])

  // Function to delete a row
  const handleDelete = (id) => {
    setData(data.filter((row) => row.id !== id))
  }

  // Function to add a new row
  const handleAddRow = () => {
    const newRow = {
      id: data.length + 1,
      task: `New Task ${data.length + 1}`,
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
    }
    setData([...data, newRow])
  }

  // Calculate column totals
  const totals = data.reduce(
    (acc, row) => {
      acc.monday += row.monday
      acc.tuesday += row.tuesday
      acc.wednesday += row.wednesday
      acc.thursday += row.thursday
      acc.friday += row.friday
      acc.saturday += row.saturday
      acc.sunday += row.sunday
      return acc
    },
    { monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0, sunday: 0 },
  )

  const grandTotal =
    totals.monday +
    totals.tuesday +
    totals.wednesday +
    totals.thursday +
    totals.friday +
    totals.saturday +
    totals.sunday

  // Helper function to get the day name and date
  const getDayLabel = (dayOffset) => {
    const today = new Date()
    const day = new Date(today)
    day.setDate(today.getDate() + dayOffset)
    const options = { weekday: 'short', day: 'numeric', month: 'short' }
    return day.toLocaleDateString('en-US', options).replace(',', '')
  }

  return (
    <>
      <CTable hover responsive style={{ border: '1px solid #ccc'}}>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col" style={headerStyle}>
              Task
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={headerStyle}>
              {getDayLabel(0)} {/* Monday */}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={headerStyle}>
              {getDayLabel(1)} {/* Tuesday */}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={headerStyle}>
              {getDayLabel(2)} {/* Wednesday */}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={headerStyle}>
              {getDayLabel(3)} {/* Thursday */}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={headerStyle}>
              {getDayLabel(4)} {/* Friday */}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={headerStyle}>
              {getDayLabel(5)} {/* Saturday */}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={headerStyle}>
              {getDayLabel(6)} {/* Sunday */}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={headerStyle}>
              Total
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={headerStyle}>
              Actions
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.map((row, index) => {
            const rowTotal =
              row.monday +
              row.tuesday +
              row.wednesday +
              row.thursday +
              row.friday +
              row.saturday +
              row.sunday
            return (
              <CTableRow key={row.id}>
                <CTableDataCell style={cellStyle}>{row.task}</CTableDataCell>
                <CTableDataCell style={cellStyle}>{row.monday}h</CTableDataCell>
                <CTableDataCell style={cellStyle}>{row.tuesday}h</CTableDataCell>
                <CTableDataCell style={cellStyle}>{row.wednesday}h</CTableDataCell>
                <CTableDataCell style={cellStyle}>{row.thursday}h</CTableDataCell>
                <CTableDataCell style={cellStyle}>{row.friday}h</CTableDataCell>
                <CTableDataCell style={cellStyle}>{row.saturday}h</CTableDataCell>
                <CTableDataCell style={cellStyle}>{row.sunday}h</CTableDataCell>
                <CTableDataCell style={cellStyle}>{rowTotal}h</CTableDataCell>
                <CTableDataCell style={cellStyle}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CIcon
                      customClassName="nav-icon"
                      icon={cilX}
                      style={{
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleDelete(row.id)}
                    />
                  </div>
                </CTableDataCell>
              </CTableRow>
            )
          })}
        </CTableBody>
        <CTableFoot>
          <CTableRow>
            <CTableHeaderCell style={headerStyle}>Total</CTableHeaderCell>
            <CTableDataCell style={headerStyle}>{totals.monday}h</CTableDataCell>
            <CTableDataCell style={headerStyle}>{totals.tuesday}h</CTableDataCell>
            <CTableDataCell style={headerStyle}>{totals.wednesday}h</CTableDataCell>
            <CTableDataCell style={headerStyle}>{totals.thursday}h</CTableDataCell>
            <CTableDataCell style={headerStyle}>{totals.friday}h</CTableDataCell>
            <CTableDataCell style={headerStyle}>{totals.saturday}h</CTableDataCell>
            <CTableDataCell style={headerStyle}>{totals.sunday}h</CTableDataCell>
            <CTableDataCell style={headerStyle}>{grandTotal}h</CTableDataCell>
            <CTableDataCell style={headerStyle}></CTableDataCell>
          </CTableRow>
        </CTableFoot>
      </CTable>
      <div style={{ padding: '10px' }}>
        <CButton color="primary" onClick={handleAddRow}>
          Add New Row
        </CButton>
      </div>
    </>
  )
}

export default TimesheetTable
