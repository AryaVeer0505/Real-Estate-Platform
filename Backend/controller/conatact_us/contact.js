const Contact = require("../../Models/contact.model"); 

const contact= async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const newContact = new Contact({ 
            name, 
            email, 
            message 
        });

        await newContact.save(); 

        res.status(200).json({ message: "Contact saved successfully!" });

    } catch (error) {
        res.status(400).json({ error: "Failed to save contact." });
    }
};

module.exports = contact;
