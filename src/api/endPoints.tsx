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
  deleteReminder: (reminderId: string) => `/posts/reminders/${reminderId}`,

  businessRegistration: "/businesses",
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

  bookings: "/bookings",
  bookingRequests: "/bookings/my-requests",
  getBookings: "/bookings/my-history",
  recentlyVisited: "/businesses/recent-visits",
  postReview: "/reviews",
  getReviews: "/reviews/my-reviews",
  getReviewById: (reviewId: string) => `/reviews/business/${reviewId}`,
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

  businessAnalytics: `/business/my-profile/analytics`,
  reputationCenter: `/reviews/reputation-center`,
  aiMarketing: `/ai/marketing`,
  marketingHistory: `/ai/marketing/history`,

};
