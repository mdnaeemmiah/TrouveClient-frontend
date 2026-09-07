export const ENDPOINTS = {
  BASEURL: process.env.NEXT_PUBLIC_API_URL,

  // Auth
  register: "/auth/register",
  verifyEmail: "/auth/verify-otp",
  resentCode: "/auth/resend-otp",
  login: "/auth/login",
  refreshToken: "/auth/refresh-token",
  forgetPassword: "/auth/forgot-password",
  verifyPasswordCode: "/auth/verify-reset-otp",
  resetPassword: "/auth/reset-password",
  changePassword: "/auth/change-password",
  logout: "/auth/logout",

  getUserProfile: "/users/me",
  popularCategories: "/categories/popular",
  categories: "/categories",
  getNewsFeed: "/posts",

  businessRegistration: "/businesses",
  storageUpload: "/storage/upload",
  
};
