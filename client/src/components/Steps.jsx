import React from 'react'
import { assets } from '../assets/assets'

const Steps = () => {
  return (
    <div className='mx-4 lg:mx-44 py-20 xl:py-40'>
        <h1 className='text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent'>Steps to Remove background <br /> image in seconds</h1>
        <div className='flex items-start flex-wrap gap-4 mt-16 xl:mt-24 justify-center'>

           {/*  First */}
            <div className='flex items-start gap-4 bg-white border drop-shadow-md p-7 pb-10 rounded hover:scale-105 transition-all duration-500 ease-in-out'>
                <img className='max-w-9' src={assets.upload_icon} alt="" />
                <div>
                <p className='text-xl font-medium'>Upload Image</p>
                <p className='text-sm text-neutral-500 mt-1'>upload an image from your <br /> device or computer</p>
                </div>
            </div>

            {/*  Second */}

            <div className='flex items-start gap-4 bg-white border drop-shadow-md p-7 pb-10 rounded hover:scale-105 transition-all duration-500 ease-in-out'>
                <img className='max-w-9' src={assets.remove_bg_icon} alt="" />
                <div>
                <p className='text-xl font-medium'>Remove backgroung</p>
                <p className='text-sm text-neutral-500 mt-1'>upload an image from your <br /> device or computer</p>
                </div>
            </div>

            {/*  Third */}

            <div className='flex items-start gap-4 bg-white border drop-shadow-md p-7 pb-10 rounded hover:scale-105 transition-all duration-500 ease-in-out'>
                <img className='max-w-9' src={assets.download_icon} alt="" />
                <div>
                <p className='text-xl font-medium'>Download Image</p>
                <p className='text-sm text-neutral-500 mt-1'>upload an image from your <br /> device or computer</p>
                </div>
            </div>

            

        </div>
    </div>
  )
}

export default Steps