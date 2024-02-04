"use client"

import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MenuIcon  } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import SideMenu from "./side-menu";
import Link from "next/link";

const Header = () => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between px-5 py-6">
        <Link href={"/"}>
          <Image src="/logo.png" alt="FSW Barber" height={22} width={120} />
        </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="bg-transparent border-none">
                <MenuIcon size={18}/>
              </Button>
            </SheetTrigger>

            <SheetContent className="p-0">
              <SideMenu />
            </SheetContent>
          </Sheet>
      </CardContent>
    </Card>
  );
}

export default Header;
