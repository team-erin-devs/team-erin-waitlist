'use client';

import { useState, useEffect } from 'react';
import { Urbanist } from 'next/font/google';
import Image from 'next/image';

const urbanist = Urbanist({ subsets: ['latin'] });

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  // Prevent scrolling entirely
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/addToWaitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (res.ok && !data.error) {
        setSubmitted(true);
        setMessage('Signup successful!');
        setName('');
        setEmail('');
      } else {
        setMessage(
          data.error || 'Error submitting. Please contact @plotd.app on Instagram.'
        );
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage('Network error — contact @plotd.app on Instagram.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`${urbanist.className} h-screen w-screen bg-black flex items-center justify-center overflow-hidden`}
    >
      <div className="flex flex-col items-center w-full max-w-xs sm:max-w-sm">
        {/* Logo */}
        <div className="mb-6 w-60 sm:w-72 md:w-80 ml-10">
          <Image
            src="/plotd.png"
            alt="Plotd"
            width={320}
            height={160}
            priority
            className="w-full h-auto"
          />
        </div>

        {/* Tagline */}
        <p className="text-white text-3xl mb-10 tracking-wide font-light text-center">
          *do it for the plot
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center space-y-2"
        >
          <div className="w-full flex justify-center">
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-3/4 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 py-2 px-0 focus:outline-none focus:border-white transition-colors text-sm"
              required
            />
          </div>

          <div className="w-full flex justify-center">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-3/4 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 py-2 px-0 focus:outline-none focus:border-white transition-colors text-sm"
              required
            />
          </div>

          {!submitted && (
            <div className="w-full flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-4/5 bg-white text-black py-2.5 rounded-xl text-sm font-normal transition-all duration-300 hover:bg-black hover:text-white hover:outline hover:outline-2 hover:outline-white disabled:opacity-60"
              >
                {loading ? 'Submitting…' : 'Join the plot.'}
              </button>
            </div>
          )}

          {message && (
            <p
              className={`text-center mt-2 ${
                submitted ? 'text-white' : 'text-red-400'
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
