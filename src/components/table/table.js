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

const CustomTable = ({ loading, structuredData }) => {
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
        <CTableHeaderCell key={columnKey} scope="col" style={headerStyle}>
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
              {row[column.sortBy]}
            </CTableDataCell>
          )
        })}
      </CTableRow>
    ))

  return (
    <CCard className="mb-4" style={{ background: '#e4eaee', borderRadius: 0 }}>
      {searchableTable && (
        <CCardHeader>
          <CInputGroup>
            <CFormInput
              placeholder="search"
              onChange={(e) => setsearchParam(e.target.value)}
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
          <CTable hover responsive >
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
      <CRow className="align-items-center mb-3 px-3">
        <CCol style={{ paddingTop: 15, display: 'flex', justifyContent: 'flex-start' }}>
          <CPagination aria-label="Page navigation example" className="justify-content-center">
            <CPaginationItem
              disabled={filter.page === 1}
              onClick={() => handlePageChange(filter.page - 1)}
            >
              Previous
            </CPaginationItem>
            {Array.from({ length: totalPages }, (_, idx) => (
              <CPaginationItem
                key={idx + 1}
                active={filter.page === idx + 1}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              disabled={filter.page === totalPages}
              onClick={() => handlePageChange(filter.page + 1)}
            >
              Next
            </CPaginationItem>
          </CPagination>
        </CCol>
        <CCol className="flex-row-end">
          <CDropdown>
            <CDropdownToggle color="primary">Page limit</CDropdownToggle>
            <CDropdownMenu>
              {[10, 20, 50].map((limit) => (
                <CDropdownItem key={limit} onClick={() => handleLimitChange(limit)}>
                  {limit}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        </CCol>
      </CRow>
    </CCard>
  )
}

export default CustomTable
