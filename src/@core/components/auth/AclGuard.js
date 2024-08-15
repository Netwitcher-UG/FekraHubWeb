// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
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
import getHomeRoute from 'src/layouts/components/acl/getHomeRoute'

const AclGuard = props => {
  // ** Props
  const { aclAbilities, children, guestGuard = false, authGuard = true } = props

  // ** Hooks
  const auth = useAuth()
  const router = useRouter()
  // ** Vars
  let ability
  useEffect(() => {
    if (auth.user && auth.user.role && !guestGuard && router.route === '/') {
      const homeRoute = getHomeRoute(auth.user.role)
      router.replace(homeRoute)
    }
  }, [auth.user, guestGuard, router])

  useEffect(() => {
    const getRoles = async () => {
      try {
        const rolesResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BACK_END_URL}/api/AuthorizationUsers/RolePermissions`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`
            }
          }
        )

        const rolesPermissions = rolesResponse.data
        auth.setRolesPermissions(rolesPermissions)
      } catch (rolesError) {
        console.log(rolesError)
        window.localStorage.removeItem(authConfig.storageTokenKeyName)
        window.localStorage.removeItem('userData')
        auth.setUser(null)
        auth.setToken(null)
        router.replace('/login')
        toast.error('Failed to retrieve roles and permissions. Please try again.')
      }
    }
    if (auth.user) getRoles()
  }, [])

  useEffect(() => {
    // if (router.route === '/') router.replace('/dashboards/analytics/')
    if (router.route === '/login' && window.localStorage.getItem('userData')) router.replace('/')
  }, [router])

  // User is logged in, build ability for the user based on his role
  if (auth.user && !ability && auth.rolesPermissions) {
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
    '/children/add-child': { action: 'manage', subject: 'Children' },
    '/roles': { action: 'manage', subject: 'Permission' }
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
