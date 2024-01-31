import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Barbershop } from '@prisma/client'
import { StarIcon } from "lucide-react";
import Image from "next/image";

interface BarbershopItemProps {
  barbershop: Barbershop;
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  return (
      <Card className="min-w-[167px] max-w-[167px] rounded-2xl">
        <CardContent className="p-1">
          <div className="relative w-full h-[159px]">
            <div className="absolute top-1 left-1 z-50">
              <Badge variant="secondary" className=" opacity-90 flex items-center justify-center gap-[2px]">
                <StarIcon size={12} className="fill-primary text-primary"/>
                <span className="text-xs">5.0</span>
              </Badge>
            </div>
            <Image
              src={barbershop.imageUrl}
              alt={barbershop.name}
              style={{
                objectFit: "cover"
              }}
              fill
              sizes="100wv"
              className="rounded-xl"
            />
          </div>


          <h2 className="font-bold mt-2 overflow-hidden text-ellipsis text-nowrap">{barbershop.name}</h2>
          <p className="text-sm text-gray-400 overflow-hidden text-ellipsis text-nowrap">{barbershop.address}</p>
          <Button variant="secondary" className="w-full mt-3 rounded-xl">Reservar</Button>
        </CardContent>
      </Card>
  );
}

export default BarbershopItem;
