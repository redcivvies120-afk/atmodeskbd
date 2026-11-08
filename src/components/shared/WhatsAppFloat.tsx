'use client'

import React from 'react'

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/8801318043562?text=Hi%20ATMODESK!%20I%20have%20a%20question."
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed right-3 sm:right-5 z-40 bottom-[calc(env(safe-area-inset-bottom,0px)+96px)] md:bottom-8"
      title="Text us on WhatsApp"
      aria-label="Text us on WhatsApp"
    >
      <span className="relative flex items-center gap-2 rounded-full p-3 text-white transition-all duration-300 active:scale-95 sm:px-4 sm:py-3 lg-wa">
        <svg className="h-6 w-6 flex-shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.676.15-.2.301-.776.979-.951 1.18-.175.2-.35.225-.651.075-.3-.15-1.267-.467-2.414-1.49-.893-.796-1.496-1.78-1.671-2.08-.175-.3-.019-.462.132-.612.136-.135.301-.35.451-.525.15-.175.2-.301.301-.5.1-.2.05-.376-.025-.526-.075-.15-.676-1.631-.926-2.233-.244-.587-.492-.507-.676-.516h-.576c-.2 0-.526.075-.801.376-.275.3-1.051 1.027-1.051 2.504s1.077 2.905 1.227 3.106c.15.2 2.119 3.235 5.132 4.537.717.31 1.277.495 1.713.633.72.229 1.375.197 1.893.12.578-.087 1.78-.727 2.03-1.43.25-.702.25-1.303.175-1.43-.075-.125-.275-.2-.576-.35zM12.04 2C6.543 2 2.08 6.463 2.08 11.96c0 1.98.58 3.824 1.583 5.378L2 22l4.808-1.579a9.92 9.92 0 005.232 1.499c5.497 0 9.96-4.463 9.96-9.96C22 6.463 17.537 2 12.04 2zm0 18.232c-1.603 0-3.093-.453-4.364-1.238l-.313-.193-2.855.939.954-2.783-.211-.336a8.212 8.212 0 01-1.252-4.661c0-4.57 3.719-8.288 8.29-8.288 4.572 0 8.29 3.718 8.29 8.288 0 4.57-3.718 8.288-8.29 8.288z" />
        </svg>
        <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[8rem] group-hover:opacity-100 sm:inline">
          Text us
        </span>
      </span>
      <style>{`
        .lg-wa{
          background:linear-gradient(180deg,#4be27d 0%,#1fb855 100%);
          box-shadow:inset 0 1px 0 rgba(255,255,255,.5),inset 0 -2px 4px rgba(0,0,0,.1),0 14px 28px -10px rgba(31,184,85,.7),0 0 0 .5px rgba(0,120,50,.5);
        }
      `}</style>
    </a>
  )
}
