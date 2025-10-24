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
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!appointment) {
    return <div className="flex justify-center items-center min-h-screen">Appointment not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Mock Payment Gateway</h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Appointment Details</h3>
          <p><strong>Doctor:</strong> {appointment.docData.name}</p>
          <p><strong>Speciality:</strong> {appointment.docData.speciality}</p>
          <p><strong>Date:</strong> {appointment.slotDate}</p>
          <p><strong>Time:</strong> {appointment.slotTime}</p>
          <p><strong>Amount:</strong> ${appointment.amount}</p>
        </div>
        <form onSubmit={handlePayment}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Card Number</label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="w-full p-2 border border-gray-300 rounded pr-12"
                maxLength="19"
                required
              />
              {cardType && (
                <img
                  src={getCardLogo(cardType)}
                  alt={cardType}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8"
                />
              )}
            </div>
          </div>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                className="w-full p-2 border border-gray-300 rounded"
                maxLength="5"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                className="w-full p-2 border border-gray-300 rounded"
                maxLength="4"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Cardholder Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Complete Payment
          </button>
        </form>
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h4 className="font-semibold mb-2">Test Card Numbers:</h4>
          <p className="text-sm text-green-600 mb-1"><strong>Success:</strong></p>
          <ul className="text-xs mb-2">
            <li>Visa: 4111 1111 1111 1111</li>
            <li>Mastercard: 5555 5555 5555 4444</li>
            <li>Amex: 3782 8224 6310 005</li>
          </ul>
          <p className="text-sm text-red-600 mb-1"><strong>Failure:</strong></p>
          <ul className="text-xs">
            <li>Visa: 4000 0000 0000 0002 (Insufficient funds)</li>
            <li>Mastercard: 5105 1051 0510 5100 (Expired)</li>
            <li>Amex: 3714 4963 5398 431 (Invalid CVV)</li>
          </ul>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          This is a mock payment gateway for demonstration purposes only.
        </p>
      </div>
    </div>
  )
}

export default MockPayment