import Search from '@/src/components/home/Search'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <div>
      <Suspense fallback={<div className="min-h-screen bg-[#f7f7fa] flex items-center justify-center">Loading search...</div>}>
        <Search />
      </Suspense>
    </div>
  )
}
