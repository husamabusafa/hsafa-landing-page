'use client'

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { useLanguage } from "./components/providers/language-provider"


export default function Home() {
  const { t } = useLanguage()
 

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors pt-28">
            <div
              className="mx-auto h-[calc(100vh-9rem)] w-[calc(100%-4rem)] max-w-[1800px] overflow-hidden rounded-[28px] "
            
            >
              <Image src="/bg1.svg" alt=""  width={1800} height={1000}  className="object-cover" priority />
            </div>

   
    </div>
  )
}
