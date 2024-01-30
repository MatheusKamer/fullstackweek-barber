import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";

const Header = () => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between px-5 py-6">
        <Image src="/logo.png" alt="FSW Barber" height={22} width={120} />
        <Button variant="outline" size="icon" className="bg-transparent border-none">
          <MenuIcon size={18}/>
        </Button>
      </CardContent>
    </Card>
  );
}

export default Header;
