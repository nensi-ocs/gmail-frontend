import { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TabPanel from '@mui/lab/TabPanel'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import CustomTextField from 'src/@core/components/mui/text-field'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Icon from 'src/@core/components/icon'
import API from 'src/utils/api'
import { AuthContext } from 'src/context/AuthContext'
import { getCode, getName, getData } from 'country-list'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Swal from 'sweetalert2'

// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import LoadingOverlay from '../loader'

const schema = yup.object().shape({
  address: yup.string().required('Address is a required field'),
  city: yup.string().required('City is a required field'),
  zipCode: yup.string().required('Zip Code is a required field'),
  state: yup.string().required('State is a required field'),
  country: yup.string().required('Country is a required field')
})

const defaultValues = {
  address: '',
  city: '',
  zipCode: '',
  state: '',
  country: ''
}

const StepPayment = () => {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const { setUser, user, setPlandetails, plandetails, pricing } = useContext(AuthContext)
  const [err, setErr] = useState(null)
  const { plan, subscriptionType } = router.query
  const countries = getData()

  useEffect(() => {
    const fetchPlanDetails = async () => {
      if (pricing) {
        if (plan && subscriptionType && Array.isArray(pricing?.plans)) {
          const selectedPlan = pricing?.plans.find(p => p.name === plan)
          if (selectedPlan) {
            const selectedPrice = selectedPlan.price.find(p => p.duration === subscriptionType)
            if (selectedPrice) {
              setPlandetails({
                ...selectedPlan,
                price: selectedPrice.amount,
                duration: selectedPrice.duration
              })
            }
          }
        } else {
          await router.push('/pricing')
        }
      }
    }

    fetchPlanDetails()
  }, [plan, subscriptionType, pricing, setPlandetails])

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onSubmit',
    resolver: yupResolver(schema)
  })

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    customClass: {
      container: 'my-swal-toast-container'
    }
  })

  const handlePayment = async data => {
    if (!stripe || !elements) {
      return
    }
    const cardElement = elements.getElement(CardElement)

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: `${user.first_name} ${user.last_name}`
        }
      })

      if (error) {
        setErr(error.message)

        return
      }

      const formData = {
        paymentMethodId: paymentMethod.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        address: data.address,
        city: data.city,
        zipCode: data.zipCode,
        state: data.state,
        country: data.country,
        plan: plan,
        subscriptionType: subscriptionType
      }

      try {
        const response = await API.stripePayment(formData)
        if (response.status === 200 && response.data.status === 'active') {
          // Toast.fire({
          //   icon: 'success',
          //   title: 'Payment successfully processed',
          //   width: '400px'
          // })
          toast.success('Payment successfully processed')
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.error[0]?.message || 'Something went wrong'

        // Toast.fire({
        //   icon: 'error',
        //   title: `${errorMessage}`,
        //   // width: `${Math.min(errorMessage.length * 10, 500)}px`,
        // })
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error)

      // Toast.fire({
      //   icon: 'error',
      //   title: `Error: ${error.message || error}`
      // })
      toast.error(`Error: ${error.message || error}`)
    }
  }

  const [tabValue, setTabValue] = useState('1');

  return (
    <>
      {pricing ? (
        <Card>
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={12} lg={7}>
                <Typography variant='h3'>Checkout</Typography>
                <TabContext value={tabValue} className='card'>
                  <Typography variant='h4'>Billing Details</Typography>
                  <Grid container sx={{ mt: 6 }}>
                    <Grid item md={12} xs={12}>
                      <TabPanel value='1' sx={{ p: 0 }}>
                        <Grid container spacing={4}>
                          <Grid item xs={12}>
                            <Controller
                              name='address'
                              control={control}
                              render={({ field }) => (
                                <CustomTextField
                                  fullWidth
                                  label='Address'
                                  {...field}
                                  error={Boolean(errors.address)}
                                  helperText={errors.address ? errors.address.message : ''}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Controller
                              name='city'
                              control={control}
                              render={({ field }) => (
                                <CustomTextField
                                  fullWidth
                                  label='City'
                                  {...field}
                                  error={Boolean(errors.city)}
                                  helperText={errors.city ? errors.city.message : ''}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Controller
                              name='zipCode'
                              control={control}
                              render={({ field }) => (
                                <CustomTextField
                                  fullWidth
                                  label='Zip code'
                                  {...field}
                                  error={Boolean(errors.zipCode)}
                                  helperText={errors.zipCode ? errors.zipCode.message : ''}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Controller
                              name='state'
                              control={control}
                              render={({ field }) => (
                                <CustomTextField
                                  fullWidth
                                  label='State / Province / Region'
                                  {...field}
                                  error={Boolean(errors.state)}
                                  helperText={errors.state ? errors.state.message : ''}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Controller
                              name='country'
                              control={control}
                              render={({ field }) => (
                                <FormControl fullWidth>
                                  <InputLabel id='country-select-label'>Country</InputLabel>
                                  <Select
                                    labelId='country-select-label'
                                    id='country-select'
                                    {...field}
                                    label='Country'
                                    error={Boolean(errors.country)}
                                    onChange={e => field.onChange(e.target.value)}
                                    MenuProps={{ sx: { maxHeight: 300 } }}
                                    sx={{ mt: 1 }}
                                  >
                                    {countries.map(country => (
                                      <MenuItem key={country.code} value={country.code}>
                                        {country.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  {errors.country && <Typography color='error'>{errors.country.message}</Typography>}
                                </FormControl>
                              )}
                            />
                          </Grid>
                        </Grid>
                      </TabPanel>
                    </Grid>
                  </Grid>
                  <Typography variant='h4' sx={{ mt: 6 }}>
                    Credit Card Info
                  </Typography>
                  <Grid container sx={{ mt: 6 }}>
                    <Grid item md={12} xs={12}>
                      <Grid container spacing={4}>
                        <Grid item xs={12}>
                          <Typography mb={1}>Credit or debit card</Typography>
                          <Box
                            sx={{
                              padding: '10px 20px',
                              borderRadius: '4px',
                              border: '1px solid #ccc',
                              boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, .075)',
                              transition: 'border-color ease-in-out .15s, box-shadow ease-in-out .15s'
                            }}
                          >
                            <CardElement
                              options={{
                                style: {
                                  base: {
                                    fontSize: '16px',
                                    color: '#32325d',
                                    fontFamily: 'Roboto, sans-serif'
                                  }
                                }
                              }}
                            />
                          </Box>
                          {err && (
                            <Typography color='error' sx={{ mt: 1 }}>
                              {err}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </TabContext>
              </Grid>
              <Grid item xs={10} lg={5}>
                <Box sx={{ borderRadius: 1, border: theme => `1px solid ${theme.palette.divider}` }}>
                  <CardContent>
                    <Typography sx={{ mb: 4 }} variant='h6'>
                      Order Summary
                    </Typography>
                    <Typography variant='body2'>
                      It can help you manage and service orders before,
                      <br />
                      during and after fulfilment
                    </Typography>
                    <Box
                      sx={{
                        mt: 4,
                        mb: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        color: 'text.secondary',
                        backgroundColor: 'background.default',
                        borderRadius: 1,
                        p: 3
                      }}
                    >
                      <Typography variant='body2' sx={{ mb: 1 }}>
                        A simple start for everyone
                      </Typography>
                      <Typography variant='h1'>$ {plandetails?.price}</Typography>
                    </Box>
                    <Box
                      sx={{
                        mb: 4,
                        rowGap: 1,
                        columnGap: 4,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography sx={{ fontWeight: 500 }}>Subtotal</Typography>
                      <Typography sx={{ fontWeight: 500 }}>${plandetails?.price}</Typography>
                    </Box>
                    <Divider sx={{ my: '0 !important' }} />
                    <Box
                      sx={{
                        mt: 4,
                        mb: 4,
                        rowGap: 1,
                        columnGap: 4,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography sx={{ fontWeight: 500 }}>Total</Typography>
                      <Typography sx={{ fontWeight: 500 }}>${plandetails?.price}</Typography>
                    </Box>
                    <Button fullWidth variant='contained' sx={{ mb: 2 }} onClick={handleSubmit(handlePayment)}>
                      proceed with payment
                      <Icon icon='tabler:arrow-right' style={{ marginLeft: '7px' }} />
                    </Button>
                  </CardContent>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <LoadingOverlay isLoading={true} />
      )}
    </>
  )
}

export default StepPayment
