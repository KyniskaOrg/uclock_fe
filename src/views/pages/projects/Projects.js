import { useState, useEffect } from 'react'
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
  CForm,
  CFormCheck,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilPen } from '@coreui/icons'
import {
  createProject,
  getAllProjects,
  deleteProject,
  editProject,
} from '../../../apis/projectApis'
import { getAllClients } from '../../../apis/clientApis'
import { useToast } from '../../../components/toaster'
import EditebleCell from '../../../components/EditableField'
import DeleteModal from '../../../components/DeleteModal'

const NewProjectModal = ({ visible, setVisible, fetchProjects }) => {
  const { showToast } = useToast()
  const [projectName, setProjectName] = useState('')
  const [clientId, setClientId] = useState('')
  const [clients, setClients] = useState([])

  // Fetch clients from API
  useEffect(() => {
    if (visible) {
      const fetchClients = async () => {
        try {
          const response = await getAllClients() // Call your API to fetch clients
          setClients(response.clients) // Adjust according to your API's response format
        } catch (error) {
          showToast('Failed to fetch clients', { color: 'danger' })
        }
      }
      fetchClients()
    }
  }, [visible]) // Trigger when the modal becomes visible

  const handleCreateProject = async (event) => {
    event.preventDefault()
    try {
      const payload = {
        projectName,
        clientId: clientId || null, // Send null if no client selected
      }

      await createProject(payload)
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
      <CForm onSubmit={handleCreateProject}>
        <CModalHeader>
          <CModalTitle>Create New Project</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CFormInput
                id="projectName"
                placeholder="Project Name"
                minLength={3}
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </CCol>
            <CCol>
              <CFormSelect
                aria-label="Select Client"
                value={clientId}
                required
                onChange={(e) => setClientId(e.target.value)}
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client.client_id} value={client.client_id}>
                    {client.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" type="submit">
            Create Project
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

const EditProjectModal = ({ visible, setVisible, projectData, fetchProjects }) => {
  const { showToast } = useToast()
  const [projectName, setProjectName] = useState(projectData?.name || '')
  const [clientId, setClientId] = useState(projectData?.client_id || '')
  const [clients, setClients] = useState([])

  // Update state when projectData changes
  useEffect(() => {
    setProjectName(projectData?.name || '')
    setClientId(projectData?.client_id || '')
  }, [projectData, visible])

  useEffect(() => {
    if (visible) {
      const fetchClients = async () => {
        try {
          const response = await getAllClients()
          setClients(response.clients)
        } catch (error) {
          showToast('Failed to fetch clients', { color: 'danger' })
        }
      }
      fetchClients()
    }
  }, [visible])

  const handleEditProject = async (event) => {
    event.preventDefault()
    try {
      // only add if they changed

      await editProject({
        project_id: projectData.project_id,
        projectName,
        client_id:clientId,
      })
      showToast('Project updated successfully', { color: 'success' })
      setVisible(false)
      fetchProjects()
    } catch (error) {
      showToast('Failed to update project', { color: 'danger' })
    }
  }

  return (
    <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
      <CForm onSubmit={handleEditProject}>
        <CModalHeader>
          <CModalTitle>Edit Project</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CFormInput
                id="projectName"
                placeholder="Project Name"
                minLength={3}
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </CCol>
            <CCol>
              <CFormSelect
                aria-label="Select Client"
                value={clientId}
                required
                onChange={(e) => setClientId(e.target.value)}
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client.client_id} value={client.client_id}>
                    {client.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" type="submit">
            Save Changes
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

const Projects = () => {
  const { showToast } = useToast()
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [filter, setFilter] = useState({
    searchText: '',
    sortBy: null,
    sortOrder: null,
    page: 1,
    limit: 10,
  })
  const [selectedProjects, setSelectedProjects] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState({})
  const [showEditModal, setShowEditModal] = useState(false)

  // Editable project
  const editProjectDetail = async ({ value, data: row }) => {
    try {
      let updatedProject = {}
      if (value && row.project_id) {
        updatedProject = { projectName: value, project_id: row.project_id }
      }
      await editProject(updatedProject)
      showToast('Project name updated', { color: 'success' })
      // fetchProjects()
    } catch {
      showToast('Error updating project name', { color: 'danger' })
    }
  }

  // Multi-select handlers
  const handleSelectAllProjects = (isSelected, projects) => {
    setSelectedProjects(isSelected ? projects : [])
  }
  const handleSelectProject = (project, isSelected) => {
    setSelectedProjects((prev) =>
      isSelected ? [...prev, project] : prev.filter((p) => p.project_id !== project.project_id),
    )
  }

  // Delete handlers
  const openDeleteSelectedModal = () => {
    setShowDeleteModal(true)
    setSelectedProject({ project_ids: selectedProjects.map((item) => item.project_id) })
  }
  const openDeleteModal = (row) => {
    setShowDeleteModal(true)
    setSelectedProject(row)
  }
  const openEditModal = (row) => {
    setShowEditModal(true)
    setSelectedProject(row)
  }
  const triggerDelete = async (id) => {
    try {
      await deleteProject({ project_ids: [id] })
      showToast('Project deleted', { color: 'success' })
      setShowDeleteModal(false)
      fetchProjects()
    } catch {
      showToast('Error deleting project', { color: 'danger' })
    }
  }
  const triggerDeleteSelected = async () => {
    try {
      await deleteProject({ project_ids: selectedProjects.map((p) => p.project_id) })
      showToast('Selected projects deleted', { color: 'success' })
      setShowDeleteModal(false)
      setSelectedProjects([])
      fetchProjects()
    } catch {
      showToast('Error deleting selected projects', { color: 'danger' })
    }
  }

  // Table columns
  const structuredData = {
    columns: {
      col1: {
        name: 'Select',
        allowsorting: false,
        width: '20px',
        customComponent: (row) => (
          <CFormCheck
            id={`select-${row.project_id}`}
            style={{ cursor: 'pointer' }}
            checked={selectedProjects.some((p) => p.project_id === row.project_id)}
            onChange={(e) => handleSelectProject(row, e.target.checked)}
          />
        ),
        selectAll: (data) => (
          <CFormCheck
            id="select-all_proj"
            style={{ cursor: 'pointer' }}
            checked={selectedProjects.length === data.length && data.length > 0}
            onChange={(e) => handleSelectAllProjects(e.target.checked, data)}
          />
        ),
      },
      col2: {
        name: 'Project Name',
        sortBy: 'name',

        allowsorting: true,
        customComponent: (row) => (
          <EditebleCell
            value={row.name}
            onEnter={(val) => editProjectDetail({ value: val, data: row })}
          />
        ),
      },
      col3: {
        name: 'Client',
        sortBy: 'client_name',
        allowsorting: false,
      },
      col4: {
        name: 'Action',
        width: '15px',
        customComponent: (row) => (
          <CCol className="d-flex justify-content-end">
            <CIcon
              icon={cilPen}
              size="s"
              style={{ opacity: 0.5, cursor: 'pointer', margin: 5 }}
              onClick={() => openEditModal(row)}
            />
            <CIcon
              icon={cilTrash}
              size="s"
              style={{ opacity: 0.5, cursor: 'pointer', margin: 5 }}
              onClick={() => openDeleteModal(row)}
            />
          </CCol>
        ),
      },
    },
    setFilter: setFilter,
    filter: filter,
    searchableTable: true,
    totalLength: totalCount,
    data: data,
  }

  // Fetch projects
  const fetchProjects = async () => {
    setLoading(true)
    try {
      const response = await getAllProjects(filter)
      let data = []
      response.projects.forEach((element) => {
        data.push({
          name: element.name,
          client_name: element.Client ? element.Client.name : 'null',
          project_id: element.project_id,
          ...element,
        })
      })
      setTotalCount(response.totalProjects)
      setData(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [filter])

  return (
    <>
      <CRow className="align-items-center mb-3">
        <CCol xs={5} xl={2}>
          <h3>Projects</h3>
        </CCol>
        <DeleteModal
          visible={showDeleteModal}
          setVisible={setShowDeleteModal}
          selected={
            selectedProjects.length >= 1
              ? selectedProjects.map((item) => item.project_id)
              : [selectedProject.project_id]
          }
          showToast={showToast}
          triggerDelete={selectedProjects.length > 1 ? triggerDeleteSelected : triggerDelete}
          title={'Delete Project'}
          name={selectedProject.name || ''}
        />
        <CCol className="flex-row-end">
          <NewProjectModal
            visible={visible}
            setVisible={setVisible}
            fetchProjects={fetchProjects}
          />
          <EditProjectModal
            visible={showEditModal}
            setVisible={setShowEditModal}
            fetchProjects={fetchProjects}
            projectData={selectedProject}
          />
          <CButton color={'primary'} onClick={() => setVisible(true)}>
            Create new project
          </CButton>
          {selectedProjects.length > 0 && (
            <CButton color={'danger'} onClick={openDeleteSelectedModal} style={{ marginRight: 10 }}>
              Delete Selected
            </CButton>
          )}
        </CCol>
      </CRow>
      <CustomTable structuredData={structuredData} loading={loading} />
    </>
  )
}

export default Projects
