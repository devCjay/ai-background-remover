import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { plans } from '../assets/assets'
import { AppContext } from '../context/appContext'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'

const BuyCredit = () => {

    const { backendURL, loadCreditsData } = useContext(AppContext)
    const navigate = useNavigate();
    const { getToken } = useAuth();

    const paymentPaypalPay = async (planId) => {
      try {
        const token = await getToken();
    
        const { data } = await axios.post(
          `${backendURL}/api/user/pay-paypal`,
          { planId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
    
        if (data.success && data.approvalUrl) {
          window.location.href = data.approvalUrl; // ✅ Redirect to PayPal
        } else {
          //toast.error("Payment initialization failed.");
          console.log("Payment initialization failed.");
        }
      } catch (error) {
        console.error("PayPal Init Error:", error);
        toast.error(error?.response?.data?.message || "Something went wrong.");
      }
    };


  return (
    <div className='min-h-[80vh] text-center pt-14 mb-10'>

      <button className='border border-gray-400 px-10 py-2 rounded-full mb-b'>Our Plan</button>
      <h1 className='text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent mb-6 sm:mb-10'>Choose the plan that is right for you </h1>
      
      <div className='flex flex-wrap justify-center gap-6 text-left'>

        {plans.map((item, index) => (


          <div className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-700 hover:scale-105 transition-all duration-500 ease-in-out' key={index}>
            <img src={assets.logo_icon} alt="" />
            <p className='mt-3 font-semibold'>{item.id}</p>
            <p className='text-sm'>{item.desc}</p>
            <p className='mt-6'>
              <span className='text-3xl font-medium'>${item.price}</span> / {item.credits} Credits
            </p>
            <button onClick={()=>paymentPaypalPay(item.id) } className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w--52'>Purchase</button>
          </div>
        ))


        }


      </div>

    </div>
  )
}

export default BuyCredit