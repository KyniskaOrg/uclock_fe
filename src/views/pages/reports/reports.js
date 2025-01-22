import React, { useState, useRef } from 'react'
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
)

const Reports = () => {
  const [dateRange, setDateRange] = useState({ firstDay: null, lastDay: null })
  const barChartRef = useRef(null) // Ref for the Bar chart
  const doughnutChartRef = useRef(null) // Ref for the Doughnut chart

  // Data for Bar Chart
  const barChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Summary',
        backgroundColor: '#f87979',
        data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
      },
    ],
  }

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: ' Over Time',
      },
    },
  }

  // Data for Doughnut Chart
  const doughnutChartData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    animation: {
      duration: 0, // Fully disable animations
    },
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'],
        hoverBackgroundColor: [
          '#ff6384aa',
          '#36a2ebaa',
          '#ffce56aa',
          '#4bc0c0aa',
          '#9966ffaa',
          '#ff9f40aa',
        ],
      },
    ],
  }

  const doughnutChartOptions = {
    responsive: true,
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Summary',
      },
    },
  }

  return (
    <>
      <CRow className="align-items-center mb-3">
        <CCol xs={5} xl={2}>
          <h3>Reports</h3>
        </CCol>
        <CCol className="flex-row-end">
          <Calender dateRange={dateRange} setDateRange={setDateRange} />
        </CCol>
      </CRow>

      {/* Bar Chart Card */}
      <CCard className="mb-4" style={{ borderRadius:0 }}>
        <CCardHeader style={{ background: '#e4eaee',borderRadius:0 }} >
          Bar Chart <DownloadPdf barChartRef={barChartRef} doughnutChartRef={doughnutChartRef} />
        </CCardHeader>
        <CCardBody>
          <Bar ref={barChartRef} data={barChartData} options={barChartOptions} />
          {/* Doughnut Chart Card */}
          <Doughnut
            id="doughnutChartCurrent"
            ref={doughnutChartRef}
            data={doughnutChartData}
            options={doughnutChartOptions}
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default Reports
