import jwt from 'jsonwebtoken'

// user authentication middleware 
const authUser = async (req, res, next) => {
    try {
        // Accept either custom 'token' header or standard 'Authorization: Bearer <token>'
        const authHeader = req.headers.authorization || ''
        const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined
        const token = bearerToken || req.headers.token

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized. Please login.' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Ensure req.body exists for routes like GET that may not have a body
        if (!req.body) req.body = {}

        // Attach user id for downstream handlers (backward compat with existing controllers)
        req.userId = decoded.id
        req.body.userId = decoded.id // because we add the _id as the token key

        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({ success: false, message: error.message })
    }
}

export default authUser