import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useState } from 'react'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

import { PublicNotesPage } from './components/PublicNotesPage'
import { MyNotesPage } from './components/MyNotesPage'
import Sidebar from './components/Sidebar'
import LoginModal from './components/LoginModal'
import { AuthProvider, useAuth } from './contexts/AuthContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Корневой компонент с сайдбаром и модальным окном
function RootComponent() {
  const { isAuthenticated, logout } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const handleLogin = () => {
    setIsLoginModalOpen(true)
  }

  const handleLogout = () => {
    logout()
  }

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Тулбар */}
      <Sidebar 
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Основной контент */}
      <div className="ml-64 relative z-10">
        <Outlet />
      </div>

      {/* Модальное окно входа */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
      />
      
      <TanStackRouterDevtools />
    </div>
  )
}

const rootRoute = createRootRoute({
  component: RootComponent,
})

// Создаем роут для главной страницы (публичные заметки)
const publicNotesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: PublicNotesPage,
})

// Создаем роут для страницы "Мои заметки"
const myNotesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-notes',
  component: MyNotesPage,
})

// Создаем роутер
const routeTree = rootRoute.addChildren([publicNotesRoute, myNotesRoute])

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
