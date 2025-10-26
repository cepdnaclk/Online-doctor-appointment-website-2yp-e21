import React, { useContext } from 'react'
import Carousel from '../components/ui/Carousel'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import assets from '../assets/assets'
import { MdHealthAndSafety } from 'react-icons/md'

const Landing = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  return (
    <div className='w-full p-0'>
      <Carousel
        images={[assets.admin1, assets.admin2, assets.admin3, assets.admin4]}
        autoPlay
        interval={3500}
        heightClass='h-[78vh] md:h-[88vh]'
        pauseOnHover
        fallbackSrc='/logo.png'
        overlay={(
          <div className='pointer-events-none absolute inset-0'>
            {/* Top-left Welcome overlay */}
            <div className='pointer-events-auto absolute left-5 md:left-10 top-[18vh] md:top-[24vh] max-w-2xl'>
              <div className='inline-flex items-center gap-3 mb-3 bg-black/30 rounded-full px-3 py-2 backdrop-blur-sm shadow'>
                {/* <img src={assets.admin_badge} alt='' className='w-8 h-8' /> */}
                <span className='text-white/90 text-m tracking-wide'>Welcome</span>
              </div>
              <h1
                className='text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] bg-gradient-to-r from-primary-50 via-primary-200 to-primary-400 bg-clip-text text-transparent tracking-tight'
                style={{
                  WebkitTextStroke: '1px rgba(255,255,255,0.7)',
                  textShadow: '0 0 6px rgba(255,255,255,0.8), 0 0 18px rgba(128,28,196,0.55), 0 0 28px rgba(128,28,196,0.35)'
                }}
              >
                {aToken ? 'Admin' : dToken ? 'Doctor' : 'Back'} Dashboard
              </h1>
              <p className='mt-2 md:mt-3 px-2 text-white/90 text-sm md:text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]'>
                Manage appointments, patients, and insights in one place.
              </p>
            </div>

            {/* Bottom-right Medical Tips overlay */}
            <div className='pointer-events-auto absolute right-5 bottom-5 md:right-10 md:bottom-10 w-[92%] sm:w-[420px]'>
              <div className='rounded-2xl p-[1.5px] bg-gradient-to-tr from-primary-200/50 via-primary-300/40 to-primary-500/40 shadow-2xl'>
                <div className='rounded-2xl bg-black/60 backdrop-blur-lg border border-white/10 p-4 md:p-5'>
                  <div className='flex items-center gap-2 mb-3'>
                    <MdHealthAndSafety size={20} className='text-white/90' aria-hidden='true' />
                    <h3 className='text-base md:text-lg font-semibold text-white/90'>Medical Tips</h3>
                  </div>
                  <ul className='grid grid-cols-1 gap-y-2 text-white/90 text-sm'>
                    <li className='flex items-center gap-2'>
                      <span className='text-lg'>🫀</span>
                      <span className='px-2 py-0.5 rounded-md border border-white/20 bg-white/5'>BP: Aim &lt; 120/80 mmHg; monitor regularly.</span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <span className='text-lg'>🩺</span>
                      <span className='px-2 py-0.5 rounded-md border border-white/20 bg-white/5'>Vitals: Check HR, RR, Temp each visit.</span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <span className='text-lg'>💊</span>
                      <span className='px-2 py-0.5 rounded-md border border-white/20 bg-white/5'>Support med adherence to improve outcomes.</span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <span className='text-lg'>🥗</span>
                      <span className='px-2 py-0.5 rounded-md border border-white/20 bg-white/5'>Diet: Balanced meals; reduce sodium.</span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <span className='text-lg'>🏃</span>
                      <span className='px-2 py-0.5 rounded-md border border-white/20 bg-white/5'>Activity: 150 min/week moderate exercise.</span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <span className='text-lg'>🧪</span>
                      <span className='px-2 py-0.5 rounded-md border border-white/20 bg-white/5'>Labs: HbA1c, Lipids, TSH as indicated.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  )
}

export default Landing
