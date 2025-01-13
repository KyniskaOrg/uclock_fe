import React, { useState, useEffect } from 'react'
import CustomTable from '../../../components/table/table'
import {
  CButton,
  CCol,
  CRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormSelect,
  CFormInput,
} from '@coreui/react'
import { createProject, getAllProjects } from '../../../apis/projectApis'
import { useToast } from '../../../components/toaster'

const NewProjectModal = ({ visible, setVisible, fetchProjects }) => {
  const { showToast } = useToast()
  const [projectName, setProjectName] = useState('')
  const [clientId, setClientId] = useState('')

  const handleCreateProject = async () => {
    try {
      const payload = {
        projectName,
        clientId: clientId || null, // Send null if no client selected
      }

      await createProject(payload) // Call API
      showToast('Project created successfully', { color: 'success' })
      setVisible(false)
      setClientId('')
      setProjectName('')
      fetchProjects()
    } catch (error) {
      showToast('Failed to create project', { color: 'danger' })
    }
  }

  return (
    <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>Create New Project</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol>
            <CFormInput
              id="projectName"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </CCol>
          <CCol>
            <CFormSelect
              aria-label="Select Client"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            >
              <option value="">Select Client</option>
              <option value="1">Client One</option>
              <option value="2">Client Two</option>
              <option value="3">Client Three</option>
            </CFormSelect>
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Close
        </CButton>
        <CButton color="primary" onClick={handleCreateProject}>
          Create Project
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

const Projects = () => {
  const [visible, setVisible] = useState(false) // For modal visibility
  const [data, setData] = useState([]) // Storing the structured data for columns
  const [loading, setLoading] = useState(false) // To track if data is being fetched
  const [totalCount, setTotalCount] = useState(0) // To track if data is being fetched
  const [filter, setFilter] = useState({
    searchText: '', // Filter by project name
    sortBy: 'name', // Sort by name (default)
    sortOrder: 'ASC', // Sort order (ASC or DESC)
    page: 1, // Current page for pagination
    limit: 10, // Current limit for pagination
  })

  // Function to fetch all projects with applied filters
  const structuredData = {
    columns: {
      col1: {
        name: 'Project Name', // Column name
        sortBy: 'name', // Default sort by name
        allowsorting: true, // Sorting allowed
      },
      col2: {
        name: 'Client Name', // Column name
        sortBy: 'client_name', // Default sort by client name
        allowsorting: false,
      },
    },
    setFilter: setFilter,
    filter: filter,
    searchableTable: true,
    totalLength:totalCount,
    data: data,
  }
  const fetchProjects = async () => {
    setLoading(true)
    try {
      const response = await getAllProjects(filter)
      let data = []
      response.projects.forEach((element) => {
        data.push({
          name: element.name, // Corresponds to col1
          client_name: element.Client ? element.Client : 'null', // Corresponds to col2
        })
      })
      setTotalCount(response.totalProjects)
      // Add more columns as needed
      setData(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  // Trigger the initial fetch when the component mounts or when the filter changes
  useEffect(() => {
    fetchProjects()
  }, [filter]) // Re-fetch when the filter changes

  return (
    <>
      <CRow className="align-items-center mb-3">
        <CCol xs={5} xl={2}>
          <h3>Projects</h3>
        </CCol>
        <CCol className="flex-row-end">
          <NewProjectModal
            visible={visible}
            setVisible={setVisible}
            fetchProjects={fetchProjects}
          />
          <CButton color={'primary'} onClick={() => setVisible(true)}>
            Create new project
          </CButton>
        </CCol>
      </CRow>
      <CustomTable structuredData={structuredData} loading={loading} />
    </>
  )
}

export default Projects
