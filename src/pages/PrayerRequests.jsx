import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Send, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { createPrayerRequest } from "@/services/prayerRequestService";
import { getParticipant } from "@/lib/participantSession";

function getParticipantName() {
  const participant = getParticipant();
  return participant?.fullName || "";
}

export default function PrayerRequests() {
  const participant = getParticipant();
  const firstName = participant?.firstName || "irmão";

  const [name, setName] = useState(() => getParticipantName());
  const [request, setRequest] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [sent, setSent] = useState(false);

  const createRequest = useMutation({
    mutationFn: createPrayerRequest,
    onSuccess: () => {
      setSent(true);
      setRequest("");
      setAnonymous(false);

      const savedName = getParticipantName();
      if (savedName) {
        setName(savedName);
      }
    },
  });

  const handleNameChange = (event) => {
    if (createRequest.isError) {
      createRequest.reset();
    }

    setName(event.target.value);
  };

  const handleRequestChange = (event) => {
    if (createRequest.isError) {
      createRequest.reset();
    }

    setRequest(event.target.value);
  };

  const handleAnonymousChange = (checked) => {
    if (createRequest.isError) {
      createRequest.reset();
    }

    setAnonymous(Boolean(checked));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!request.trim()) {
      return;
    }

    const savedName = getParticipantName();

    createRequest.mutate({
      author_name: anonymous
        ? "Anônimo"
        : name.trim() || savedName || "Anônimo",
      prayer_text: request.trim(),
      is_anonymous: anonymous,
    });
  };

  return (
    <div className="px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-0.5 text-2xl font-extrabold text-foreground">
          Pedido de Oração
        </h1>

        <p className="mb-2 text-sm text-muted-foreground">
          Compartilhe seu coração conosco.
        </p>

        <p className="mb-5 rounded-2xl border border-pink-100 bg-white/70 px-3 py-2 text-xs font-semibold text-pink-700 shadow-sm">
          Olá, {firstName}! Este é um espaço de cuidado, sigilo e oração.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-6 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 p-5"
      >
        <Heart className="mb-2 h-6 w-6 text-pink-400" />

        <p className="text-sm leading-relaxed text-foreground">
          A liderança da igreja estará orando por cada pedido recebido. Sinta-se à
          vontade para compartilhar o que está em seu coração. Seu pedido será tratado
          com amor e sigilo.
        </p>
      </motion.div>

      {sent ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-2xl border border-green-200 bg-white p-8 text-center shadow-sm"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Heart className="h-8 w-8 text-green-600" />
          </div>

          <h3 className="mb-2 text-lg font-extrabold text-foreground">
            Pedido enviado!
          </h3>

          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            Estaremos orando por você. Deus ouve e responde cada oração. 🙏
          </p>

          <Button
            type="button"
            onClick={() => {
              setSent(false);
              createRequest.reset();
            }}
            variant="outline"
            className="rounded-xl"
          >
            Enviar outro pedido
          </Button>
        </motion.div>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          {!anonymous && (
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-bold text-foreground">
                Nome (opcional)
              </label>

              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-400" />

                <Input
                  placeholder="Seu nome"
                  value={name}
                  onChange={handleNameChange}
                  className="rounded-xl pl-9"
                  maxLength={80}
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-bold text-foreground">
              Seu pedido de oração
            </label>

            <Textarea
              placeholder="Escreva aqui o que você gostaria que orássemos por você..."
              value={request}
              onChange={handleRequestChange}
              className="min-h-[120px] rounded-xl text-sm"
              maxLength={1000}
            />

            <p className="mt-1 text-right text-[11px] text-muted-foreground">
              {request.length}/1000
            </p>
          </div>

          <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-pink-50 bg-pink-50/50 px-3 py-3">
            <Checkbox
              id="anon"
              checked={anonymous}
              onCheckedChange={handleAnonymousChange}
            />

            <label
              htmlFor="anon"
              className="cursor-pointer select-none text-sm text-muted-foreground"
            >
              Quero enviar de forma anônima
            </label>
          </div>

          <Button
            type="submit"
            disabled={!request.trim() || createRequest.isPending}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 py-6 text-base font-bold text-white transition-all active:scale-[0.98]"
          >
            <Send className="mr-2 h-4 w-4" />
            {createRequest.isPending ? "Enviando..." : "Enviar pedido"}
          </Button>

          {createRequest.isError && (
            <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
              {createRequest.error?.message ||
                "Não foi possível enviar seu pedido de oração."}
            </p>
          )}
        </motion.form>
      )}
    </div>
  );
}