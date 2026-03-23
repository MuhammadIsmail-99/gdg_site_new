'use server'

import { signIn, signOut, auth } from '@/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      email:    formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    })

    const session = await auth()
    const role = session?.user?.role

    if (role === 'admin') redirect('/admin')
    if (role === 'core')  redirect('/core')
    redirect('/dashboard')

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid email or password.'
        default:
          return 'Something went wrong.'
      }
    }
    // Very important: Re-throw the error if it's a redirect,
    // so Next.js can handle it correctly.
    const errorMessage = (error as any).message;
    if (errorMessage && errorMessage.includes('NEXT_REDIRECT')) {
      throw error;
    }
    throw error
  }
}

export async function logout() {
  await signOut({ redirectTo: '/' })
}
