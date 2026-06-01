import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarHeart,
  Heart,
  HeartHandshake,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { createPrayerRequest } from "@/services/prayerRequestService";
import { getParticipant } from "@/lib/participantSession";
import { playClick } from "@/lib/sounds";

function getParticipantName() {
  const participant = getParticipant();
  return participant?.fullName || "";
}

function getDisplayName(name, anonymous) {
  if (anonymous) {
    return "irmão";
  }

  const cleanName = String(name || "").trim();

  if (!cleanName) {
    return "irmão";
  }

  return cleanName.split(" ")[0] || "irmão";
}

export default function PrayerRequests() {
  const participant = getParticipant();
  const firstName = participant?.firstName || "irmão";

  const [name, setName] = useState(() => getParticipantName());
  const [request, setRequest] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentDisplayName, setSentDisplayName] = useState(firstName);

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
    const authorName = anonymous ? "Anônimo" : name.trim() || savedName || "Anônimo";

    setSentDisplayName(getDisplayName(authorName, anonymous));

    createRequest.mutate({
      author_name: authorName,
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
        transition={{ delay: 0.12 }}
        className="mb-4 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 p-5"
      >
        <Heart className="mb-2 h-6 w-6 text-pink-400" />

        <p className="text-sm leading-relaxed text-foreground">
          A liderança da igreja estará orando por cada pedido recebido. Sinta-se à
          vontade para compartilhar o que está em seu coração. Seu pedido será tratado
          com amor e sigilo.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="mb-6 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-purple-50 p-5 shadow-sm"
      >
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <HeartHandshake className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-sm font-extrabold text-foreground">
              Meu compromisso de oração por você
            </h2>

            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              Um propósito de intercessão pela Jornada Congresso 2026.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm leading-relaxed text-foreground">
          <p>
            Durante a Jornada Congresso 2026, estarei orando por cada pedido enviado
            aqui, apresentando essas necessidades diante de Deus com temor, fé e amor
            pelos irmãos.
          </p>

          <p>
            Também estarei em consagração e jejum no domingo,{" "}
            <strong>14 de junho</strong>, e durante o congresso, intercedendo para que
            Deus fortaleça corações, responda segundo a sua vontade e prepare a igreja
            para viver aquilo que Ele deseja falar conosco.
          </p>

          <p>
            Se Deus fizer algo em sua vida, você poderá voltar ao app a qualquer momento
            e compartilhar seu testemunho. Aquilo que Deus realiza em você também pode
            fortalecer a fé de outros.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-amber-100 bg-white/80 px-3 py-2">
          <CalendarHeart className="h-4 w-4 text-amber-600" />
          <p className="text-xs font-extrabold text-amber-800">
            — Decleones Andrade
          </p>
        </div>
      </motion.div>

      {sent ? (
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-2xl border border-green-200 bg-white p-6 text-center shadow-sm"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Heart className="h-8 w-8 text-green-600" />
          </div>

          <h3 className="mb-2 text-lg font-extrabold text-foreground">
            Pedido recebido, {sentDisplayName}!
          </h3>

          <div className="space-y-3 text-left text-sm leading-relaxed text-muted-foreground">
            <p>
              Seu pedido foi enviado com sucesso. Eu,{" "}
              <strong>Decleones Andrade</strong>, responsável por esta Jornada, estarei
              orando por você e apresentando este pedido diante de Deus até a festa e
              também durante o congresso.
            </p>

            <p>
              Meu propósito é interceder com fé, amor e responsabilidade por cada irmão
              que compartilhar seu pedido aqui. Também estarei em consagração e jejum no
              domingo, <strong>14 de junho</strong>, e durante o congresso, clamando para
              que Deus fortaleça corações, responda segundo a sua perfeita vontade e
              prepare a igreja para viver aquilo que Ele deseja falar conosco.
            </p>

            <p>
              Quando Deus fizer algo em sua vida, você poderá voltar a este app a qualquer
              momento e acessar a área de testemunhos para compartilhar sua bênção. Seu
              testemunho pode fortalecer a fé de outros irmãos e glorificar o nome do
              Senhor.
            </p>
          </div>

          <div className="mt-6 grid gap-2">
            <Link to="/mural?tipo=testemunho" onClick={playClick}>
              <Button className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-6 text-sm font-extrabold text-white">
                <HeartHandshake className="mr-2 h-4 w-4" />
                Compartilhar testemunho
              </Button>
            </Link>

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
          </div>

          <div className="mt-5 rounded-2xl border border-purple-100 bg-purple-50 px-3 py-2">
            <p className="text-xs font-semibold leading-relaxed text-purple-700">
              Você não precisa testemunhar agora. Quando desejar, volte ao app e acesse
              o mural de testemunhos.
            </p>
          </div>
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