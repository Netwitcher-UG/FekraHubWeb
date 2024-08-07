// ** React Imports
import { useEffect, useState } from 'react'

import FallbackSpinner from 'src/@core/components/spinner'

// ** Third Party Imports

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import EmailVerified from 'src/@core/components/email-verification/email-verified'
import EmailNotVerified from 'src/@core/components/email-verification/email-not-verified'
// ** Configs

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

const ConfirmPage = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()
  const { Token } = router.query
  const { ID } = router.query
  const [emailStatus, setEmailStatus] = useState('loading')
  useEffect(() => {
    if (!Token || !ID) return
    const confirmUser = async () => {
      const response = await auth.confirmUser({ Token, ID })

      if (response?.status == 200) setEmailStatus('verified')
      else if (response?.status != 200) setEmailStatus('notVerified')
    }

    confirmUser()
  }, [Token, ID])

  return (
    <>
      {emailStatus == 'loading' ? (
        <FallbackSpinner />
      ) : emailStatus == 'verified' ? (
        <EmailVerified />
      ) : (
        <EmailNotVerified />
      )}
    </>
  )
}
ConfirmPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
ConfirmPage.guestGuard = true

export default ConfirmPage
