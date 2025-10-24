import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import assets from '../../assets/assets' // Assuming you need this
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorProfile = () => {

    // Get state and functions from Context
    const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)
    const { currency } = useContext(AppContext)

    // Local state to control UI
    const [isEdit, setIsEdit] = useState(false)

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
            // 1. Prepare only the data fields that can be updated
            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                available: profileData.available,
                about: profileData.about // Added 'about' based on your UI
            }

            // 2. Make the API call with auth headers
            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile',
                updateData,
                { headers: { token: dToken } } // <-- THE FIX
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
        <div className='flex flex-col gap-4 m-5'>
            {/* Profile Image - Assuming 'image' field exists */}
            <div className='bg-primary/80 w-full sm:max-w-64 rounded-lg'>
                <img src={profileData.image || assets.default_profile} alt="Doctor" className='w-full object-cover' />
            </div>

            {/* Profile Details Card */}
            <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>

                {/* --- Doc Info --- */}
                <div>
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
                    <p className='flex items-center gap-2 mt-1 text-gray-600'>
                        {profileData.degree} - {profileData.speciality}
                    </p>
                    <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience} Years</button>
                </div>

                {/* --- Doc About --- */}
                <div className='mt-4'>
                    <p className='flex items-center gap-1 text-sm font-medium text-neutral-800'>About:</p>
                    {isEdit ? (
                        <textarea
                            className='w-full p-2 border rounded-md mt-1 text-sm text-gray-600'
                            rows="4"
                            value={profileData.about}
                            onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                        />
                    ) : (
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{profileData.about}</p>
                    )}
                </div>

                {/* --- Appointment fee --- */}
                <div className='mt-4'>
                    <p className='text-gray-600 font-medium mt-4'>
                        Appointment fee: {' '}
                        {isEdit ? (
                            <input
                                type="number"
                                className='w-24 p-1 border rounded-md text-gray-800'
                                value={profileData.fees}
                                onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                            />
                        ) : (
                            <span className='text-gray-800 font-medium'>{currency(profileData.fees)}</span>
                        )}
                    </p>
                </div>

                {/* --- Address --- */}
                <div className='flex gap-2 py-2 mt-2'>
                    <p className='text-sm font-medium'>Address:</p>
                    {isEdit ? (
                        <div className='flex flex-col gap-2 text-sm'>
                            <input
                                type="text"
                                name="line1"
                                className='p-1 border rounded-md'
                                placeholder='Address Line 1'
                                value={profileData.address.line1}
                                onChange={handleAddressChange}
                            />
                            <input
                                type="text"
                                name="line2"
                                className='p-1 border rounded-md'
                                placeholder='Address Line 2 (City, State)'
                                value={profileData.address.line2}
                                onChange={handleAddressChange}
                            />
                        </div>
                    ) : (
                        <p className='text-sm'>
                            {profileData.address.line1}
                            <br />
                            {profileData.address.line2}
                        </p>
                    )}
                </div>

                {/* --- Available Checkbox --- */}
                <div className='flex gap-1 pt-2'>
                    <input
                        type="checkbox"
                        name="available"
                        id="available"
                        checked={profileData.available}
                        onChange={(e) => isEdit && setProfileData(prev => ({ ...prev, available: e.target.checked }))}
                        readOnly={!isEdit}
                        disabled={!isEdit}
                        className={isEdit ? 'cursor-pointer' : 'cursor-not-allowed'}
                    />
                    <label htmlFor="available">Available</label>
                </div>

                {/* --- Edit/Save Button --- */}
                {isEdit ? (
                    <button
                        onClick={handleSave}
                        className='px-4 py-1 border border-primary text-sm rounded-full mt-5 bg-primary text-white hover:bg-primary-dark'
                    >
                        Save
                    </button>
                ) : (
                    <button
                        onClick={() => setIsEdit(true)}
                        className='px-4 py-1 border border-primary text-sm rounded-full mt-5'
                    >
                        Edit
                    </button>
                )}

            </div>
        </div>
    )
}

export default DoctorProfile