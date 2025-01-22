import React, { useEffect, useState } from 'react'
import { PDFDownloadLink, Document, Page, Image, Text, StyleSheet } from '@react-pdf/renderer'
import { CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPrint } from '@coreui/icons'

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  chartImage: {
    width: '100%',
    height: 'auto',
  },
})

// Define the PDF document
const MyDocument = ({ barChartImage, doughnutChartImage }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}> Report</Text>
      {barChartImage && <Image src={barChartImage} style={styles.chartImage} />}
      {doughnutChartImage && <Image src={doughnutChartImage} style={styles.chartImage} />}
    </Page>
  </Document>
)

// Main component to render the download link
const DownloadPdf = ({ barChartRef, doughnutChartRef }) => {
  let chartImage,
    chartImage2 = ''

  if (barChartRef.current) {
    const chartInstance = barChartRef.current.chartInstance || barChartRef.current // Access Chart.js instance
    chartImage = chartInstance.toBase64Image() // Generate Base64 image
  } else {
    console.error('Chart instance is not available.')
  }
  if (doughnutChartRef.current) {
    const chartInstance = doughnutChartRef.current.chartInstance || doughnutChartRef.current // Access Chart.js instance
    let x = document.getElementById('doughnutChartCurrent')
    console.log(chartInstance)
    chartImage2 = chartInstance.toBase64Image() // Generate Base64 image
  } else {
    console.error('Chart instance is not available.')
  }

  return (
    <PDFDownloadLink
      document={<MyDocument barChartImage={chartImage} doughnutChartImage={chartImage2} />}
      fileName="bar_chart_report.pdf"
      style={{
        color: '#fff',
        textDecoration: 'none',
      }}
    >
      {({ loading }) => (
        <CButton color="primary">
          {loading ? (
            '...'
          ) : (
            <CIcon
              customClassName="nav-icon"
              icon={cilPrint}
              style={{
                width: '15px',
                height: '20px',
                cursor: 'pointer',
                color: 'white',
              }}
            />
          )}
        </CButton>
      )}
    </PDFDownloadLink>
  )
}

export default DownloadPdf