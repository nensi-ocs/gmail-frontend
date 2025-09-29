import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { Stack } from '@mui/system'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import API from 'src/utils/api'

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  padding: theme.spacing(2),
  margin: theme.spacing(3, 0)
}))

const EmailField = styled('div')(({ theme }) => ({
  backgroundColor: 'rgb(245, 245, 245)',
  borderRadius: '5px',
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  minWidth: '150px',
  display: 'inline-block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}))

const Home = () => {
  const { setIsLoading, setUser, user } = useContext(AuthContext)
  const router = useRouter()

  const handleWebDash = async () => {
    await router.push('/dash')
  }

  const handleUpgrade = async () => {
    await router.push('/pricing')
  }

  const handleLogout = async () => {
    setIsLoading(true)
    setUser(null)
    await API.logout()
    await router.push('/login')
    setIsLoading(false)
  }

  const handleChangePassword = async () => {
    await router.push('/change-password')
  }

  return (
    <Grid container spacing={4} justifyContent='center' alignItems='center' sx={{ padding: 2 }}>
      <Grid item xs={12} md={7}>
        <StyledCard>
          <CardHeader title='Quick Start Guide' />
          <CardContent>
            <Typography variant='h6'>Browser Extension</Typography>
            <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 2 }}>
              <div>
                <Typography variant='body2'>Run instantly on any site</Typography>
              </div>
              <Button variant='outlined' color='primary' sx={{ padding: '7px 10px' }}>
                <a href='https://omeeai.com/' target='_blank' style={{ textDecoration: 'none', color: '#0574B0' }}>
                  How to use
                </a>
              </Button>
            </Stack>
            <Typography variant='h6'>Web App</Typography>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <div>
                <Typography variant='body2'>Accessible on all devices</Typography>
              </div>
              <Button variant='outlined' color='primary' sx={{ padding: '7px 10px' }} onClick={handleWebDash}>
                Web App
              </Button>
            </Stack>
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item xs={12} md={7}>
        <StyledCard>
          <CardHeader title='Subscription Plan' />
          <CardContent>
            <Button
              style={{
                backgroundColor: 'rgb(223, 223, 223)',
                color: 'rgb(64, 64, 64)',
                borderRadius: '5px',
                width: '100px'
              }}
              sx={{ mb: 5 }}
            >
              Free
            </Button>
            <Stack
              display='flex'
              textAlign='center'
              direction='row'
              justifyContent='space-between'
              alignItems='center'
              sx={{ mb: 4 }}
            >
              <Typography variant='body2'>Upgrade for an enhanced your writing experience</Typography>
              <Button variant='contained' color='primary' sx={{ padding: '7px 10px' }} onClick={handleUpgrade}>
                Upgrade
              </Button>
            </Stack>
            <div style={{ backgroundColor: 'rgb(245 245 245)', padding: '10px', borderRadius: '5px' }}>
              <Stack
                direction='row'
                justifyContent='space-between'
                style={{ margin: '0px 20px', marginRight: '90px' }}
                alignItems='center'
                spacing={2}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <svg width='15px' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <g id='check-circle'>
                        <path
                          id='Vector'
                          d='M7.5 10L9.16667 11.6667L12.5 8.33333M17.5 10C17.5 10.9849 17.306 11.9602 16.9291 12.8701C16.5522 13.7801 15.9997 14.6069 15.3033 15.3033C14.6069 15.9997 13.7801 16.5522 12.8701 16.9291C11.9602 17.306 10.9849 17.5 10 17.5C9.01509 17.5 8.03982 17.306 7.12987 16.9291C6.21993 16.5522 5.39314 15.9997 4.6967 15.3033C4.00026 14.6069 3.44781 13.7801 3.0709 12.8701C2.69399 11.9602 2.5 10.9849 2.5 10C2.5 8.01088 3.29018 6.10322 4.6967 4.6967C6.10322 3.29018 8.01088 2.5 10 2.5C11.9891 2.5 13.8968 3.29018 15.3033 4.6967C16.7098 6.10322 17.5 8.01088 17.5 10Z'
                          stroke='#0574B0'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        ></path>
                      </g>
                    </svg>
                    <Typography variant='body2' sx={{ ml: 1 }}>
                      Powered by{' '}
                      <span
                        style={{
                          color: '#0574b0',
                          backgroundColor: '#d5ecf8',
                          padding: '3px 5px',
                          borderRadius: '5px'
                        }}
                      >
                        GPT3.5 Turbo AI
                      </span>
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <svg
                      width='15px'
                      className='h-4 w-4'
                      viewBox='0 0 20 20'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <g id='check-circle'>
                        <path
                          id='Vector'
                          d='M7.5 10L9.16667 11.6667L12.5 8.33333M17.5 10C17.5 10.9849 17.306 11.9602 16.9291 12.8701C16.5522 13.7801 15.9997 14.6069 15.3033 15.3033C14.6069 15.9997 13.7801 16.5522 12.8701 16.9291C11.9602 17.306 10.9849 17.5 10 17.5C9.01509 17.5 8.03982 17.306 7.12987 16.9291C6.21993 16.5522 5.39314 15.9997 4.6967 15.3033C4.00026 14.6069 3.44781 13.7801 3.0709 12.8701C2.69399 11.9602 2.5 10.9849 2.5 10C2.5 8.01088 3.29018 6.10322 4.6967 4.6967C6.10322 3.29018 8.01088 2.5 10 2.5C11.9891 2.5 13.8968 3.29018 15.3033 4.6967C16.7098 6.10322 17.5 8.01088 17.5 10Z'
                          stroke='#0574B0'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        ></path>
                      </g>
                    </svg>
                    <Typography variant='body2' sx={{ ml: 1 }}>
                      Faster and Better Responses
                    </Typography>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <svg width='15px' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <g id='check-circle'>
                        <path
                          id='Vector'
                          d='M7.5 10L9.16667 11.6667L12.5 8.33333M17.5 10C17.5 10.9849 17.306 11.9602 16.9291 12.8701C16.5522 13.7801 15.9997 14.6069 15.3033 15.3033C14.6069 15.9997 13.7801 16.5522 12.8701 16.9291C11.9602 17.306 10.9849 17.5 10 17.5C9.01509 17.5 8.03982 17.306 7.12987 16.9291C6.21993 16.5522 5.39314 15.9997 4.6967 15.3033C4.00026 14.6069 3.44781 13.7801 3.0709 12.8701C2.69399 11.9602 2.5 10.9849 2.5 10C2.5 8.01088 3.29018 6.10322 4.6967 4.6967C6.10322 3.29018 8.01088 2.5 10 2.5C11.9891 2.5 13.8968 3.29018 15.3033 4.6967C16.7098 6.10322 17.5 8.01088 17.5 10Z'
                          stroke='#0574B0'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        ></path>
                      </g>
                    </svg>
                    <Typography variant='body2' sx={{ ml: 1 }}>
                      Web App
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <svg
                      width='15px'
                      className='h-4 w-4'
                      viewBox='0 0 20 20'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <g id='check-circle'>
                        <path
                          id='Vector'
                          d='M7.5 10L9.16667 11.6667L12.5 8.33333M17.5 10C17.5 10.9849 17.306 11.9602 16.9291 12.8701C16.5522 13.7801 15.9997 14.6069 15.3033 15.3033C14.6069 15.9997 13.7801 16.5522 12.8701 16.9291C11.9602 17.306 10.9849 17.5 10 17.5C9.01509 17.5 8.03982 17.306 7.12987 16.9291C6.21993 16.5522 5.39314 15.9997 4.6967 15.3033C4.00026 14.6069 3.44781 13.7801 3.0709 12.8701C2.69399 11.9602 2.5 10.9849 2.5 10C2.5 8.01088 3.29018 6.10322 4.6967 4.6967C6.10322 3.29018 8.01088 2.5 10 2.5C11.9891 2.5 13.8968 3.29018 15.3033 4.6967C16.7098 6.10322 17.5 8.01088 17.5 10Z'
                          stroke='#0574B0'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        ></path>
                      </g>
                    </svg>
                    <Typography variant='body2' sx={{ ml: 1 }}>
                      Better Privacy
                    </Typography>
                  </div>
                </div>
              </Stack>
            </div>
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item xs={12} md={7}>
        <StyledCard>
          <CardHeader title='Account Details' />
          <CardContent>
            <Stack display='flex' direction='row' alignItems='center' spacing={2} sx={{ mb: 4 }}>
              <Typography variant='body2' style={{ color: 'rgb(64, 64, 64)' }}>
                Email:
              </Typography>
              <EmailField>{user?.email}</EmailField>
            </Stack>
            <Stack direction='row' spacing={2}>
              <Button variant='outlined' color='primary' sx={{ padding: '7px 10px' }} onClick={handleChangePassword}>
                Change Password
              </Button>
              <Button variant='outlined' color='secondary' sx={{ padding: '7px 10px' }} onClick={handleLogout}>
                Logout
              </Button>
            </Stack>
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item xs={12} md={7}>
        <Typography variant='body2' align='center' sx={{ mt: 3 }}>
          For any queries, reach out to us at{' '}
          <a href='mailto:support@omeeai.com' style={{ color: '#0574B0' }}>
            support@omeeai.com
          </a>
        </Typography>
      </Grid>
    </Grid>
  )
}

export default Home
