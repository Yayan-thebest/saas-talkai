import { SignInView } from '@/modules/auth/ui/views/sign-in-view';
import React from 'react'

const Page = () => {
    console.log("Sign in page"); // pour demontrer qu'il est render coté server

  return (
    <SignInView/>
  )
}

export default Page;
