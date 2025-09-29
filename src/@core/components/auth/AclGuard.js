import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { useAuth } from 'src/hooks/useAuth'
import { AuthContext } from 'src/context/AuthContext'

const AclGuard = props => {
  const { children } = props
  const { user, setUser, isLoading, setIsLoading } = useContext(AuthContext)
  const auth = useAuth()
  const router = useRouter()
  let ability

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      try {
        if (user) {
          if (router.route === '/login' || router.route === '/register') {
            await router.replace('/home')
          }
        } else {
          if (router.route !== '/login' && router.route !== '/register') {
            await router.push('/login')
          }
        }
      } finally {
        setIsLoading(false)
      }
    })()
  }, [user, router])

  return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}

export default AclGuard
