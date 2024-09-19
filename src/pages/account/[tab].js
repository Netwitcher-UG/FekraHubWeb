// ** Third Party Imports
import { useEffect } from 'react'

// ** Demo Components Imports
import UserProfile from 'src/views/user-profile/UserProfile'
import { fetchUserProfileInfo } from 'src/store/apps/account'
import { useDispatch, useSelector } from 'react-redux'

const UserProfileTab = ({ tab, data }) => {
  const dispatch = useDispatch()
  const { userProfileInfo, userProfileLoading } = useSelector(state => state.account)
  useEffect(() => {
    dispatch(fetchUserProfileInfo())
  }, [])

  return <UserProfile tab={tab} data={userProfileInfo} isLoading={userProfileLoading} />
}

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'profile' } },
      { params: { tab: 'courses' } },
      { params: { tab: 'projects' } },
      { params: { tab: 'connections' } }
    ],
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      tab: params?.tab
    }
  }
}

export default UserProfileTab
