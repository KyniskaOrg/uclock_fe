import 'react-date-range/dist/styles.css' // main style file
import '../dateRange/default.css' // theme css file
import CIcon from '@coreui/icons-react'
import { DateRangePicker, createStaticRanges } from 'react-date-range'
import { useState, useRef, useEffect } from 'react'
import { cilCalendar } from '@coreui/icons'
import { enGB } from "date-fns/locale";

const getCurrentWeek = () => {
  const today = new Date();
  
  // Calculate difference from Monday (1 = Monday, 0 = Sunday, etc.)
  const dayOfWeek = today.getDay(); 
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust if today is Sunday
  
  // Set start of week to Monday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  // Set end of week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return {
    startDate: startOfWeek,
    endDate: endOfWeek,
    key: 'selection',
  };
};


const DateRange = ({ dateRange, setDateRange }) => {
  const [open, setOpen] = useState(false)
  const datePickerRef = useRef(null)

  useEffect(() => {
    setDateRange(getCurrentWeek())
  }, [setDateRange])

  const handleSelect = (ranges) => {
    const { startDate } = ranges.selection
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)
    setDateRange({ startDate, endDate, key: 'selection' })
  }

  const convertDate = (date) => {
    let dt = new Date(date)
    return `${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}`
  }

  const handleDate = (action) => {
    const { startDate, endDate } = dateRange
    const totalDays = 7
    let newStartDate, newEndDate

    if (action === 'add') {
      newStartDate = new Date(startDate)
      newStartDate.setDate(newStartDate.getDate() + totalDays)

      newEndDate = new Date(endDate)
      newEndDate.setDate(newEndDate.getDate() + totalDays)
    } else if (action === 'sub') {
      newStartDate = new Date(startDate)
      newStartDate.setDate(newStartDate.getDate() - totalDays)

      newEndDate = new Date(endDate)
      newEndDate.setDate(newEndDate.getDate() - totalDays)
    }

    setDateRange({ startDate: newStartDate, endDate: newEndDate, key: 'selection' })
  }

  const handleBlur = (e) => {
    // Check if the relatedTarget is inside the date picker
    if (!datePickerRef.current.contains(e.relatedTarget)) {
      setOpen(false)
    }
  }

  const customStaticRanges = createStaticRanges([
    {
      label: 'Last Week',
      range: () => {
        const today = new Date()
        const startOfLastWeek = new Date(today)
        startOfLastWeek.setDate(today.getDate() - today.getDay() - 7)
        startOfLastWeek.setHours(0, 0, 0, 0)

        const endOfLastWeek = new Date(startOfLastWeek)
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6)
        endOfLastWeek.setHours(23, 59, 59, 999)

        return { startDate: startOfLastWeek, endDate: endOfLastWeek }
      },
    },
    {
      label: 'This Week',
      range: getCurrentWeek, // Using your existing function
    },
  ])

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
              months={1}
              direction={'horizontal'}
              rangeColors={['#5856d6']}
              showDateDisplay={false}
              showMonthAndYearPickers={false}
              editableDateInputs={false}
              ranges={[dateRange]}
              staticRanges={customStaticRanges}
              inputRanges={[]}
              onChange={handleSelect}
              locale={enGB}
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
