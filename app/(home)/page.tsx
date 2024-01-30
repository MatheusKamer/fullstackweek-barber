import { format } from "date-fns"
import { ptBR } from "date-fns/locale";
import Header from "../_components/header";
import { capitalizeFirstLetter } from "../_utils/capitalizeFirstLetter";
import Search from "./_components/Search";
import BookingItem from "../_components/booking-item";

export default function Home() {
  return (
    <div>
      <Header />

      <div className="px-5 py-6 space-y-1">
        <h2 className="text-xl font-bold">Olá, Matheus</h2>
        <p className="text-sm">{
            capitalizeFirstLetter(format(new Date(), "EEEE',' dd 'de' MMMM", {
          locale: ptBR,
          }))}
        </p>
      </div>

      <div className="px-5">
        <Search />
      </div>

      <div className="px-5 pt-9 space-y-3">
        <h2 className="text-sm uppercase text-gray-400 font-bold">AGENDAMENTOS</h2>
        <BookingItem />
      </div>
    </div>
  );
}
