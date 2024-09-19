/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = role => {
  if (role === 'Parent') return '/children'
  else return '/account/profile'
}

export default getHomeRoute
