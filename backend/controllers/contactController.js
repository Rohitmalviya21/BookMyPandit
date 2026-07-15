const contactSchema = require('../model/contactSchema')

const createContact = async (req, res) => {
    const { name, email, subject, message } = req.body
    try {
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                msg: 'All filed are required'
            })
        }
        const contact = new contactSchema({
            name,
            email,
            subject,
            message
        })

        await contact.save()

        res.status(201).json({
            msg: 'Message sent successfully'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:'internal error'
        })

    }
}

module.exports = {createContact}