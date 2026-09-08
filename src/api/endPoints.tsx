/* eslint-disable @typescript-eslint/no-explicit-any */
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

  postFeed: "/posts",
  getNewsFeed: "/posts",
  getMyPosts: "/posts/my-posts",
  followingPosts: "/posts/following-feed",
  likePost: (postId: any) => `/posts/${postId}/like`,
  reportPost: (postId: any) => `/posts/${postId}/report`,
  
  remindPost: `/posts/reminders`,
  myReminders: `/posts/reminders/my-reminders`,

  businessRegistration: "/businesses",
  getBusinesses: "/businesses",
  followBusiness: (businessId: string) => `/businesses/${businessId}/follow`,

  storageUpload: "/storage/upload",
  multipartUpload: "/storage/upload-multiple",


  getAllBusinesses: "/admin/businesses",
  getSingleBusiness: (businessId: string) => `/admin/businesses/${businessId}`,
  updateStatus: (businessId: string) => `/admin/businesses/${businessId}/status`,


};
