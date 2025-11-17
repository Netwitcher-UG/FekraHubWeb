const navigation = () => {
  return [
    {
      title: 'Manage Users',
      icon: 'la:users-cog',
      children: [
        {
          title: 'Parents',
          path: '/users/parents',
          subject: 'Parent',
          action: 'read'
        },
        {
          title: 'Employees',
          path: '/users/employees',
          subject: 'Employee',
          action: 'read'
        }
      ]
    },
    {
      title: 'Roles',
      icon: 'tabler:shield',
      path: '/roles',
      action: 'manage',
      subject: 'Permission'
    },
    {
      title: 'Students',
      icon: 'ph:student',
      children: [
        {
          title: 'Available Students',
          path: '/students',
          subject: 'StudentCourse',
          action: 'read'
        },
        {
          title: 'Pending Approvals',
          path: '/approvals',
          subject: 'StudentAdmissions',
          action: 'manage'
        }
      ]
    },
    {
      title: 'Courses',
      icon: 'fluent-mdl2:publish-course',
      path: '/courses',
      action: 'read',
      subject: 'Course'
    },
    {
      title: 'Locations',
      icon: 'ep:map-location',
      path: '/location',
      action: 'manage',
      subject: 'Location'
    },
    {
      icon: 'carbon:report',
      title: 'Reports',
      path: '/reports',
      action: 'read',
      subject: 'StudentReport'
    },
    {
      title: 'Rooms',
      icon: 'fluent:conference-room-24-regular',
      path: '/room',
      action: 'manage',
      subject: 'Room'
    },
    {
      title: 'Calendar',
      icon: 'tabler:calendar',
      path: '/apps/calendar',
      action: 'read',
      subject: 'Event'
    },
    {
      title: 'Payroll',
      icon: 'tabler:report-money',
      path: '/payroll',
      action: 'manage',
      subject: 'payroll'
    },
    {
      title: 'Messages',
      icon: 'tabler:mail',
      path: '/apps/email',
      action: 'manage',
      subject: 'messages'
    },
    {
      title: 'Children',
      icon: 'tabler:users',
      children: [
        {
          title: 'Registered Children',
          path: '/children',
          action: 'manage',
          subject: 'Children'
        },
        {
          title: 'Pending Approvals',
          path: '/pending-approvals',
          action: 'manage',
          subject: 'Children'
        },
        {
          title: 'Add Child',
          path: '/children/add-child',
          action: 'manage',
          subject: 'Children'
        }
      ]
    },
    {
      title: 'Course files',
      icon: 'ph:files',
      path: '/worksheets',
      action: 'manage',
      subject: 'File'
    },
    {
      title: 'Attendance',
      icon: 'basil:user-clock-solid',
      children: [
        {
          title: 'Students Attendance',
          path: '/students-attendance',
          action: 'read',
          subject: 'StudentAttendance'
        },
        {
          title: 'Teachers Attendance',
          path: '/teachers-attendance',
          action: 'read',
          subject: 'TeacherAttendance'
        }
      ]
    },
    {
      title: 'Settings',
      icon: 'ph:gear',
      path: '/settings',
      action: 'manage',
      subject: 'SchoolInfo'
    }
  ]
}

export default navigation
