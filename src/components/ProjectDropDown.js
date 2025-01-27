import { useState } from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import { getAllProjects } from '../apis/projectApis'

const ProjectDropdown = ({ value, setValue, customStyles,placeholder }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const loadOptions = async (search, prevOptions) => {
    if (isLoading) {
      return {
        options: prevOptions,
        hasMore: false,
      }
    }
    setIsLoading(true)
    try {
      let query = search ? { searchText: search } : { page: currentPage, limit: 50 }
      const data = await getAllProjects(query)

      const projects = data.projects.map((project) => ({
        value: project.project_id,
        label: project.name,
      }))
      // Filter out options already selected
      //.filter((sel) => !rowData.some((project) => project.selectedProject === sel.value))

      const hasMore = currentPage < data.totalPages
      if (hasMore) {
        setCurrentPage(currentPage + 1)
      }

      setIsLoading(false)
      return {
        options: projects,
        hasMore,
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error loading projects:', error)
      return {
        options: [],
        hasMore: false,
      }
    }
  }

  const styleProps = customStyles
    ? customStyles
    : {
        control: (provided) => ({
          ...provided,
          width: 200,
          height: 40,
        }),
        menuList: (provided) => ({
          ...provided,
          maxHeight: 200,
          overflowY: 'auto',
          scrollbarWidth: 'thin',
        }),
      }

  return (
    <AsyncPaginate
      styles={styleProps}
      options={[]} // Initial empty options list
      value={value.value ? value : null}
      loadOptions={loadOptions}
      onChange={(selectedOption) => setValue(selectedOption)}
      isLoading={isLoading}
      debounceTimeout={500}
      menuPortalTarget={document.body} // To display over table
      placeholder={placeholder?placeholder:"Search..."}
      additional={{
        page: currentPage,
      }}
    />
  )
}

export default ProjectDropdown
