// ** React Imports
import { useContext } from 'react'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { useAuth } from 'src/hooks/useAuth'

const CanViewNavGroup = props => {
  // ** Props
  const { children, navGroup } = props

  // ** Hooks
  const ability = useContext(AbilityContext)
  const auth = useAuth()

  const checkForVisibleChild = arr => {
    return arr.some(i => {
      if (i.children) {
        return checkForVisibleChild(i.children)
      } else {
        return ability?.can(i.action, i.subject)
      }
    })
  }

  const canViewMenuGroup = item => {
    const hasAnyVisibleChild = item.children && checkForVisibleChild(item.children)
    if (!(item.action && item.subject)) {
      return hasAnyVisibleChild
    }

    return ability && ability.can(item.action, item.subject) && hasAnyVisibleChild
  }

  // const canViewMenuGroup = item => {
  //   return ability && ability.can(item.action, item.subject)
  // }

  // if (navGroup && (!navGroup.subject || !navGroup.action)) {
  //   return <>{children}</>
  // } else {
  //   return navGroup && canViewMenuGroup(navGroup) ? <>{children}</> : null
  // }

  // Hide Payroll item for Parent role
  if (navGroup && navGroup.title === 'Payroll' && auth.user?.role === 'Parent') {
    return null
  }

  if (navGroup && navGroup.auth === false) {
    return <>{children}</>
  } else {
    return navGroup && canViewMenuGroup(navGroup) ? <>{children}</> : null
  }
}

export default CanViewNavGroup
