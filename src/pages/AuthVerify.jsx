import React from 'react'
import { useSearchParams } from 'react-router-dom'

function AuthVerify() {
    const [params] = useSearchParams()
    const secret = params.get('secret')
    const id = params.get('userId')
  return (
    <div>AuthVerify</div>
  )
}

export default AuthVerify