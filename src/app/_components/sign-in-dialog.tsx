//export interface sign-in-dialogProps { }

import Image from "next/image"
import { Button } from "./ui/button"
import { DialogHeader, DialogDescription, DialogTitle } from "./ui/dialog"
import { signIn } from "next-auth/react"

export default function SignInDialog() {
  const handleLoginWithGoogleClick = () => signIn("google")

  return (
    <>
      <DialogHeader>
        <DialogTitle>Faça seu Login na plataforma</DialogTitle>
        <DialogDescription>
          Conecte-se usando sua conta do Google.
        </DialogDescription>
      </DialogHeader>
      <Button
        variant="outline"
        className="gap-1 font-bold"
        onClick={handleLoginWithGoogleClick}
      >
        <Image
          alt="login com Google"
          src="/google.svg"
          width={18}
          height={18}
        />
        Google
      </Button>
    </>
  )
}
