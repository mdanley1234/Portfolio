// mdx-components/DemoBanner.tsx
"use client"

import React from "react"

export default function DemoBanner({ message }: { message: string }) {
  return (
    <div style={{ borderLeft: "4px solid #f59e0b", padding: 12, background: "#fff7ed" }}>
      <strong>Note:</strong> {message}
    </div>
  )
}
