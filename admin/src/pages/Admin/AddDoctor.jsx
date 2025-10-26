import React, { useContext, useState } from 'react'
import assets from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { FiPlus, FiUpload } from 'react-icons/fi'

const AddDoctor = () => {

  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')

  const { backendUrl, aToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (!docImg) {
        return toast.error("image not selected")
      }

      const formData = new FormData()
      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))


      // console log formdata
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      })

      const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })

      if (data.success) {
        toast.success(data.message)
        setDocImg(false)
        setName('')
        setPassword('')
        setEmail('')
        setAddress1('')
        setAddress2('')
        setDegree('')
        setAbout('')
        setFees('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error) // This might be toast.error(error.message) in a real app, but I'm transcribing what's shown
      console.log(error)
    }
  }

    return (
      <form onSubmit={onSubmitHandler} className="m-5 w-full max-w-5xl">
        {/* Card wrapper */}
        <div className="rounded-2xl p-[1.5px] bg-gradient-to-tr from-primary-200/50 via-primary-300/40 to-primary-500/40 shadow-md">
          <div className="bg-white rounded-2xl overflow-hidden ring-1 ring-black/5">
            {/* Title */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-2">
                <FiPlus className="text-primary-600" size={20} />
                <p className="font-semibold text-gray-800">Add Doctor</p>
              </div>
            </div>

            <div className="px-6 py-6 max-h-[80vh] overflow-y-auto">
              {/* Upload area */}
              <div className="flex items-center gap-4 mb-8 text-gray-600">
                <label htmlFor="doc-img" className="relative inline-block">
                  <img
                    className="w-16 h-16 rounded-full object-cover bg-gray-100 ring-1 ring-black/5 cursor-pointer"
                    src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                    alt="Doctor avatar"
                  />
                  <span className="absolute -bottom-1 -right-1 inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-600 text-white ring-2 ring-white">
                    <FiUpload size={14} />
                  </span>
                </label>
                <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
                <p className="text-sm">
                  Upload doctor<br />picture
                </p>
              </div>

              {/* Two column details */}
              <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-700">
                {/* Left column */}
                <div className="w-full lg:flex-1 flex flex-col gap-4">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Doctor name</label>
                    <input onChange={(e) => setName(e.target.value)} value={name} className="rounded-xl border border-gray-200 px-3 py-2 ring-1 ring-black/5 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200/70" type="text" placeholder="Name" required />
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Doctor Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className="rounded-xl border border-gray-200 px-3 py-2 ring-1 ring-black/5 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200/70" type="email" placeholder="Email" required />
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Doctor Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} className="rounded-xl border border-gray-200 px-3 py-2 ring-1 ring-black/5 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200/70" type="password" placeholder="Password" required />
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Experience</label>
                    <select onChange={(e) => setExperience(e.target.value)} value={experience} className="rounded-xl border border-gray-200 px-3 py-2 ring-1 ring-black/5 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200/70">
                      <option value="1 Year">1 Year</option>
                      <option value="2 Year">2 Year</option>
                      <option value="3 Year">3 Year</option>
                      <option value="4 Year">4 Year</option>
                      <option value="5 Year">5 Year</option>
                      <option value="6 Year">6 Year</option>
                      <option value="7 Year">7 Year</option>
                      <option value="8 Year">8 Year</option>
                      <option value="9 Year">9 Year</option>
                      <option value="10+ Year">10+ Year</option>
                    </select>
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Fees</label>
                    <input onChange={(e) => setFees(e.target.value)} value={fees} className="rounded-xl border border-gray-200 px-3 py-2 ring-1 ring-black/5 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200/70" type="number" placeholder="fees" required />
                  </div>
                </div>

                {/* Right column */}
                <div className="w-full lg:flex-1 flex flex-col gap-4">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Speciality</label>
                    <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className="rounded-xl border border-gray-200 px-3 py-2 ring-1 ring-black/5 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200/70">
                      <option value="General physician">General physician</option>
                      <option value="Gynecologist">Gynecologist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Pediatricians">Pediatricians</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Gastroenterologist">Gastroenterologist</option>
                    </select>
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Education</label>
                    <input onChange={(e) => setDegree(e.target.value)} value={degree} className="rounded-xl border border-gray-200 px-3 py-2 ring-1 ring-black/5 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200/70" type="text" placeholder="Education" required />
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Address</label>
                    <input onChange={(e) => setAddress1(e.target.value)} value={address1} className="rounded-xl border border-gray-200 px-3 py-2 ring-1 ring-black/5 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200/70" type="text" placeholder="address line 1" required />
                    <input onChange={(e) => setAddress2(e.target.value)} value={address2} className="rounded-xl border border-gray-200 px-3 py-2 ring-1 ring-black/5 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200/70" type="text" placeholder="address line 2" required />
                  </div>
                </div>
              </div>

              {/* About and submit */}
              <div className="mt-6">
                <label className="mb-2 block text-xs text-gray-500">About Doctor</label>
                <textarea onChange={(e) => setAbout(e.target.value)} value={about} className="w-full px-4 pt-2 rounded-xl border border-gray-200 ring-1 ring-black/5 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200/70" placeholder="write about doctor details" rows={5} required />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-sm ring-1 ring-black/5 transition-all duration-200 transform hover:-translate-y-[1px] hover:shadow-lg hover:from-primary-500 hover:to-primary-400 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                >
                  <FiPlus size={18} /> Add Doctor
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }

  export default AddDoctor