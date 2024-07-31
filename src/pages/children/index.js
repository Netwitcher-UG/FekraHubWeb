import ChildrenList from 'src/views/children/list/children-list'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchParentStudents } from 'src/store/apps/students'

const ViewChild = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchParentStudents())
  }, [dispatch])
  const { parentStudents, childrenLoading } = useSelector(state => state.students)
  return <ChildrenList children={parentStudents} loading={childrenLoading} />
}

export default ViewChild
