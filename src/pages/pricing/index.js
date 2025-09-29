import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import LoadingOverlay from 'src/pages/loader'

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const { user, pricing, setPricing, setPlandetails, setIsLoading, isLoading } = useContext(AuthContext)
  const router = useRouter()

  const handleUpgrade = async plan => {
    setPlandetails(plan)
    if (pricing) {
      await router.push({
        pathname: '/payment',
        query: {
          plan: plan,
          subscriptionType: selectedPlan
        }
      })
    }
  }

  const handleFreePlan = async plan => {
    await router.push('/home')
  }

  return (
    <div className='pricing-container'>
      <h1 className='title'>Omeeai Pricing Plans</h1>
      {pricing?.plans ? (
        <>
          {pricing?.plans?.map((plan, index) => (
            <div className='card highlighted' key={index}>
              <div className='card-main'>
                <div className='card-header'>{plan.name}</div>
                <div className='card-desribe'>
                  Powered by{' '}
                  <div className='card-describe-inner'>
                    <div className='card-hover'>
                      <span className='card-hover-color'>{plan.ai}</span>
                    </div>
                  </div>
                  <div className='mt-1 text-sm font-normal opacity-70'></div>
                </div>
                <div className='card-short-describe'></div>
              </div>
              <div className='card-content'>
                {plan.features.map((feature, idx) => (
                  <div className='flex-container' key={idx}>
                    <div>
                      <svg
                        height='10px'
                        width='7px'
                        id='Capa_1'
                        xmlns='http://www.w3.org/2000/svg'
                        xmlnsXlink='http://www.w3.org/1999/xlink'
                        viewBox='0 0 31.955 31.955'
                        xmlSpace='preserve'
                      >
                        <g>
                          <path
                            style={{
                              fill: '#0574b0'
                            }}
                            d='M27.25,4.655C20.996-1.571,10.88-1.546,4.656,4.706C-1.571,10.96-1.548,21.076,4.705,27.3 c6.256,6.226,16.374,6.203,22.597-0.051C33.526,20.995,33.505,10.878,27.25,4.655z'
                          />
                          <path
                            style={{
                              fill: '#0574b0'
                            }}
                            d='M13.288,23.896l-1.768,5.207c2.567,0.829,5.331,0.886,7.926,0.17l-0.665-5.416 C17.01,24.487,15.067,24.5,13.288,23.896z M8.12,13.122l-5.645-0.859c-0.741,2.666-0.666,5.514,0.225,8.143l5.491-1.375 C7.452,17.138,7.426,15.029,8.12,13.122z M28.763,11.333l-4.965,1.675c0.798,2.106,0.716,4.468-0.247,6.522l5.351,0.672 C29.827,17.319,29.78,14.193,28.763,11.333z M11.394,2.883l1.018,5.528c2.027-0.954,4.356-1.05,6.442-0.288l1.583-5.137 C17.523,1.94,14.328,1.906,11.394,2.883z'
                          />
                          <circle
                            style={{
                              fill: '#0574b0'
                            }}
                            cx={15.979}
                            cy={15.977}
                            r={6.117}
                          />
                        </g>
                      </svg>
                    </div>
                    <div>
                      {typeof feature === 'object' ? (
                        <div className='feature-container'>
                          <div className='flex-inner'>
                            <div className='feature-main'>{feature.main}</div>
                            <div className='feature-icon'>
                              <svg
                                height='20px'
                                width='20px'
                                xmlns='http://www.w3.org/2000/svg'
                                className='icon-svg cursor-pointer'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  fill='currentColor'
                                  d='M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10'
                                  opacity='.15'
                                ></path>
                                <path
                                  fill='currentColor'
                                  d='M12 7.75c-.621 0-1.125.504-1.125 1.125a.75.75 0 0 1-1.5 0a2.625 2.625 0 1 1 4.508 1.829c-.092.095-.18.183-.264.267a6.666 6.666 0 0 0-.571.617c-.22.282-.298.489-.298.662V13a.75.75 0 0 1-1.5 0v-.75c0-.655.305-1.186.614-1.583c.229-.294.516-.58.75-.814c.07-.07.136-.135.193-.194A1.125 1.125 0 0 0 12 7.75M12 17a1 1 0 1 0 0-2a1 1 0 0 0 0 2'
                                ></path>
                              </svg>
                              <div className='sub-feature'>
                                {typeof feature.sub === 'object' ? (
                                  <>
                                    {selectedPlan === 'monthly' ? (
                                      <div dangerouslySetInnerHTML={{ __html: feature.sub.monthly }}></div>
                                    ) : (
                                      <div dangerouslySetInnerHTML={{ __html: feature.sub.yearly }}></div>
                                    )}
                                  </>
                                ) : (
                                  <div dangerouslySetInnerHTML={{ __html: feature.sub }}></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className='feature-text'>{feature}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className='card-footer'>
                {plan?.price && (
                  <>
                    <div className='plan-switch'>
                      <div
                        className={`plan-option ${selectedPlan === 'monthly' ? 'active' : ''}`}
                        onClick={() => setSelectedPlan('monthly')}
                      >
                        Monthly
                      </div>
                      <div
                        className={`plan-option ${selectedPlan === 'yearly' ? 'active' : ''}`}
                        onClick={() => setSelectedPlan('yearly')}
                      >
                        Yearly
                      </div>
                    </div>
                    <div className='plan-description'>
                      {plan?.price?.map((price, idx) => (
                        <div key={idx}>
                          {price.duration === selectedPlan && (
                            <>
                              <div className='plan-name'>
                                <div>{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan</div>
                              </div>
                              <div className='plan-price'>
                                ${price.amount} / {selectedPlan}
                              </div>
                              <div className='plan-price-discount'>
                                Use our {plan.name} {selectedPlan} plan
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {plan?.name === 'Free' ? (
                  <button className='button' onClick={() => handleFreePlan(plan.name)}>
                    Continue
                  </button>
                ) : (
                  <button className='button' onClick={() => handleUpgrade(plan.name)}>
                    Upgrade Plan
                  </button>
                )}
              </div>
            </div>
          ))}
        </>
      ) : (
        <LoadingOverlay isLoading={true} />
      )}
      <style jsx>{`
        .pricing-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 1200px;
          margin: auto;
          padding: 1rem;
        }
        .title {
          width: 100%;
          text-align: center;
          margin-bottom: 2rem;
        }
        .card {
          padding: 1rem;
          background-color: #ffffff;
          border: 1px solid #0574b0;
          border-radius: 10px;
          width: calc(33.333% - 2rem);
          margin: 1rem;
          display: flex;
          flex-direction: column;
          // transition: transform 0.3s ease-in-out;
        }
        // .card:hover {
        //   transform: scale(1.01);
        // }
        .card-header {
          border-radius: 5px;
          color: black;
          padding: 0.5rem;
          font-size: 1.5rem;
          font-weight: 900;
        }
        .card-desribe {
          font-weight: 500;
          font-size: 1rem;
          line-height: 1.5rem;
          padding: 0px 0.5rem;
        }
        .card-describe-inner {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .card-hover {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .card-hover-color {
          color: #0574b0;
          border-radius: 0.375rem;
          background-color: #d5ecf8;
          padding-left: 0.375rem;
          padding-right: 0.375rem;
        }
        .card-short-describe {
          opacity: 0.7;
          font-size: 12px;
          line-height: 1.25rem;
          margin-top: 0.25rem;
          padding: 0px 0.5rem;
        }
        .card-content {
          padding: 1rem;
          gap: 1rem;
          height: 100%;
        }
        .card-footer {
          padding: 1rem;
          text-align: center;
        }
        .button {
          background-color: #0574b0;
          border: none;
          padding: 10px 20px;
          color: white;
          border-radius: 5px;
          cursor: pointer;
          width: 100%;
          margin: 0 auto;
          font-weight: bold;
        }
        .button:hover {
          background-color: #0f81be;
        }
        .highlighted {
          border-color: #0574b0;
        }
        @media (max-width: 1000px) {
          .card {
            width: calc(50% - 2rem);
          }
        }
        @media (max-width: 700px) {
          .card {
            width: calc(100% - 2rem);
          }
        }
        .flex-container {
          display: flex;
          flex-direction: row;
          gap: 0.75rem;
          padding: 4px 0px;
        }
        .flex-inner {
          display: flex;
          flex-direction: row;
          gap: 0.25rem;
          align-items: center;
        }
        .icon-flex {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
        }
        .plan-switch {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          border-radius: 20px;
          border: 1px solid #0574b0;
          padding: 3px;
          width: 100%;
        }
        .plan-option {
          padding: 5px 0px;
          border-radius: 20px;
          margin: 0 2px;
          cursor: pointer;
          background-color: #d5ecf8; // Light background
          color: #3a3a3a; // Dark text color
          font-weight: bold;
          transition: background-color 0.3s, color 0.3s; // Smooth transition for color change
          width: 48%;
        }
        .plan-option.active {
          background-color: #0574b0; // Active color
          color: white;
        }
        .plan-save {
          background-color: #6c5ce7; // Purple background for discount tag
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 10px;
          font-size: 0.75rem;
          margin: 0 5px;
        }
        .plan-description {
          display: flex;
          flex-direction: column;
          align-items: left;
          justify-content: left;
          margin-bottom: 1rem;
          border-radius: 20px;
          border: 1px solid #0574b0;
          padding: 10px;
        }
        .plan-name {
          display: flex;
          flex-direction: row;
          gap: 0.5rem;
          font-weight: 600;
          justify-content: center;
        }
        .plan-discount {
          border-radius: 9999px;
          color: white;
          background-color: #0574b0;
          padding: 0px 5px 0px 6px;
          text-align: center;
        }
        .plan-price {
          color: black;
          font-size: 30px;
        }
        .plan-price-discount {
          opacity: 0.7;
          font-size: 12px;
          line-height: 1.25rem;
          padding: 0px 0.5rem;
        }
        .feature-icon {
          position: relative;
        }

        .sub-feature {
          display: none;
          position: absolute;
          bottom: 125%; /* Adjust as needed */
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0, 0, 0, 0.9);
          color: #fff;
          padding: 10px;
          border-radius: 5px;
          z-index: 1;
          word-wrap: break-word;
          width: 250px;
          height: auto;
          font-size: 13px;
          // line-height: 20px;
          // word-spacing: 5px;
        }

        .feature-icon:hover .sub-feature {
          display: block;
        }
      `}</style>
    </div>
  )
}

export default Pricing
