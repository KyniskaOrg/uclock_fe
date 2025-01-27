import React, { useEffect, useState } from 'react'
import { PDFDownloadLink, Document, Page, Image, Text, StyleSheet } from '@react-pdf/renderer'
import { CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPrint } from '@coreui/icons'
import * as htmlToImage from 'html-to-image'

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
      <Text style={styles.title}>Report</Text>
      {barChartImage && <Image src={barChartImage} style={styles.chartImage} />}
      {doughnutChartImage && <Image src={doughnutChartImage} style={styles.chartImage} />}
    </Page>
  </Document>
)

// Main component to render the download link
const DownloadPdf = ({ isChartUpdated }) => {
  const [barChartImage, setBarChartImage] = useState(null) // State for Bar Chart image
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Generate the bar chart image using html-to-image
    const barChart = document.getElementById('barChartCurrent') // Ensure this ID is set on your bar chart
    if (isChartUpdated && barChart) {
      console.log("xx__________________XXX_____________________ZZ")
      htmlToImage
        .toPng(barChart)
        .then((dataUrl) => {
          setBarChartImage(dataUrl) // Store the base64 image in state
          setIsReady(true) // Mark the PDF as ready for download
        })
        .catch((error) => {
          console.error('Error generating bar chart image:', error)
        })
    }
  }, [isChartUpdated])

  return (
    <PDFDownloadLink
      document={<MyDocument barChartImage={barChartImage} />}
      fileName="report.pdf"
      style={{
        color: '#fff',
        textDecoration: 'none',
      }}
    >
      {({ loading }) => (
        <CButton color="primary" disabled={!isReady}>
          {loading ? (
            'Preparing...'
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
