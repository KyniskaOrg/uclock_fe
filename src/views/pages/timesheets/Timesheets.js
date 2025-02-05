import React, { useState } from 'react'
import TimesheetTable from '../../../components/table/TimesheetTable'
import { CCol, CRow } from '@coreui/react'
import EmployeeDropdown from '../../../components/EmployeeDropDown'
import Calender from '../../../components/calender/calneder'

const Timesheet = () => {
  const [employee, setEmployee] = useState({ value: null, label: null })
  const [dateRange, setDateRange] = useState({ firstDay: null, lastDay: null })

  return (
    <>
      <CRow className="align-items-center mb-3">
        <CCol xs={5} xl={2}>
          <h3>Timesheet</h3>
        </CCol>
        <CCol style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CRow>
            <CCol style={{ width: 'auto' }}>
              <EmployeeDropdown setEmployee={setEmployee} employee={employee} />
            </CCol>
            <CCol style={{ width: 'auto' }}>
              <Calender dateRange={dateRange} setDateRange={setDateRange} />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <TimesheetTable employeeId={employee.value} dateRange={dateRange} />
    </>
  )
}

export default Timesheet
