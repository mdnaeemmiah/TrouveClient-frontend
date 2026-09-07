import VerifyCode from '@/src/components/auth/VerifyCode'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <div>
      <Suspense fallback={null}>
        <VerifyCode />
      </Suspense>
    </div>
  )
}
