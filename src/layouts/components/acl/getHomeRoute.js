/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = role => {
  if (role === 'Parent') return '/children'
  if (role === 'Admin') return '/statistics'

  return '/account/profile'
}

export default getHomeRoute
