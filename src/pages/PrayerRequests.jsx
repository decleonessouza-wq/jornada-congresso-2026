import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { createPrayerRequest } from "@/services/prayerRequestService";

export default function PrayerRequests() {
  const [name, setName] = useState("");
  const [request, setRequest] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [sent, setSent] = useState(false);

  const createRequest = useMutation({
    mutationFn: createPrayerRequest,
    onSuccess: () => {
      setSent(true);
      setName("");
      setRequest("");
      setAnonymous(false);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!request.trim()) {
      return;
    }

    createRequest.mutate({
      author_name: anonymous ? "Anônimo" : name.trim() || "Anônimo",
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
        <p className="mb-5 text-sm text-muted-foreground">
          Compartilhe seu coração conosco.
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

          <p className="mb-6 text-sm text-muted-foreground">
            Estaremos orando por você. Deus ouve e responde cada oração. 🙏
          </p>

          <Button
            type="button"
            onClick={() => setSent(false)}
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

              <Input
                placeholder="Seu nome"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="rounded-xl"
                maxLength={80}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-bold text-foreground">
              Seu pedido de oração
            </label>

            <Textarea
              placeholder="Escreva aqui o que você gostaria que orássemos por você..."
              value={request}
              onChange={(event) => setRequest(event.target.value)}
              className="min-h-[120px] rounded-xl text-sm"
              maxLength={1000}
            />

            <p className="mt-1 text-right text-[11px] text-muted-foreground">
              {request.length}/1000
            </p>
          </div>

          <div className="mb-6 flex items-center gap-2.5">
            <Checkbox
              id="anon"
              checked={anonymous}
              onCheckedChange={(checked) => setAnonymous(Boolean(checked))}
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