import { Contact } from "../model/Contact.model.js";


const contact = async (req, res) => {

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.json(
      {
        success: false,
        message: 'All fields are required',
      },
      { status: 400 }
    );
  }

    const newContactMessage = await Contact.create({
      name,
      email,
      message,
    });

    if (!newContactMessage) {
      return res.json(
        {
          success: false,
          message: "Error sending message | Try registering again !",
        },
        { status: 500 }
      );
    }

    return res.status(200) 
          .json({
          success: true,
          message: 'Message sent successfully.',
      }
    );
}

export { contact }