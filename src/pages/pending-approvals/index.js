import ChildrenList from 'src/views/children/list/children-list'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPendingApprovals } from 'src/store/apps/students'

const ViewChild = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPendingApprovals())
  }, [dispatch])

  const { pendingApprovals, pendingApprovalsLoading } = useSelector(state => state.students)

  return <ChildrenList isPendingChild={true} childrenData={pendingApprovals} loading={pendingApprovalsLoading} />
}

export default ViewChild
