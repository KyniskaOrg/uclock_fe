import React, { useState, useRef, useEffect } from 'react'
import { CCol, CRow, CCard, CCardHeader, CCardBody } from '@coreui/react'
import Calender from '../../../components/calender/calneder'
import { Bar, Doughnut } from 'react-chartjs-2'
import DownloadPdf from './reportPdf'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  DoughnutController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import EmployeeDropdown from '../../../components/EmployeeDropDown'
import { getTimesheetRecord } from '../../../apis/timesheetApis'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import ProjectDropdown from '../../../components/ProjectDropDown'
// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  DoughnutController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
)

const Reports = () => {
  const [dateRange, setDateRange] = useState({ firstDay: null, lastDay: null })
  const [employee, setEmployee] = useState({ value: null, label: null })
  const [project, setProject] = useState({ value: null, label: null })
  const [timesheetData, setTimesheetData] = useState([]) // Store the full timesheet data
  const [isChartUpdated, setIsChartUpdated] = useState(false)

  const barChartRef = useRef(null) // Ref for the Bar chart
  // const doughnutChartRef = useRef(null) // Ref for the Doughnut chart

  const getDayLabel = (dayOffset) => {
    const today = new Date()
    const day = new Date(dateRange.firstDay ? dateRange.firstDay : today)
    day.setDate(day.getDate() + dayOffset)
    const options = { weekday: 'short', day: 'numeric', month: 'short' }
    return day.toLocaleDateString('en-US', options).replace(',', '')
  }

  // Calculate bar chart data based on timesheetData and dateRange
  const calculateBarChartData = () => {
    const barChartDataArray = []
    const startDate = new Date(dateRange.firstDay)

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      const dateString = date.toISOString().slice(0, 10)

      const hoursWorked = timesheetData.find((item) => item.date === dateString)?.hours_worked
      //  console.log(hoursWorked)
      // Parse hours_worked (e.g., "0:11" to 0.1833)
      let totalHours = 0
      if (hoursWorked) {
        const [hours, minutes] = hoursWorked.split(':')

        totalHours = parseFloat(hours) + parseFloat(minutes) / 100
      }

      barChartDataArray.push(totalHours)
    }
    //  console.log(barChartDataArray)
    return barChartDataArray
  }

  const barChartData = {
    labels: [
      getDayLabel(0),
      getDayLabel(1),
      getDayLabel(2),
      getDayLabel(3),
      getDayLabel(4),
      getDayLabel(5),
      getDayLabel(6),
    ],
    datasets: [
      {
        label: 'Summary',
        backgroundColor: '#8BC34A',
        data: calculateBarChartData(), // Use calculated data
      },
    ],
  }

  const barChartOptions = {
    responsive: true,
    animation: {
      duration: 0, // Fully disable animations
    },
    scales: {
      x: {
        ticks: {
          callback: function (value, index, values) {
            // Customize the label here
            const customLabel = `${this.getLabelForValue(value)}`
            return customLabel
          },
          color: '#333', // Color for the labels
          font: {
            size: 12, // Font size for the labels
            family: 'Arial', // Font family
          },
        },
      },
      y: {
        ticks: {
          callback: function (value, index, values) {
            // Customize the label here
            const customLabel = `${value}h`
            return customLabel
          },
          color: '#333',
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: ' Over Time',
      },
      datalabels: {
        display: true,
        color: 'black',
        formatter: (value, context) => {
          if (!value) {
            return ''
          }
          const [h, m] = value.toFixed(2).toString().split('.')
          return `${h + ':' + m}`
        },
        font: {
          // weight: 'bold', // Set font weight
          size: 12, // Set font size
        },
      },
    },
  }

  // Data for Doughnut Chart
  // const doughnutChartData = {
  //   labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  //   animation: {
  //     duration: 0, // Fully disable animations
  //   },
  //   datasets: [
  //     {
  //       label: '# of Votes',
  //       data: [12, 19, 3, 5, 2, 3],
  //       backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'],
  //       hoverBackgroundColor: [
  //         '#ff6384aa',
  //         '#36a2ebaa',
  //         '#ffce56aa',
  //         '#4bc0c0aa',
  //         '#9966ffaa',
  //         '#ff9f40aa',
  //       ],
  //     },
  //   ],
  // }

  // const doughnutChartOptions = {
  //   responsive: true,
  //   animation: {
  //     duration: 0,
  //   },
  //   plugins: {
  //     legend: {
  //       position: 'top',
  //     },
  //     title: {
  //       display: true,
  //       text: 'Over Time',
  //     },
  //   },
  // }

  const fetchTimesheetDate = async (query) => {
    try {
      const data = await getTimesheetRecord(query)
      setTimesheetData(data)
      setIsChartUpdated(true)
    } catch (e) {
      console.error('Error fetching timesheet data:', e)
    }
  }

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 200,
    }),
  }
  useEffect(() => {
    setIsChartUpdated(false)
    if (employee.value && dateRange.firstDay && project.value) {
      fetchTimesheetDate({
        employee_id: employee.value,
        project_id: project.value,
        start_date: dateRange.firstDay,
      })
    }
  }, [employee, dateRange, project])

  return (
    <>
      <CRow className="align-items-center mb-3">
        <CCol xs={5} xl={2}>
          <h3>Reports</h3>
        </CCol>
        <CCol className="flex-row-end">
          <div style={{ marginLeft: 10 }}>
            <Calender dateRange={dateRange} setDateRange={setDateRange} />
          </div>
        </CCol>
      </CRow>
      {/* Bar Chart Card */}
      <CCard className="mb-4" style={{ borderRadius: 0 }}>
        <CCardHeader style={{ background: '#e4eaee', borderRadius: 0 }}>
          <CRow className="align-items-center">
            <CCol style={{ display: 'flex', flexDirection: 'row' }}>
              <ProjectDropdown
                setValue={setProject}
                value={project}
                customStyles={customStyles}
                placeholder="Projects"
              />
              <EmployeeDropdown
                setEmployee={setEmployee}
                employee={employee}
                customStyles={customStyles}
                placeholder="Employee"
              />
            </CCol>
            <CCol className="flex-row-end">
              <DownloadPdf
                barChartRef={barChartRef}
                // doughnutChartRef={doughnutChartRef}
                isChartUpdated={isChartUpdated}
              />
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          <div style={{ width: '100%', height: 'auto' }}>
            <Bar
              id="barChartCurrent"
              ref={barChartRef}
              data={barChartData}
              options={barChartOptions}
            />
          </div>
          {/* Doughnut Chart Card */}
          {/* <div style={{ width: '100%', height: '60vh' }}>
            <Doughnut
              id="doughnutChartCurrent"
              ref={doughnutChartRef}
              data={doughnutChartData}
              options={doughnutChartOptions}
            />
          </div> */}
        </CCardBody>
      </CCard>
    </>
  )
}

export default Reports
