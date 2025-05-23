import { Email } from "../model/Email.model.js";
import { model } from "../index.js";

const generateEmail = async (req, res) => {
  try {
    const { prompt, userId } = req.body;

    if (!userId) {
        return res.status(500).json({
          success: false,
          message: "Userid is not provided",
        },
      );
    }

    const systemPrompt = `You are an expert in crafting high-converting cold emails.
      Generate a professional cold email based on the user's input with the following guidelines:
      - Keep it concise, engaging, and to the point
      - Maintain a professional and respectful tone
      - Include a clear and compelling call to action
      Do include any additional suggestions, explanations, or content beyond the email itself at the end of the generated email & do not use words like here is your generated email & all the related words, just additional suggestions, explanations, or content, these 3 things are needed. 
      
      For the additional suggestions section:
      - Use proper bullet points (•) instead of asterisks (*) 
      - For emphasis, use markdown bold formatting (**bold text**) for titles or key points only
      - Keep the rest of the text normal without formatting
      - Example: Instead of "**Title**: content" use "• Title: content"
      - Format important points with bold text and normal descriptions`;

    const result = await model.generateContent({
      contents: [
        {
          parts: [{ text: systemPrompt + prompt }]
        },
      ],
    });

    const fullEmail = result?.response?.text();

    const email = await Email.create({
        prompt,
        generatedEmail: fullEmail,
        userId
    });

    if (!email) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate email',
      });
    }

    return res.status(200).json({
      success: true,
      fullEmail,
      emailId: email?._id
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate email',
    });
  }
} 



const updateEmail = async (req, res) => {
  try {
    const { baseEmail, modifications, emailId } = req.body  

    if (!emailId) {
      return res.status(500).json({
        success: false,
        message: "Email Id is not provided",
      },
    );
  }
    
    const systemPromptForUpdate = `You are an expert at writing high-converting cold emails. 
    Your task is to update the following email based on the user's modifications while maintaining its professional quality.
    
    Base Email: ${baseEmail}
    Modifications: ${modifications}
    
    Guidelines for your updated email:
    - Keep it concise, engaging, and to the point
    - Maintain a professional and respectful tone
    - Include a clear and compelling call to action
    
    After the updated email, include additional suggestions, explanations, or content that might help the user further improve their email. Do not use introductory phrases like "here is your updated email" or similar wording.
    
    For the additional suggestions section:
    - Use proper bullet points (•) instead of asterisks (*) 
    - For emphasis, use markdown bold formatting (**bold text**) for titles or key points only
    - Keep the rest of the text normal without formatting
    - Example: Instead of "**Title**: content" use "• Title: content"
    - Format important points with bold text and normal descriptions`;

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPromptForUpdate }]
        },
      ],
    })

    const updatedEmail = result.response.text();

    const findPromptAndAddToChat = await Email.findOneAndUpdate(
      { _id: emailId, userId: req.user._id},
      {
        $push: {
          chatEmails: {
            prompt: modifications,
            generatedEmail: updatedEmail,
          }
        }
      }    
    )

    if (!findPromptAndAddToChat) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate email and update email',
      });
    }

    return res.status(200).json({
      success: true,
      updatedEmail,
    }, 
  );

  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to generate email',
      });
  }
}


export { generateEmail, updateEmail }