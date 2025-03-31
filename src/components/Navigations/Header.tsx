import React from 'react'
import VIGNAN from "../../../public/assets/images/vignan-logo.png"
import VIGNAN_HEADER from "../../../public/assets/images/vignan-header.jpeg"
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  return (
    <div className='h-24 lg:h-14 bg-white -mx-3 lg:m-0 flex justify-center'>
      <div className='py-3 max-w-6xl w-full flex items-center justify-between'>
        <div className='hidden lg:flex items-center gap-1.5'><Image src={VIGNAN} width={42} height={42} className='' alt='Vignan Logo' /><span className='text-violet-900 font-semibold text-lg whitespace-nowrap xs:text-base'>Assessment Portal</span></div>
        <div className='flex items-center gap-4'>
          <Link href="/"><Image src={VIGNAN_HEADER} className='h-20 w-full object-contain lg:hidden' alt='Vignan Logo' /></Link>
          <div className='w-fit flex gap-2 lg:hidden'>
            {/* <Link href={"/dashboard"}>Dashboard</Link> */}
            <Link href={"/assessment"} className='hover:text-violet-900 transition-all duration-200 hover:underline hover:underline-offset-2'>Assessments</Link>
            <Link href={"/practice"} className='hover:text-violet-900 transition-all duration-200 hover:underline hover:underline-offset-2'>Practice</Link>
          </div>
        </div>
        <div>
          <Link href={'/login'} className='w-full text-right px-4 py-1 border border-violet-600 hover:border-violet-900 bg-violet-500/20 text-violet-800 text-base font-medium rounded cursor-pointer xs:text-sm'>Login {/* Dashboard*/}</Link>
        </div>
      </div>
    </div>
  )
}

export default Header