import { Outlet } from 'react-router-dom'

import { Header } from '@/components/shared/Header'

export function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}