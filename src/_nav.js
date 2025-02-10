import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilCalendarCheck, cilBarChart, cilNotes, cilUser, cilUserPlus } from '@coreui/icons'
import { CNavItem, CNavGroup } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Timesheet',
    to: '/timesheet',
    icon: <CIcon icon={cilCalendarCheck} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Reports',

    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
    items: [
      // {
      //   component: CNavItem,
      //   name: 'Summary',
      //   to: '/reports',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Detailed',
      //   to: '/detailed',
      // },
      {
        component: CNavItem,
        name: 'Detailed Reports',
        to: '/reports',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Projects',
    to: '/projects',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Teams',
    to: '/teams',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Clients',
    to: '/Clients',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
]

export default _nav
