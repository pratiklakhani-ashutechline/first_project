const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({ message: "No token, access denied" });
        }

        // Remove "Bearer "
        const actualToken = token.replace("Bearer ", "");

        // Verify token
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

        // Attach user to request
        req.user = decoded;

        next(); // go to next route

    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = auth;