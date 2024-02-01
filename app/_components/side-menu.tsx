"use client"

import { Button } from "./ui/button";
import { CalendarIcon, HomeIcon, LogInIcon, LogOutIcon, MenuIcon, UserIcon } from "lucide-react";
import { SheetHeader, SheetTitle } from "./ui/sheet";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "./ui/avatar";
import Link from "next/link";

const SideMenu = () => {
  const { data, status } = useSession()

  const handleSigninClick = () =>  {
    signIn("google")
  }

  const handleSignoutClick = () =>  {
    signOut()
  }

  return (
    <>
      <SheetHeader className="text-left border-b border-solid border-secondary p-5">
        <SheetTitle>
          Menu
        </SheetTitle>
      </SheetHeader>

      {data?.user ? (
        <div className="flex justify-between px-5 py-6 items-center">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={data.user?.image ?? ""} />
            </Avatar>

            <h2 className="font-bold">{data.user.name}</h2>
          </div>

          <Button variant="secondary" size="icon">
            <LogOutIcon onClick={handleSignoutClick}/>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col px-5 py-6 gap-3">
          <div className="flex items-center gap-2">
            <UserIcon size={24}/>
            <h2 className="text-sm">Olá, faça seu login!</h2>
          </div>

          <Button onClick={handleSigninClick} variant="secondary" className="w-full gap-2 justify-start">
            <LogInIcon size={18}/>
            Fazer login
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3 px-5">
        <Button variant="outline" className="justify-start" asChild>
          <Link href={"/"}>
            <HomeIcon size={18} className="mr-2"/>
            Início
          </Link>
        </Button>

        {data?.user && (
          <Button variant="outline" className="justify-start" asChild>
            <Link href={"/bookings"}>
              <CalendarIcon size={18} className="mr-2" />
              Agendamentos
            </Link>
          </Button>
        )}
      </div>
    </>
  );
}

export default SideMenu;
