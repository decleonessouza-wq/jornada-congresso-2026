import { Link } from "react-router-dom";
import { Home, Map, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PageNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 px-5">
      <div className="w-full max-w-sm rounded-3xl border border-purple-100 bg-white p-6 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200">
          <Sparkles className="h-8 w-8" />
        </div>

        <h1 className="mb-2 text-2xl font-extrabold text-slate-900">
          Página não encontrada
        </h1>

        <p className="mb-6 text-sm leading-relaxed text-slate-600">
          Essa parte da Jornada Congresso 2026 ainda não está disponível ou o endereço
          acessado não existe.
        </p>

        <div className="grid gap-3">
          <Link to="/">
            <Button className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 py-6 font-bold text-white">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao início
            </Button>
          </Link>

          <Link to="/jornada">
            <Button variant="outline" className="w-full rounded-2xl py-6 font-bold">
              <Map className="mr-2 h-4 w-4" />
              Ir para a jornada
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}