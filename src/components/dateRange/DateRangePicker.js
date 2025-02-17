import 'react-date-range/dist/styles.css' // main style file
import './default.css' // theme css file
import CIcon from '@coreui/icons-react'
import { DateRangePicker } from 'react-date-range'
import { useState, useRef } from 'react'
import { cilCalendar } from '@coreui/icons'
import { addMonths, endOfMonth, subMonths, addDays, subDays } from 'date-fns'

const DateRange = ({ dateRange, setDateRange }) => {
  const [open, setOpen] = useState(false)

  const datePickerRef = useRef(null)

  const handleSelect = (ranges) => {
    setDateRange(ranges.selection)
  }

  const convertDate = (date) => {
    let dt = new Date(date)
    return `${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}`
  }

  const isWholeMonthSelected = (startDate, endDate) => {
    let start = new Date(startDate)
    let end = new Date(endDate)

    // Get first and last days of the month
    let firstDay = new Date(start.getFullYear(), start.getMonth(), 1)
    let lastDay = new Date(end.getFullYear(), end.getMonth() + 1, 0, 23, 59, 59, 999) // Last day at 23:59:59.999
    // Check if the selected range matches the entire month
    return start.getTime() === firstDay.getTime() && end.getTime() === lastDay.getTime()
  }

  const handleDate = (action) => {
    const { startDate, endDate } = dateRange
    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1

    let newStartDate, newEndDate

    if (isWholeMonthSelected(startDate, endDate)) {
      if (action === 'add') {
        newStartDate = addMonths(startDate, 1)
        newEndDate = endOfMonth(newStartDate) // Ensure end date is last day of the new month
      } else if (action === 'sub') {
        newStartDate = subMonths(startDate, 1)
        newEndDate = endOfMonth(newStartDate)
      }
    } else {
      if (action === 'add') {
        newStartDate = addDays(startDate, totalDays)
        newEndDate = addDays(endDate, totalDays)
      } else if (action === 'sub') {
        newStartDate = subDays(startDate, totalDays - 1)
        newEndDate = subDays(endDate, totalDays - 1)
      }
    }
    setDateRange({
      startDate: newStartDate,
      endDate: newEndDate,
      key: 'selection',
    })
  }

  const handleBlur = (e) => {
    // Check if the relatedTarget is inside the date picker
    if (!datePickerRef.current.contains(e.relatedTarget)) {
      setOpen(false)
    }
  }

  return (
    <div style={{ display: 'flex' }}>
      <div
        className="week-picker-display-left"
        onBlur={handleBlur}
        onClick={() => setOpen(true)}
        tabIndex={0}
        ref={datePickerRef}
      >
        <CIcon icon={cilCalendar} size="lg" />
        <p style={{ margin: 0 }}>
          {convertDate(dateRange.startDate)} - {convertDate(dateRange.endDate)}
        </p>

        {open && (
          <div className="week-picker-options">
            <DateRangePicker
              months={2}
              direction={'horizontal'}
              rangeColors={['#5856d6']}
              showDateDisplay={false}
              showMonthAndYearPickers={false}
              editableDateInputs={false}
              ranges={[dateRange]}
              inputRanges={[]}
              onChange={(range) => handleSelect(range)}
            />
          </div>
        )}
      </div>
      <div className="week-picker-display-mid" onClick={() => handleDate('sub')}>
        <div className="wacky-buttons">{'<'}</div>
      </div>

      <div className="week-picker-display-right" onClick={() => handleDate('add')}>
        <div className="wacky-buttons">{'>'}</div>
      </div>
    </div>
  )
}

export default DateRange
