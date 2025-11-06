import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthLayout } from '@layouts/AuthLayout'
import { MainLayout } from '@layouts/MainLayout'

// Auth Pages
import LoginPage from '@pages/auth/LoginPage'
import AutoLoginPage from '@pages/auth/AutoLoginPage'
import CallbackLoginPage from '@pages/auth/CallbackLoginPage'
import ForgotPasswordPage from '@pages/ForgotPasswordPage'
import ChangePasswordPage from '@pages/auth/ChangePasswordPage'

// Main Pages
import HomePage from '@pages/home/HomePage'
import NotFoundPage from '@pages/NotFoundPage'
import LeaderboardsPage from '@pages/leaderboards/LeaderboardsPage'
import ProfilePage from '@pages/profile/ProfilePage'
import ReviewPage from '@pages/review/ReviewPage'

// Journey Pages
import LearningJourneyPage from '@pages/LearningJourneyPage'
import JourneyDetailPage from '@pages/journey/JourneyDetailPage'
import CourseDetailPage from '@pages/journey/CourseDetailPage'
import ModuleDetailPage from '@pages/journey/ModuleDetailPage'
import SCORMPlayerPage from '@pages/journey/SCORMPlayerPage'

// Journey Layout
import { LearningJourneyLayout } from '@pages/journey/layouts'

// Help Public Pages
import HelpPublicPage from '@pages/help-public/HelpPublicPage'
import FAQPage from '@pages/help-public/topics/FAQPage'
import LoginHelpPage from '@pages/help-public/topics/LoginHelpPage'
import PrivacyPolicyPage from '@pages/help-public/topics/PrivacyPolicyPage'

// Protected Route Component
import { ProtectedRoute } from '@components/auth/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'auto-login',
        element: <AutoLoginPage />,
      },
      {
        path: 'callback',
        element: <CallbackLoginPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'change-password',
        element: <ChangePasswordPage />,
      },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: 'leaderboards',
        element: <LeaderboardsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'review',
        element: <ReviewPage />,
      },
      {
        path: 'review/module/:moduleId/:journeyId',
        element: <ReviewPage />,
      },
      {
        path: 'journey',
        element: <LearningJourneyPage />,
      },
      {
        path: 'journey/:journeyId',
        element: <LearningJourneyLayout />,
        children: [
          {
            index: true,
            element: <JourneyDetailPage />,
          },
          {
            path: 'course/:courseId',
            element: <CourseDetailPage />,
          },
          {
            path: 'course/:courseId/module/:moduleId',
            element: <ModuleDetailPage />,
          },
          {
            path: 'course/:courseId/module/:moduleId/play',
            element: <SCORMPlayerPage />,
          },
        ],
      },
      // Add more protected routes here
    ],
  },
  {
    path: '/help-public',
    element: <HelpPublicPage />,
    children: [
      {
        path: 'faq',
        element: <FAQPage />,
      },
      {
        path: 'login',
        element: <LoginHelpPage />,
      },
      {
        path: 'privacypolicy',
        element: <PrivacyPolicyPage />,
      },
      // TODO: Add remaining 8 topic pages:
      // - profile
      // - mylearningjourney
      // - learningactivity
      // - learningpoint
      // - supervisorreviewer
      // - datasecurity
      // - others
      // - termofservice
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router
