"use client";
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';

export default function SignInPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)

  const handleGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options:
        {
          redirectTo: `${window.location.origin}/dashboard`
        }
    });
  }

  const handleApple = () => {
    supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
  }

  const handleEmailSignUp = async () => {
    // Check if user exists using the RPC
    const { data: exists, error: rpcError } = await supabase.rpc('check_user_exists', { email_input: email });
    if (rpcError) {
      setMessage({ type: 'error', text: 'Error checking user: ' + rpcError.message });
      return;
    }
    if (exists) {
      setMessage({ type: 'error', text: 'An account with this email already exists. Please log in or use a different email.' });
      return;
    }
    // Proceed with sign up
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: 'Sign up successful! Please check your email to verify your account before proceeding.' });
    }
  }

  
  return (
    <div className="min-h-screen relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(/loginPageBackground.png)' }}>
      {/* Navigation Header */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 bg-[#1A3A43]">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 relative">
            <Image
              src="/7af5f81692dac3589195d75e0f337f9c427252c1.png"
              alt="SlatePath Logo"
              layout="fill"
              objectFit="contain"
              className="rounded-md"
            />
          </div>
          <span className="text-white font-semibold text-lg">SlatePath</span>
        </div>
        <div className="hidden md:flex items-center space-x-6 ml-auto mr-20">
          <a href="#" className="text-white hover:text-teal-200 transition-colors">
            Home
          </a>
          <a href="#" className="text-white hover:text-teal-200 transition-colors">
            Highschool
          </a>
          <a href="#" className="text-white hover:text-teal-200 transition-colors mr-0">
            College
          </a>
        </div>
        <Link href="/login" className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2 rounded-lg transition-colors">
          Login
        </Link>
      </nav>
      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-4">
        <div className="bg-gray-100 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-black/30">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 relative">
                <Image
                    src="/7af5f81692dac3589195d75e0f337f9c427252c1.png"
                    alt="SlatePath Logo"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md"
                />
            </div>
          </div>
          {/* Login Title */}
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">Login</h1>
          {/* Login Form */}
          <form className="space-y-4 mb-6" onSubmit={e => { e.preventDefault(); handleEmailSignUp(); }}>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black shadow-md shadow-black/20"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black shadow-md shadow-black/20"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-full transition-colors shadow-md shadow-black/20">
              Sign Up
            </button>
          </form>
          {/* Sign up link */}
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm">
              {"Already have an account? "}
                <Link href="/login" className="text-teal-600 hover:text-teal-700 underline font-medium">
                  Login
                </Link>
            </p>
          </div>
          {/* Social Signup Buttons */}
          <div className="space-y-3">
            <button type="button" onClick={handleGoogle} className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors shadow-md shadow-black/20">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 font-medium">Continue with Google</span>
            </button>
            <button type="button" onClick={handleApple} className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors shadow-md shadow-black/20">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="black">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <span className="text-gray-700 font-medium">Continue with Apple</span>
            </button>
          </div>
          {message && (
            <div className={`mt-4 text-center text-${message.type === 'error' ? 'red' : 'green'}-600`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
