import { SignUpView } from '@/modules/auth/ui/views/sign-up-view';
import React from 'react'

const Page = () => {
    console.log("Sign up page"); // pour demontrer qu'il est render coté server

  return (
    <SignUpView/>
  )
}

export default Page;
