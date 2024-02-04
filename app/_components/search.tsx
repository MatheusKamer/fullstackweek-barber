"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";

const Search = () => {
  return (
    <div className="flex items-center gap-2">
      <Input placeholder="Busque por uma barbearia... " />
      <Button variant="default" >
        <SearchIcon size={18} />
      </Button>
    </div>
  );
}

export default Search;