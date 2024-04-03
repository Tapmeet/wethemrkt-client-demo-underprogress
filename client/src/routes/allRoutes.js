import React from "react"
import { Redirect } from "react-router-dom"

// Profile
import UserProfile from "../pages/Authentication/user-profile"
import UserProfileIndex from "../components/CommonForBoth/UserProfile/index"
import PrivacyPolicyIndex from "../components/CommonForBoth/PrivacyPolicy/index"
import ContactUsIndex from "../components/CommonForBoth/ContactUs/index"

// Authentication related pages
import Logout from "../pages/Authentication/Logout"
import Error404Page from "../pages/Utility/pages-404"

// Dashboard
import UserDashboard from "../pages/ProfileDashboard/index"

import SavedPost from "../pages/SavedPost"

// Dashboard
import AdminLayout from "../pages/Admin/index"

// SymbolChartDashboard
import SymbolChartDashboard from "../pages/SymbolChartDashboard/index"
import SharedDashboard from "../pages/PostShared/index"
import LandingPage from "../pages/LandingPage/index"

import Blogpost from "../pages/Blog/blogpost"
import blogdetails from "../pages/Blog/blog-details"
import Watchlist from "../pages/Watchlist/watchlist"
import Leaderboard from "../pages/Leaderboard/index"
import NotificationList from "../pages/NotificationList/index"

const userRoutes = [
	// public
]

const authRoutes = [
	{ path: "/logout", component: Logout },
	{ path: "/admin", component: AdminLayout },
	// { path: "/admin" , component: AdminDashboard },
	{ path: "/feed", component: UserDashboard },
	{ path: "/saved-posts", component: SavedPost },
	// //profile
	{ path: "/profile/:username", exact: true, component: UserProfile },
	{ path: "/viewprofile/:username", exact: true, component: UserProfileIndex },
	{ path: "/blog", exact: true, component: Blogpost },
	{ path: "/blog-details", component: blogdetails },
	{ path: "/watchlist", exact: true, component: Watchlist },
	{ path: "/leaderboard", exact: true, component: Leaderboard },
	{ path: "/notification-list", exact: true, component: NotificationList },
]

const landingSymbolRoutes = [
	{ path: "/feed/:symbol", exact: true, component: SymbolChartDashboard },
	{ path: "/post/:postid", exact: true, component: SharedDashboard },
	{ path: "/", exact: true, component: LandingPage },
	{ path: "/privacy-policy", component: PrivacyPolicyIndex },
	{ path: "/contact-us", component: ContactUsIndex },
]

export { userRoutes, authRoutes, landingSymbolRoutes }
