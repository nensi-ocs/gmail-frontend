// ** React Imports
import { useEffect, useState } from 'react'

import { Elements } from '@stripe/react-stripe-js';

import { loadStripe } from '@stripe/stripe-js';
import StepPayment from './StepPayment.js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_ID
)

const payment = () => (
  <Elements stripe={stripePromise}>
    <StepPayment />
  </Elements>
);

export default payment;
