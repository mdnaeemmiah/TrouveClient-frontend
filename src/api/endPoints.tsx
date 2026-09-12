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
  updateProfile:"/users/me",

  popularCategories: "/categories/popular",
  categories: "/categories",

  postFeed: "/posts",
  getNewsFeed: "/posts",
  getMyPosts: "/posts/my-posts",
  followingPosts: "/posts/following-feed",
  likePost: (postId: any) => `/posts/${postId}/like`,
  reportPost: (postId: any) => `/posts/${postId}/report`,
  totalFollower:"/businesses/my-profile/followers",


  getView: (postId: string) => `/posts/${postId}`,
  countView: (postId: string) => `/posts/${postId}/view`,
  remindPost: `/posts/reminders`,
  myReminders: `/posts/reminders/my-reminders`,
  deleteReminder: (reminderId: string) => `/posts/reminders/${reminderId}`,

  businessRegistration: "/businesses",
  updateBusinessProfile:"/businesses/my-profile",
  getMyProfileBusinesses: "/businesses/my-profile",
  getBusinesses: "/businesses",
  getBusinessById: (slug: string) => `/businesses/${slug}`,
  followBusiness: (businessId: string) => `/businesses/${businessId}/follow`,
  saveBusiness: (businessId: string) => `/businesses/${businessId}/save`,
  profileTracking: (businessId: string) => `/businesses/${businessId}/track-action`,
  getSavedBusinesses: "/users/me/saved-businesses",

  storageUpload: "/storage/upload",
  multipartUpload: "/storage/upload-multiple",

  getAllBusinesses: "/admin/businesses",
  getSingleBusiness: (businessId: string) => `/admin/businesses/${businessId}`,
  updateStatus: (businessId: string) =>`/admin/businesses/${businessId}/status`,

  searchBusinesses: "/ai/search",
  compareBusinesses: "/ai/compare",
  historyMarketing: "/marketing/history",
  marketing:"/ai/marketing",

  bookings: "/bookings",
  bookingRequests: "/bookings/my-requests",
  getBookings: "/bookings/my-history",
  recentlyVisited: "/businesses/recent-visits",
  postReview: "/reviews",
  getReviews: "/reviews/my-reviews",

  getReviewById: (reviewId: string) => `/reviews/business/${reviewId}`,
  updateReviews:(reviewId: string) => `/reviews/${reviewId}`,
  deleteReview: (reviewId: string) => `/reviews/${reviewId}`,
  replyCustomerReview: (reviewId: string) => `/reviews/${reviewId}/reply`,

  getMyProfileBussinesses: "/businesses/my-profile",
  pendingApproval: "/businesses/admin/pending",
   

  adminDashboard: "/admin/dashboard",
  adminAnalytics: "/admin/analytics",
  allBusinessesProfile: "/admin/businesses",
  stateAdmin: "/admin/users/stats",
  allUsers: "/admin/users",
  UserDetails: (userId: string) => `/admin/users/${userId}`,
  userDelete: (userId: string) => `/admin/users/${userId}`,
  ChangeUserStatus: (userId: string) => `/admin/users/${userId}/status`,

  ModerationPosts: "/admin/reports/posts",
  singleGetReport: (reportId: string) => `/admin/reports/posts/${reportId}`,
  actionReport: (reportId: string) => `/admin/reports/posts/${reportId}/action`,
  deleteReport: (reportId: string) => `/admin/reports/posts/${reportId}/post`,

  adminTrash: "/admin/trash",
  trashDetails: (trashId: string) => `/admin/trash/${trashId}`,
  restoreTrash: (trashId: string) => `/admin/trash/${trashId}/restore`,

  businessAnalytics: `/businesses/my-profile/analytics`,
  reputationCenter: `/reviews/reputation-center`,
  aiMarketing: `/ai/marketing`,
  marketingHistory: `/ai/marketing/history`,

  createCategory:"/categories",
  updateCategory:(Id: string) =>  `/categories/${Id}`,
  deleteCategory:(Id: string) =>  `/categories/${Id}`,
  requestCategory:"/categories/admin/requests",

  careteRequestCategory:"/categories/requests",
  CategoryReview:(Id: string) => `/categories/admin/requests/${Id}`,


  createBookingTemplete: (slug: string) => `/categories/${slug}/booking-template`,
  getBookingTemplete: (slug: string) => `/categories/${slug}/booking-template`,

  createBookingConfig:"/businesses/my-profile/booking-config",
  getBookingConfig:"/businesses/my-profile/booking-config",



};
