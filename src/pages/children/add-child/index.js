import AddChildWizard from 'src/views/children/add/add-child-wizard'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAvailableCourses } from 'src/store/apps/students'

const AddChild = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAvailableCourses())
  }, [dispatch])

  const { availableCourses } = useSelector(state => state.students)

  return <AddChildWizard courses={availableCourses} />
}

export default AddChild
