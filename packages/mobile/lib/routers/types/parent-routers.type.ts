import { AppRouter } from '../app-router'
import { OnboardingRouter } from '../onboarding-router'
import { DashboardRouter } from '../dashboard-router'

export type ParentRouter = AppRouter | OnboardingRouter | DashboardRouter
