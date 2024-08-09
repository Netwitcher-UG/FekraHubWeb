import { useRouter } from 'next/router'
import View from 'src/views/worksheets/worksheets/view'

export default function ViewContracts() {
  const router = useRouter()
  const { id } = router.query

  if (!id) {
    return <div>Loading...</div>
  }

  return <View id={id} />
}
