import UserModel from "../model/User.models.js"; 


const generateAccessAndRefreshTokens = async (userID) => {
  try {
    const user = await UserModel.findById(userID)

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false}) 

    return {accessToken, refreshToken}

  } catch (error) {
    throw new ApiError(500, "Something wend wrong while generating access and refresh token")
  }
}


const register = async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await UserModel.findOne({email});

    if (existingUser) {
      return res.json(
        {
          success: false,
          message: 'User already Exists',
        },
        { status: 400 }
      );
    }

      const user = await UserModel.create({
        username,
        email,
        password,
      });

      if (!user) {
        return res.json(
          {
            success: false,
            message: "Error registering user | Try registering again !",
          },
          { status: 500 }
        );
      }

      const { accessToken } = await generateAccessAndRefreshTokens(user?._id) 
      
      const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      }
  
      return res.status(200) 
        .cookie('accessToken', accessToken, options)
        .json({
            success: true,
            message: 'User registered successfully.',
            data: { user, accessToken }
        }
      );
}


const login = async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
      throw new ApiError(400, "username or email is required")
    }

    const user = await UserModel.findOne({ email })

    if (!user) {
      throw new ApiError(404, "User does not exist")
    }

    const isPaswordValidate = await user.isPasswordCorrect(password)

    if (!isPaswordValidate) {
      throw new ApiError(404, "User password does not matched")
    }

    const {accessToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await UserModel.findById(user._id).select("-password -refreshToken")

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
  }

  return res.status(200)
    .cookie('accessToken', accessToken, options)
    .json(
        {
          user: loggedInUser, 
          accessToken
        },
        "User logged In successFully"
    )
}


const currentUser = async (req, res) => {
  const user = req.user;

  return res.status(200)
        .json({
        success: true,
        message: "Get current User Successfully",
        data: user, 
    })
}



const logoutUser = async (req, res) => {
    await UserModel.findByIdAndUpdate(
      req.user?._id,
      {
        $unset: {
          refreshToken: 1
        }
      },
      {
        new: true
      }
  )

  const options = {
      httpOnly: true,
      secure: true
  }

    return res.status(200)
          .clearCookie("accessToken", options)
          .json({
            success: false,
            message: "User Logged used successfully"
          })
} 



export { register, login, logoutUser, currentUser}