import jwt from 'jsonwebtoken'

const authDoctor = async (req, res, next) => {
  try {
    const token = req.headers.token
    if (!token) {
      return res.json({ success: false, message: 'Not authorized, token missing' })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.docId = decoded.id
    next()
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export default authDoctor
