// ** Demo Components Imports
import Email from 'src/views/apps/email/Email'

const EmailApp = ({ folder }) => {
  return <Email folder={folder} />
}

// Use getServerSideProps to avoid build-time API calls
// This runs at request time, not build time
export const getServerSideProps = async ({ params }) => {
  return {
    props: {
      folder: params?.folder || 'inbox'
    }
  }
}

EmailApp.contentHeightFixed = true

export default EmailApp
