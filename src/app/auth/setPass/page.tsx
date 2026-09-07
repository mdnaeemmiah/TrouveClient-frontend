import SetPass from '@/src/components/auth/SetPass'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <div>
      <Suspense fallback={null}>
        <SetPass />
      </Suspense>
    </div>
  )
}
