import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer } from '@mui/material'
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
    border: '1px solid #ccc',
    borderTop: 'none',
    padding: '8px',
    backgroundColor: 'rgb(37, 43, 54, 0.03)',
  }
  const cellStyle = { border: '1px solid #ccc', padding: '8px' }

  const renderHeader = () =>
    Object.keys(columns).map((columnKey) => {
      const column = columns[columnKey]
      return (
        <TableCell key={columnKey} sx={{ ...headerStyle, fontWeight: 'bold' }}>
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
        </TableCell>
      )
    })

  const renderBody = () =>
    data.map((row, i) => (
      <TableRow
        key={i}
        sx={{
          '&:hover': { backgroundColor: '#d9d9d9' },
        }}
      >
        {Object.keys(columns).map((columnKey) => {
          const column = columns[columnKey]
          return (
            <TableCell sx={cellStyle} key={columnKey}>
              {row[column.sortBy]}
            </TableCell>
          )
        })}
      </TableRow>
    ))

  return (
    <CCard className="mb-4" style={{ border: 'none' }}>
      {searchableTable && (
        <CCardHeader style={{ border: '1px rgba(8, 10, 12, 0.175) solid' }}>
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
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>{renderHeader()}</TableRow>
              </TableHead>
              <TableBody>{renderBody()}</TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            No Data....
          </div>
        )}
      </CCardBody>
        <CRow className="align-items-center mb-3 px-3">
          <CCol  style={{paddingTop:15,display:"flex", justifyContent:'flex-start'}}>
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
