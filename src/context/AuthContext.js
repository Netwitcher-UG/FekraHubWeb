// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

import toast from 'react-hot-toast'
import jwt from 'jsonwebtoken'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  token: null,
  rolesPermissions: null,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  forget: () => Promise.resolve(),
  confirmUser: () => Promise.resolve(),
  resendEmail: () => Promise.resolve(),
  resetPassword: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [token, setToken] = useState(defaultProvider.token)
  const [rolesPermissions, setRolesPermissions] = useState(defaultProvider.rolesPermissions)
  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      const storedRolesPermissions = JSON.parse(window.localStorage.getItem('rolesPermissions'))
      if (storedToken) {
        setLoading(true)
        await axios
          .post(`${process.env.NEXT_PUBLIC_BACK_END_URL}/api/Account/ValidateToken`, null, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          })
          .then(async response => {
            const decoded = jwt.decode(storedToken)
            setLoading(false)
            setUser({ ...decoded })
            setRolesPermissions(storedRolesPermissions)
          })
          .catch(error => {
            console.log(error)
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (!router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => {
  //   const initAuth = async () => {
  //     const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
  //     const storedUser = JSON.parse(window.localStorage.getItem('userData'))
  //     if (storedToken && storedUser) {
  //       setUser(storedUser)
  //       setToken(storedToken)
  //       setLoading(false)
  //     } else {
  //       setLoading(false)
  //     }
  //   }
  //   initAuth()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  // const handleLogin = (params, errorCallback) => {
  //   axios.post(authConfig.loginEndpoint, params).then(async response => {
  //     params.rememberMe ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken) : null
  //     const returnUrl = router.query.returnUrl
  //     setUser({ ...response.data.userData })
  //     params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null
  //     const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
  //     router.replace(redirectURL)
  //   })
  //   // .catch(err => {
  //   //   if (errorCallback) errorCallback(err)
  //   // })
  // }

  // Roles Mods

  // const handleLogin = async params => {
  //   try {
  //     const formData = new FormData()
  //     formData.append('email', params.email)
  //     formData.append('password', params.password)

  //     const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_END_URL}/api/Account/LogIn`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     })

  //     if (response?.status == 200) {
  //       window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.token)
  //       const decoded = jwt.decode(response.data.token)
  //       window.localStorage.setItem('userData', JSON.stringify(decoded))
  //       setUser({ ...decoded })
  //       setToken(response.data.token)
  //       const rolesResponse = await axios.get(
  //         `${process.env.NEXT_PUBLIC_BACK_END_URL}/api/AuthorizationUsers/RolePermissions`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`
  //           }
  //         }
  //       )
  //       const rolesPermissions = rolesResponse.data

  //       localStorage.setItem('rolesPermissions', JSON.stringify(rolesPermissions))
  //       router.replace('/')
  //     }
  //   } catch (error) {
  //     if (error?.response?.status == 400 || error?.response?.status == 401)
  //       toast.error('Email or Password are incorrect !')
  //   }
  // }

  const handleLogin = async params => {
    try {
      const formData = new FormData()
      formData.append('email', params.email)
      formData.append('password', params.password)

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_END_URL}/api/Account/LogIn`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response?.status == 200) {
        const accToken = response.data.token
        window.localStorage.setItem(authConfig.storageTokenKeyName, accToken)
        const decoded = jwt.decode(accToken)
        window.localStorage.setItem('userData', JSON.stringify(decoded))
        setUser({ ...decoded })
        setToken(accToken)

        try {
          const rolesResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_BACK_END_URL}/api/AuthorizationUsers/RolePermissions`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )

          const rolesPermissions = rolesResponse.data
          localStorage.setItem('rolesPermissions', JSON.stringify(rolesPermissions))
          setRolesPermissions(rolesPermissions)
          router.replace('/')
        } catch (rolesError) {
          // Clear the local storage and redirect to home page if the second request fails
          window.localStorage.removeItem(authConfig.storageTokenKeyName)
          window.localStorage.removeItem('userData')
          window.localStorage.removeItem('rolesPermissions')
          setUser(null)
          setToken(null)
          toast.error('Failed to retrieve roles and permissions. Please try again.')
          // router.replace('/')
        }
      }
    } catch (error) {
      if (error?.response?.status == 400 || error?.response?.status == 401) {
        toast.error('Email or Password are incorrect!')
      }
    }
  }

  const handleRegister = async formData => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_URL}/api/Account/RegisterParent`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      return response
    } catch (error) {
      return error.response
    }
  }

  const handleResendConfirmEmail = async email => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_URL}/api/Account/ResendConfirmEmail?email=${email}`,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      return response
    } catch (error) {
      return error.response
    }
  }

  const handlePasswordForget = async email => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_URL}/api/Account/ForgotPassword?email=${email}`,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      return response.status
    } catch (error) {
      return error
    }
  }

  const handleConfirmUser = async params => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END_URL}/api/Account/ConfirmUser?Token=${params.Token}&ID=${params.ID}`,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      return response
    } catch (error) {
      console.error('Error:', error)
      return error.response
    }
  }

  const handleResetPassword = async params => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_END_URL}/api/Account/ResetPassword`, params, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      return response
    } catch (error) {
      console.error('Error:', error)
      return error.response
    }
  }

  const handleLogout = () => {
    setUser(null)
    setToken(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.removeItem('rolesPermissions')
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    token,
    rolesPermissions,
    setLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    forget: handlePasswordForget,
    confirmUser: handleConfirmUser,
    resendEmail: handleResendConfirmEmail,
    resetPassword: handleResetPassword
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
