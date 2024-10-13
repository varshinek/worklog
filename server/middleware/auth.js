const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Store user information in the request for use in other routes
        req.user = { id: decoded.id, isAdmin: decoded.isAdmin, role: decoded.role }; // Assuming the token contains a role field
        next();
    });
};

module.exports = verifyToken;
