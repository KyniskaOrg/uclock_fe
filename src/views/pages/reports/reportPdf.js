import React, { useEffect, useState } from 'react'
import { PDFDownloadLink, Document, Page, Image, Text, StyleSheet, View } from '@react-pdf/renderer'
import { CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPrint } from '@coreui/icons'
import * as htmlToImage from 'html-to-image'
import logo from '../../../assets/images/logo.png'

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  chartImage: {
    width: '100%',
    height: 'auto',
  },
  logo: {
    width: 'auto',
    height: '75px',
  },
})

// Define the PDF document
const MyDocument = ({ barChartImage, doughnutChartImage }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.title}>Summary report</Text>
        <Image src={logo} style={styles.logo} />
      </View>
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
