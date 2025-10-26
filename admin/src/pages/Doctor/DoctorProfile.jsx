import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import assets from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiAward, FiBriefcase, FiMapPin, FiEdit2, FiSave } from 'react-icons/fi'

const DoctorProfile = () => {

    // Get state and functions from Context
    const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)
    const { currency } = useContext(AppContext)

    // Local state to control UI
    const [isEdit, setIsEdit] = useState(false)
    const [docImg, setDocImg] = useState(null)

    // Fetch data on load
    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dToken])

    // Handle nested address object change
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value // Use input name to update line1 or line2
            }
        }))
    }

    // Function to save data to backend
    const updateProfile = async () => {
        try {
            // 1. Build form data (supports optional image)
            const form = new FormData()
            form.append('address', JSON.stringify(profileData.address))
            form.append('fees', profileData.fees)
            form.append('available', String(profileData.available))
            form.append('about', profileData.about || '')
            if (docImg) form.append('image', docImg)

            // 2. Make the API call with auth headers
            const { data } = await axios.post(
                backendUrl + '/api/doctor/update-profile',
                form,
                { headers: { token: dToken } }
            )

            // 3. Handle response
            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)     // Switch back to "View Mode"
                getProfileData()   // Refetch data to confirm save
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.error("Update profile failed:", error)
            toast.error(error.message)
        }
    }


    // The 'handleSave' function to be called by the button
    const handleSave = () => {
        updateProfile()
        // Note: setIsEdit(false) is now inside updateProfile's success case
    }

        return profileData && (
            <div className='m-5 space-y-6'>
                <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* Left: Avatar and quick info */}
                    <div className='rounded-2xl p-[1.5px] bg-gradient-to-tr from-primary-200/50 via-primary-300/40 to-primary-500/40 shadow-md'>
                        <div className='bg-white rounded-2xl overflow-hidden ring-1 ring-black/5'>
                            <div className='relative'>
                                <img
                                    src={docImg ? URL.createObjectURL(docImg) : (profileData.image || assets.default_profile)}
                                    alt='Doctor'
                                    className='w-full h-64 object-cover object-top'
                                />
                                {isEdit && (
                                    <label htmlFor='doc-img' className='absolute bottom-3 right-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 text-gray-800 ring-1 ring-black/5 cursor-pointer hover:bg-white'>
                                        <FiEdit2 size={16} /> Change photo
                                    </label>
                                )}
                                <input id='doc-img' type='file' accept='image/*' hidden onChange={(e)=> setDocImg(e.target.files?.[0] || null)} />
                            </div>
                            <div className='p-4 space-y-2'>
                                <p className='text-xl font-semibold text-gray-800'>{profileData.name}</p>
                                <div className='flex flex-wrap items-center gap-2 text-sm text-gray-700'>
                                    <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 ring-1 ring-primary-200/60'>
                                        <FiAward /> {profileData.degree}
                                    </span>
                                    <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 ring-1 ring-primary-200/60'>
                                        {profileData.speciality}
                                    </span>
                                    <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 ring-1 ring-primary-200/60'>
                                        <FiBriefcase /> {profileData.experience} Years
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Details and edit */}
                    <div className='lg:col-span-2 rounded-2xl p-[1.5px] bg-gradient-to-tr from-primary-200/50 via-primary-300/40 to-primary-500/40 shadow-md'>
                        <div className='bg-white rounded-2xl overflow-hidden ring-1 ring-black/5 p-6'>
                            {/* About */}
                            <div className='space-y-2'>
                                <p className='flex items-center gap-2 text-sm font-medium text-gray-800'><FiEdit2 className='text-primary-600'/> About</p>
                                {isEdit ? (
                                    <textarea
                                        className='w-full px-3 py-2 rounded-xl border border-gray-200 ring-1 ring-black/5 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200/70 text-gray-700'
                                        rows='4'
                                        value={profileData.about}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                                    />
                                ) : (
                                    <p className='text-sm text-gray-600 max-w-[700px]'>{profileData.about}</p>
                                )}
                            </div>

                            {/* Fees */}
                            <div className='mt-6'>
                                <p className='text-gray-700 font-medium'>Appointment fee:&nbsp;
                                    {isEdit ? (
                                        <input
                                            type='number'
                                            className='w-28 px-3 py-1 rounded-xl border border-gray-200 ring-1 ring-black/5 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200/70 text-gray-800'
                                            value={profileData.fees}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                                        />
                                    ) : (
                                        <span className='text-gray-900 font-semibold'>{currency(profileData.fees)}</span>
                                    )}
                                </p>
                            </div>

                            {/* Address */}
                            <div className='mt-6'>
                                <p className='flex items-center gap-2 text-sm font-medium text-gray-800'><FiMapPin className='text-primary-600'/> Address</p>
                                {isEdit ? (
                                    <div className='mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
                                        <input
                                            type='text'
                                            name='line1'
                                            className='px-3 py-2 rounded-xl border border-gray-200 ring-1 ring-black/5 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200/70'
                                            placeholder='Address Line 1'
                                            value={profileData.address.line1}
                                            onChange={handleAddressChange}
                                        />
                                        <input
                                            type='text'
                                            name='line2'
                                            className='px-3 py-2 rounded-xl border border-gray-200 ring-1 ring-black/5 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200/70'
                                            placeholder='Address Line 2 (City, State)'
                                            value={profileData.address.line2}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                ) : (
                                    <p className='text-sm text-gray-700 mt-1'>
                                        {profileData.address.line1}<br />{profileData.address.line2}
                                    </p>
                                )}
                            </div>

                            {/* Availability */}
                            <div className='mt-6 flex items-center gap-3'>
                                <span className='text-sm font-medium text-gray-800'>Available</span>
                                <label className={`inline-flex items-center gap-2 ${isEdit ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                                    <input
                                        type='checkbox'
                                        name='available'
                                        checked={profileData.available}
                                        onChange={(e) => isEdit && setProfileData(prev => ({ ...prev, available: e.target.checked }))}
                                        readOnly={!isEdit}
                                        disabled={!isEdit}
                                        className='peer sr-only'
                                    />
                                    <span className={`w-10 h-6 rounded-full bg-gray-200 relative ring-1 ring-black/5 transition-all duration-200 peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow after:transition-all after:duration-200 peer-checked:after:translate-x-4`}></span>
                                </label>
                            </div>

                            {/* Actions */}
                            <div className='mt-8'>
                                {isEdit ? (
                                    <button
                                        onClick={handleSave}
                                        className='inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:shadow-lg hover:-translate-y-[1px] hover:from-primary-500 hover:to-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300'
                                    >
                                        <FiSave size={18}/> Save
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsEdit(true)}
                                        className='inline-flex items-center gap-2 px-6 py-2 rounded-full ring-1 ring-black/5 bg-white text-gray-800 hover:bg-primary-50 transition'
                                    >
                                        <FiEdit2 size={18}/> Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}

export default DoctorProfile