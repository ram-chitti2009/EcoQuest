"use client";
import { createClient } from '@/utils/supabase/client';
import { ArrowRight } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignInPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleGoogle = async () => {
    console.log("Google login attempted");
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/landingPage`
      }
    });
  };

  const handleApple = async () => {
    console.log("Apple login attempted");
    await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/landingPage`
      }
    });
  };

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login attempted");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      // Check if email is confirmed
      const user = data?.user;
      if (user && !user.email_confirmed_at) {
        setMessage({ type: 'error', text: 'Please confirm your email before logging in.' });
        await supabase.auth.signOut();
      } else {
        setMessage({ type: 'success', text: 'Signed in!' });
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ease-out ${
      isLoaded ? "opacity-100" : "opacity-0"
    }`} style={{ backgroundImage: 'url(/76080.png)' }}>
      {/* Responsive Header */}
      <header
        className={`border-b-4 border-green-800 relative bg-white transition-all duration-1000 z-30 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between md:pl-0 md:pr-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 -ml-4 md:-ml-20">
            <div className="w-12 h-12 md:w-16 md:h-16 relative bg-white rounded-full shadow-lg flex items-center justify-center p-2 transition-transform duration-300 hover:scale-110">
              <Image
                src="/Screenshot 2025-07-12 172658.png"
                alt="EcoQuest Logo"
                width={48}
                height={48}
                className="rounded-full object-contain"
                priority
              />
            </div>
            <span className="font-semibold text-gray-900 text-lg md:text-xl">EcoQuest</span>
          </div>
          {/* Navigation + Login Grouped */}
          <div className="hidden md:flex items-center space-x-8 -mr-16">
            <Link href="/" className="text-gray-900 font-bold hover:text-green-700 transition-colors duration-300 cursor-pointer">
              Home
            </Link>
            <Link href="/#features" className="text-gray-900 font-bold hover:text-green-700 transition-colors duration-300 cursor-pointer">
              Features
            </Link>
            <Link href="/signup">
              <button className="bg-[#20606B] hover:bg-green-700 text-white px-6 md:px-8 py-2 ml-4 rounded-lg transition-all duration-300 hover:scale-105">
                <span className="hidden sm:inline">Sign Up</span>
                <span className="inline sm:hidden">
                  <ArrowRight className="w-5 h-5" />
                </span>
              </button>
            </Link>
          </div>
        </div>
        {/* Mobile Nav */}
        <div className="flex md:hidden items-center justify-center gap-6 border-t border-green-100 py-2 bg-white">
          <Link href="/" className="text-gray-900 font-bold hover:text-green-700 text-base transition-colors duration-300 cursor-pointer">
            Home
          </Link>
          <Link href="/#features" className="text-gray-900 font-bold hover:text-green-700 text-base transition-colors duration-300 cursor-pointer">
            Features
          </Link>
          <Link href="/signup">
            <button className="bg-[#20606B] hover:bg-green-700 px-4 py-2 text-white text-base rounded-lg transition-all duration-300 hover:scale-105">
              <span className="hidden xs:inline">Sign Up</span>
              <span className="inline xs:hidden">
                <ArrowRight className="w-5 h-5" />
              </span>
            </button>
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <div className={`relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-4 transition-all duration-1200 delay-300 ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}>
        <div className="bg-gray-100 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-black/30">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 relative drop-shadow-xl">
                <Image
                    src="/Screenshot 2025-07-12 172658.png"
                    alt="EcoQuest Logo"
                    width={80}
                    height={80}
                    className="rounded-full object-contain"
                    priority
                />
            </div>
          </div>
          {/* Login Title */}
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">Login</h1>
          {/* Login Form */}
          <form className="space-y-4 mb-6" onSubmit={e => handleEmailSignIn(e)}>
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
            <button type="submit" className="w-full bg-[#20606B] hover:bg-green-700 text-white font-semibold py-3 rounded-full transition-colors shadow-md shadow-black/20">
              Login
            </button>
          </form>
          {/* Sign up link */}
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm">
              {"Don't have an account? "}
                <Link href="/signup" className="text-teal-600 hover:text-teal-700 underline font-medium">
                  Create one here!
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
            <div className={`mt-4 text-center text-${message?.type === 'error' ? 'red' : 'green'}-600`}>
              {message?.text}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
