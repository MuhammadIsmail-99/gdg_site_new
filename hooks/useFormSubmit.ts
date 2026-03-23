'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function useFormSubmit<T>(
  submitFn: (data: T) => Promise<Response>
) {
  const [status,  setStatus]  = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [result,  setResult]  = useState<unknown>(null)

  async function submit(data: T) {
    setStatus('loading')
    setMessage('')
    try {
      const res  = await submitFn(data)
      const json = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(json.error ?? 'Something went wrong.')
      } else {
        setStatus('success')
        setResult(json)
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return {
    status,
    message,
    result,
    submit,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError:   status === 'error',
  }
}
