import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <>
      <div className="page-background2" />

      <div className="mx-auto max-w-6xl px-5 sm:px-10 md:px-16 lg:px-32 xl:px-40 mt-10 rounded-3xl border border-white/20 backdrop-blur-xl bg-white/10 shadow-2xl">
        <div className='w-full mx-auto flex flex-col text-center p-8 gap-9'>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mt-16">
            <span className="text-[#f56551] block">Discover Your Next Adventure with AI:</span>
            <span className="text-black block">Personalized Itineraries at Your Fingertips</span>
          </h1>

          <p className="mt-6 text-lg text-[#f56551] max-w-2xl mx-auto">
            Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
          </p>

          <Link to={'/create-trip'}>
            <Button>
              Get Started, It's Free
            </Button>
          </Link>

          <div className="w-full flex justify-center mt-auto">

          </div>
        </div>
      </div>
    </>
  )
}
