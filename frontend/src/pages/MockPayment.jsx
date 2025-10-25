import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MockPayment = () => {
  const { appointmentId } = useParams()
  const { backendUrl, token } = useContext(AppContext)
  const navigate = useNavigate()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [name, setName] = useState('')
  const [cardType, setCardType] = useState('')

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } })
        if (data.success) {
          const apt = data.appointments.find(a => a._id === appointmentId)
          if (apt) {
            setAppointment(apt)
          } else {
            toast.error('Appointment not found')
            navigate('/my-appointments')
          }
        }
      } catch (error) {
        console.log(error)
        toast.error('Failed to load appointment details')
      } finally {
        setLoading(false)
      }
    }
    fetchAppointment()
  }, [appointmentId, backendUrl, token, navigate])

  const detectCardType = (number) => {
    const num = number.replace(/\s/g, '')
    if (num.startsWith('4')) return 'visa'
    if (num.startsWith('5') || num.startsWith('2')) return 'mastercard'
    if (num.startsWith('3')) return 'amex'
    return ''
  }

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
    setCardNumber(value)
    setCardType(detectCardType(value))
  }

  const validateCard = (cardNum, exp, cvv) => {
    const num = cardNum.replace(/\s/g, '')
    
    // Test scenarios
    if (num === '4111111111111111') return { valid: true, message: 'Payment successful' } // Visa success
    if (num === '5555555555554444') return { valid: true, message: 'Payment successful' } // Mastercard success
    if (num === '378282246310005') return { valid: true, message: 'Payment successful' } // Amex success
    
    if (num === '4000000000000002') return { valid: false, message: 'Insufficient funds' } // Visa decline
    if (num === '5105105105105100') return { valid: false, message: 'Card expired' } // Mastercard decline
    if (num === '371449635398431') return { valid: false, message: 'Invalid CVV' } // Amex decline
    
    // Default: check basic format
    if (num.length < 13 || num.length > 19) return { valid: false, message: 'Invalid card number' }
    if (!/^\d+$/.test(num)) return { valid: false, message: 'Card number must contain only digits' }
    
    // Check expiry
    const [month, year] = exp.split('/')
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1
    if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      return { valid: false, message: 'Card expired' }
    }
    
    // Check CVV
    if (cvv.length < 3 || cvv.length > 4) return { valid: false, message: 'Invalid CVV' }
    
    return { valid: true, message: 'Payment successful' }
  }

  // UI helpers
  const displayCardNumber = (value) => {
    const raw = value.replace(/\s/g, '')
    // Keep 16 chars for preview (works fine for Visa/Mastercard); Amex shown grouped by 4 as well
    const padded = (raw + '••••••••••••••••').slice(0, 16)
    return padded.replace(/(.{4})/g, '$1 ').trim()
  }

  const displayExpiry = (val) => {
    if (!val) return 'MM/YY'
    return val
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    if (!cardNumber || !expiry || !cvv || !name) {
      toast.error('Please fill all payment details')
      return
    }
    
    const validation = validateCard(cardNumber, expiry, cvv)
    if (!validation.valid) {
      toast.error(validation.message)
      return
    }
    
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/verify-payment`, { appointmentId })
      if (data.success) {
        toast.success(validation.message)
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error('Payment failed')
    }
  }

  const getCardLogo = (type) => {
    switch (type) {
      case 'visa':
        return 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg'
      case 'mastercard':
        return 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg'
      case 'amex':
        return 'https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg'
      default:
        return null
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-gray-600">Loading...</div>
  }

  if (!appointment) {
    return <div className="flex justify-center items-center min-h-screen">Appointment not found</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex justify-center items-center p-3">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-purple-500 to-indigo-700 drop-shadow-sm">
            Secure Mock Payment
          </h2>
          <div className="mt-3 flex items-center justify-center gap-3 text-gray-500">
            <span className="text-xs uppercase tracking-wider">We accept</span>
            {/* inline brand badges */}
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-[10px] font-semibold rounded bg-blue-50 text-blue-600 border border-blue-100">VISA</span>
              <span className="px-2 py-1 text-[10px] font-semibold rounded bg-purple-50 text-purple-600 border border-purple-100">Mastercard</span>
              <span className="px-2 py-1 text-[10px] font-semibold rounded bg-indigo-50 text-indigo-600 border border-indigo-100">AmEx</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Appointment summary */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-purple-100 p-5">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
              Appointment Details
            </h3>
            <div className="mt-4 space-y-2 text-sm">
              <p><span className="text-gray-500">Doctor:</span> <span className="font-medium text-gray-800">{appointment.docData.name}</span></p>
              <p><span className="text-gray-500">Speciality:</span> <span className="font-medium text-gray-800">{appointment.docData.speciality}</span></p>
              <p><span className="text-gray-500">Date:</span> <span className="font-medium text-gray-800">{appointment.slotDate}</span></p>
              <p><span className="text-gray-500">Time:</span> <span className="font-medium text-gray-800">{appointment.slotTime}</span></p>
              <div className="pt-2 mt-2 border-t">
                <p className="text-gray-500 text-sm">Amount</p>
                <p className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700">LKR. {appointment.amount}</p>
              </div>
            </div>
            <div className="mt-6 text-[11px] text-gray-500">
              You will be redirected back to your appointments after a successful payment.
            </div>
          </div>

          {/* Payment form + mock card */}
          <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-5">
            {/* Mock credit card preview */}
            <div className="mb-5">
              <div className="relative w-full h-32 rounded-xl p-4 overflow-hidden bg-gradient-to-br from-purple-700 via-purple-500 to-indigo-700 text-white shadow-lg">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.25),transparent_40%)]"></div>
                <div className="flex items-center justify-between">
                  <div className="text-xs tracking-widest uppercase/3 opacity-90">Mock Credit</div>
                  {/* dynamic brand logo via <img> if detected */}
                  {cardType && (
                    <img src={getCardLogo(cardType)} alt={cardType} className="h-6 w-auto opacity-90" />
                  )}
                </div>
                <div className="mt-4 text-base tracking-widest font-medium">
                  {displayCardNumber(cardNumber)}
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px]">
                  <div>
                    <div className="opacity-70">Card Holder</div>
                    <div className="font-semibold tracking-wide">{name || 'NAME'}</div>
                  </div>
                  <div className="text-right">
                    <div className="opacity-70">Expires</div>
                    <div className="font-semibold tracking-wide">{displayExpiry(expiry)}</div>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition px-3 py-2 pr-12 text-sm"
                    maxLength="19"
                    required
                  />
                  {cardType && (
                    <img
                      src={getCardLogo(cardType)}
                      alt={cardType}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8"
                    />
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-gray-500">
                  Accepted:
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">VISA</span>
                  <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-600 border border-purple-100">Mastercard</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100">AmEx</span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition px-3 py-2 text-sm"
                    maxLength="5"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    className="w-full rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition px-3 py-2 text-sm"
                    maxLength="4"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition px-3 py-2 text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-purple-700 via-purple-500 to-indigo-700 text-white font-semibold py-2.5 shadow-md hover:shadow-lg transition active:scale-[0.99]"
              >
                Complete Payment
              </button>
            </form>

            {/* Test cards */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="font-semibold mb-2 text-gray-800">Test Card Numbers</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-green-600 font-medium mb-1">Success</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>Visa: 4111 1111 1111 1111</li>
                    <li>Mastercard: 5555 5555 5555 4444</li>
                    <li>Amex: 3782 8224 6310 005</li>
                  </ul>
                </div>
                <div>
                  <p className="text-red-600 font-medium mb-1">Failure</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>Visa: 4000 0000 0000 0002 (Insufficient funds)</li>
                    <li>Mastercard: 5105 1051 0510 5100 (Expired)</li>
                    <li>Amex: 3714 4963 5398 431 (Invalid CVV)</li>
                  </ul>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 mt-3">This is a mock gateway for demonstration only.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MockPayment