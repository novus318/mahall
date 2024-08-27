import React from 'react'

interface PageProps {
    params: {
      pid: string
    }
  }
const PageComponent = ({ params }: PageProps) => {
    const { pid } = params  
  return (
    <div>
        <h1>Hello, Next.js {pid}!</h1>
    </div>
  )
}

export default PageComponent
