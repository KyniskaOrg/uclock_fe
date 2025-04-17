import React, { useState } from 'react'
import { cilSwapVertical } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CSpinner,
  CCard,
  CCardBody,
  CCardHeader,
  CInputGroup,
  CFormInput,
  CButton,
  CPagination,
  CPaginationItem,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
  CCol,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'

const CustomTable = ({
  loading,
  structuredData,
  customHeader: CustomHeader,
  showFooter = true,
  showTotal = true,
}) => {
  const { setFilter, filter, data, searchableTable, columns, totalLength } = structuredData
  const [searchParam, setsearchParam] = useState('')

  const totalPages = Math.ceil(totalLength / filter.limit)

  const handlePageChange = (page) => {
    setFilter((prev) => ({ ...prev, page }))
  }

  const handleLimitChange = (limit) => {
    setFilter((prev) => ({ ...prev, limit, page: 1 }))
  }

  const handleSort = (column) => {
    const newSortOrder = filter.sortOrder === 'ASC' ? 'DESC' : 'ASC'
    setFilter({
      ...filter,
      sortBy: column.sortBy,
      sortOrder: newSortOrder,
    })
  }

  const renderPaginationItems = () => {
    const maxPageNumbersToShow = 5 // You can adjust this value
    let pages = []

    if (totalPages <= maxPageNumbersToShow) {
      // Show all pages if totalPages is small
      pages = Array.from({ length: totalPages }, (_, idx) => idx + 1)
    } else {
      const left = Math.max(2, filter.page - 1)
      const right = Math.min(totalPages - 1, filter.page + 1)

      pages = [1]

      if (left > 2) {
        pages.push('...')
      }

      for (let i = left; i <= right; i++) {
        pages.push(i)
      }

      if (right < totalPages - 1) {
        pages.push('...')
      }

      pages.push(totalPages)
    }

    return pages.map((page, idx) => (
      <CPaginationItem
        key={idx}
        active={page === filter.page}
        disabled={page === '...'}
        onClick={() => page !== '...' && handlePageChange(page)}
      >
        {page}
      </CPaginationItem>
    ))
  }

  const headerStyle = {
    padding: '8px',
    backgroundColor: 'rgba(37, 43, 54, 0.03)',
    fontWeight: 'normal',
    color: '#999',
    fontSize: '15px',
  }
  const cellStyle = { border: '1px solid #ccc', padding: '8px' }

  const renderHeader = () =>
    Object.keys(columns).map((columnKey) => {
      const column = columns[columnKey]
      return (
        <CTableHeaderCell
          key={columnKey}
          scope="col"
          style={{ ...headerStyle, width: column.width }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {column.name}
            {column.allowsorting && (
              <CIcon
                icon={cilSwapVertical}
                size="s"
                style={{ opacity: 0.5, cursor: 'pointer' }}
                onClick={() => column.allowsorting && handleSort(column)}
              />
            )}
          </div>
        </CTableHeaderCell>
      )
    })

  const renderBody = () =>
    data.map((row, i) => (
      <CTableRow key={i} className="custom-shadow-hover">
        {Object.keys(columns).map((columnKey) => {
          const column = columns[columnKey]
          return (
            <CTableDataCell style={cellStyle} key={columnKey}>
              {column.customComponent ? column.customComponent(row) : row[column.sortBy]}
            </CTableDataCell>
          )
        })}
      </CTableRow>
    ))

  return (
    <CCard className="mb-4" style={{ background: '#e4eaee', borderRadius: 0 }}>
      {CustomHeader && <CustomHeader />}
      {searchableTable && (
        <CCardHeader>
          <CInputGroup>
            <CFormInput
              placeholder="search"
              onChange={(e) => setsearchParam(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault() // Prevent form submission (if inside a form)
                  setFilter({ ...filter, searchText: searchParam })
                }
              }}
              value={searchParam}
              aria-describedby="button-addon2"
            />
            <CButton
              type="button"
              color="secondary"
              variant="outline"
              id="button-addon2"
              onClick={() => setFilter({ ...filter, searchText: searchParam })}
            >
              Search
            </CButton>
          </CInputGroup>
        </CCardHeader>
      )}
      <CCardBody style={{ padding: 0 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <CSpinner color="dark" />
          </div>
        ) : data.length ? (
          <CTable hover responsive style={{ marginBottom: 0 }}>
            <CTableHead>
              <CTableRow>{renderHeader()}</CTableRow>
            </CTableHead>
            <CTableBody>{renderBody()}</CTableBody>
          </CTable>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            No Data....
          </div>
        )}
      </CCardBody>
      {showFooter && (
        <CRow className="align-items-center mb-3 px-3">
          <CCol style={{ paddingTop: 15, display: 'flex', justifyContent: 'flex-start' }}>
            <CPagination
              aria-label="Page navigation example"
              className="justify-content-center"
              style={{ zIndex: 0 }}
            >
              <CPaginationItem
                disabled={filter.page === 1}
                onClick={() => handlePageChange(filter.page - 1)}
              >
                {'<'}
              </CPaginationItem>

              {renderPaginationItems()}

              <CPaginationItem
                disabled={filter.page === totalPages}
                onClick={() => handlePageChange(filter.page + 1)}
              >
                {'>'}
              </CPaginationItem>
            </CPagination>
          </CCol>
          {/* moved to page top */}

          {showTotal && <>Total : {structuredData.totalLength}</>}
          <CCol className="flex-row-end">
            <CDropdown>
              <CDropdownToggle color="primary">Page limit</CDropdownToggle>
              <CDropdownMenu>
                {[10, 20, 35, 50, 100, 200].map((limit) => (
                  <CDropdownItem
                    key={limit}
                    onClick={() => handleLimitChange(limit)}
                    active={limit == filter.limit}
                  >
                    {limit}
                  </CDropdownItem>
                ))}
              </CDropdownMenu>
            </CDropdown>
          </CCol>
        </CRow>
      )}
    </CCard>
  )
}

export default CustomTable
