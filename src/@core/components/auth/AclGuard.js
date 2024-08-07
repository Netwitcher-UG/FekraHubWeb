// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Config Import
// import { buildAbilityFor } from 'src/configs/acl'
import defineAbilitiesFor from 'src/configs/acl'
// ** Component Import
import NotAuthorized from 'src/pages/401'
import Spinner from 'src/@core/components/spinner'
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Util Import
// import getHomeRoute from 'src/layouts/components/acl/getHomeRoute'

const AclGuard = props => {
  // ** Props
  const { aclAbilities, children, guestGuard = false, authGuard = true } = props

  // ** Hooks
  const auth = useAuth()
  const router = useRouter()
  // ** Vars
  let ability
  // useEffect(() => {
  //   if (auth.user && auth.user.role && !guestGuard && router.route === '/') {
  //     const homeRoute = getHomeRoute(auth.user.role)
  //     router.replace(homeRoute)
  //   }
  // }, [auth.user, guestGuard, router])

  useEffect(() => {
    if (router.route === '/') router.replace('/dashboards/analytics/')
    if (router.route === '/login' && window.localStorage.getItem('userData')) router.replace('/')
  }, [router])

  // User is logged in, build ability for the user based on his role
  if (auth.user && !ability) {
    ability = defineAbilitiesFor(auth.user.role, auth.rolesPermissions)
    if (router.route === '/') {
      return <Spinner />
    }
  }

  // If guest guard or no guard is true or any error page
  if (guestGuard || router.route === '/404' || router.route === '/500' || !authGuard) {
    // If user is logged in and his ability is built
    if (auth.user && ability) {
      return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    } else {
      // If user is not logged in (render pages like login, register etc..)
      return <>{children}</>
    }
  }

  // Check the access of current user and render pages
  if (auth.user) {
    if (router.route === '/') {
      return <Spinner />
    }

    // return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }
  // return <>{children}</>

  const routePermissions = {
    '/users/employees/add-employee': { action: 'create', subject: 'User' },
    '/users/parents/add-parent': { action: 'create', subject: 'User' },
    '/students': { action: 'read', subject: 'StudentCourse' },
    '/courses': { action: 'read', subject: 'Course' },
    '/location': { action: 'manage', subject: 'Location' },
    '/reports': { action: 'read', subject: 'StudentReport' },
    '/room': { action: 'manage', subject: 'Room' },
    '/users/employees': { action: 'read', subject: 'Employee' },
    '/users/parents': { action: 'read', subject: 'Parent' },
    '/children': { action: 'manage', subject: 'Children' },
    '/children/add-child': { action: 'manage', subject: 'Children' }
  }

  if (ability && auth.user) {
    if (router.route === '/') {
      return <Spinner />
    }
    const routePermission = routePermissions[router.route]
    if (routePermission && ability.cannot(routePermission.action, routePermission.subject)) {
      return (
        <BlankLayout>
          <NotAuthorized />
        </BlankLayout>
      )
    }
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }
  // Render Not Authorized component if the current user has limited access
}

export default AclGuard
