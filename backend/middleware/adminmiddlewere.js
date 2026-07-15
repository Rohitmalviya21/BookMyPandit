const adminMiddleware = (req, res, next) => {

    try {

        if (req.user.role !== 'admin') {

            return res.status(403).json({
                msg: "Access denied. Admin only"
            })
        }

        next()

    } catch (err) {

        return res.status(401).json({
            msg: "Unauthorized access"
        })
    }
}

module.exports = adminMiddleware