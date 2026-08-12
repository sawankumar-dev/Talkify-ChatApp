import config from "../config/config.js";
import authService from "../services/auth.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
    const {user, refreshToken, accessToken} = await authService.registerUser(req.body);
    return res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000
    }).cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    .status(201)
    .json(new ApiResponse(201, { user }, "User registered successfully"));
})
export const login = asyncHandler(async (req, res) => {
    const { 
        user, 
        accessToken, 
        refreshToken 
    } = await authService.loginUser(req.body);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
    }).cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }).status(200).json(new ApiResponse(200, { user }, "Login successful"))
});
export const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user: req.user,
            },
            "Current user fetched successfully"
        )
    )
})

export const logout = asyncHandler(async (req, res) => {
    await authService.logoutUser(req.user._id);
    return res.clearCookie("accessToken", {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: "lax",
    }).clearCookie("refreshToken", {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "lax",
    }).status(200).json(new ApiResponse(200,null, "Logout successful"))
})
export const refreshToken = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;
    const { accessToken, refreshToken: newRefreshToken } = await authService.refreshAccessToken(token);
    return res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }).status(200).json(new ApiResponse(200, null, "Access token refreshed successfully!"))
})








