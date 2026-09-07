import VerifyEmail from '@/src/components/auth/VerifyEmail'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <div>
      <Suspense fallback={null}>
        <VerifyEmail />
      </Suspense>
    </div>
  )
}
