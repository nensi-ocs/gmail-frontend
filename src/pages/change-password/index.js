import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import Box from '@mui/material/Box'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import CustomTextField from 'src/@core/components/mui/text-field'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import API from 'src/utils/api'
import toast from 'react-hot-toast'
import LoadingOverlay from '../loader'

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  padding: theme.spacing(2),
  margin: theme.spacing(3, 0)
}))

const schema = yup.object().shape({
  current_password: yup.string().required('Current Password is required'),
  new_password: yup.string().required('New Password is required').min(8, 'New Password must be at least 8 characters'),
  confirm_password: yup
    .string()
    .required('Confirm Password is required')
    .min(8, 'Confirm Password must be at least 8 characters')
})

const defaultValues = {
  current_password: '',
  new_password: '',
  confirm_password: ''
}

const Home = () => {
  const { setUser, user } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onSubmit',
    resolver: yupResolver(schema)
  })

  const handleChangePassword = async data => {
    setIsLoading(true)
    try {
      const response = await API.changePassword(data)
      if (response.status === 200) {
        const authData = await API.authMe()

        if (authData.status === 200) {
          setUser(authData.data)
          await router.push('/home')
          setIsLoading(false)
          toast.success('Password changed successfully', { duration: 5000 })
        } else {
          setIsLoading(false)
          toast.error(authData.response.data.error[0].message)

          // seterror(authData.response.data.error[0].message)
        }
      }
    } catch (error) {
      setIsLoading(false)
      toast.error(error.response.data.error[0].message)

      // seterror(error.response.data.error[0].message)
    }
  }

  return (
    <Grid container spacing={4} justifyContent='center' alignItems='center' sx={{ padding: 2 }}>
      <Grid item xs={12} md={7}>
        <StyledCard>
          <CardHeader title='Change Password' />
          <CardContent>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(handleChangePassword)}>
              <Box sx={{ mb: 4 }}>
                <Controller
                  name='current_password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      label='Current Password'
                      onChange={onChange}
                      id='auth-login-v2-current_password'
                      placeholder='********'
                      error={Boolean(errors.current_password)}
                      {...(errors.current_password && { helperText: errors.current_password.message })}
                      type={showCurrentPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              <Icon fontSize='1.25rem' icon={showCurrentPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Box>
              <Box sx={{ mb: 4 }}>
                <Controller
                  name='new_password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      label='New Password'
                      onChange={onChange}
                      id='auth-login-v2-new-password'
                      placeholder='********'
                      error={Boolean(errors.new_password)}
                      {...(errors.new_password && { helperText: errors.new_password.message })}
                      type={showNewPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              <Icon fontSize='1.25rem' icon={showNewPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Box>
              <Box sx={{ mb: 4 }}>
                <Controller
                  name='confirm_password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      label='Confirm Password'
                      onChange={onChange}
                      id='auth-login-v2-confirm-password'
                      placeholder='********'
                      error={Boolean(errors.confirm_password)}
                      {...(errors.confirm_password && { helperText: errors.confirm_password.message })}
                      type={showConfirmPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              <Icon fontSize='1.25rem' icon={showConfirmPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Box>
              {isLoading ? (
                <LoadingOverlay isLoading={true} />
              ) : (
                <Button fullWidth type='submit' variant='contained' disabled={isLoading}>
                  Change Password
                </Button>
              )}
            </form>
          </CardContent>
          {/* <CardContent>
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
              <Button variant='outlined' color='primary' sx={{ padding: '7px 10px' }}>
                Web App
              </Button>
            </Stack>
          </CardContent> */}
        </StyledCard>
      </Grid>
    </Grid>
  )
}

export default Home
