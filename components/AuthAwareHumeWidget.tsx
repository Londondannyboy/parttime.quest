'use client'

import { useUser } from '@stackframe/stack'
import { HumeWidget, HumeWidgetProps } from './HumeWidget'

interface AuthAwareHumeWidgetProps extends Omit<HumeWidgetProps, 'isAuthenticated' | 'userName'> {}

export function AuthAwareHumeWidget(props: AuthAwareHumeWidgetProps) {
  // Try to get the current user - returns null if not authenticated
  const user = useUser()

  const isAuthenticated = !!user
  const userName = user?.displayName?.split(' ')[0] || undefined

  return (
    <HumeWidget
      {...props}
      isAuthenticated={isAuthenticated}
      userName={userName}
    />
  )
}
