import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import API from 'src/utils/api';
import LoadingOverlay from 'src/pages/loader';

const defaultProvider = {
  isLoading: true, 
  setIsLoading: () => { },
  user: null,
  setUser: () => { },
  plandetails: null,
  setPlandetails: () => { },
  pricing: null,
  setPricing: () => { },
};

const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(defaultProvider.isLoading)
  const [user, setUser] = useState(defaultProvider.user)
  const [plandetails, setPlandetails] = useState(defaultProvider.plandetails)
  const [pricing, setPricing] = useState(defaultProvider.pricing)
  const router = useRouter();

  const fetchAuthMe = async () => {
    setIsLoading(true);
    try {
      const response = await API.authMe();
      setUser(response.data);
      
      if(router.route === '/login' || router.route === '/register') {
        await router.push('/home');
      }

      fetchPricingData();
      setIsLoading(false);
    } catch (error) {
      setUser(null);

      if (router.route !== '/login' && router.route !== '/register') {
      await router.push('/login');
      } else if(router.route === '/register') {
        await router.push('/register');
      }

      setIsLoading(false);
    }
  };

  const fetchPricingData = async () => {
    setIsLoading(true)
    try {
      const response = await API.subscriptionPrice()
      setPricing(response.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching pricing data:', error);
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchAuthMe();
  }, []);

  const values = {
    isLoading,
    setIsLoading,
    user,
    setUser,
    plandetails,
    setPlandetails,
    pricing,
    setPricing,          

  };

  if (isLoading) {
    return <div><LoadingOverlay isLoading={isLoading} /></div>;
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };