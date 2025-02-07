const jwt = require('jsonwebtoken');

const checkAdminAuth = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_ADMIN_JWT);
        if (decodedToken.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admin access only' });
        }

        req.admin = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = checkAdminAuth;