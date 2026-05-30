import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createMuralPost, listMuralPosts } from "@/services/muralService";
import { getParticipant } from "@/lib/participantSession";

const cardStyles = [
  "from-purple-100 to-purple-50 border-purple-200",
  "from-amber-100 to-amber-50 border-amber-200",
  "from-blue-100 to-blue-50 border-blue-200",
  "from-green-100 to-green-50 border-green-200",
  "from-pink-100 to-pink-50 border-pink-200",
  "from-violet-100 to-violet-50 border-violet-200",
  "from-cyan-100 to-cyan-50 border-cyan-200",
  "from-rose-100 to-rose-50 border-rose-200",
];

function getParticipantName() {
  const participant = getParticipant();
  return participant?.fullName || "";
}

export default function Mural() {
  const [name, setName] = useState(() => getParticipantName());
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const participant = getParticipant();
  const firstName = participant?.firstName || "irmão";

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["muralPosts"],
    queryFn: () => listMuralPosts(50),
  });

  const createPost = useMutation({
    mutationFn: createMuralPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["muralPosts"] });
      setMessage("");

      const savedName = getParticipantName();
      if (savedName) {
        setName(savedName);
      }
    },
  });

  const handleNameChange = (event) => {
    if (createPost.isSuccess || createPost.isError) {
      createPost.reset();
    }

    setName(event.target.value);
  };

  const handleMessageChange = (event) => {
    if (createPost.isSuccess || createPost.isError) {
      createPost.reset();
    }

    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    createPost.mutate({
      author_name: name.trim() || "Anônimo",
      message: message.trim(),
    });
  };

  return (
    <div className="px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-0.5 text-2xl font-extrabold text-foreground">
          Mural da Jornada
        </h1>

        <p className="mb-2 text-sm text-muted-foreground">
          O que você espera que Deus fale com você no congresso?
        </p>

        <p className="mb-5 rounded-2xl border border-purple-100 bg-white/70 px-3 py-2 text-xs font-semibold text-purple-700 shadow-sm">
          Olá, {firstName}! Sua participação ajuda a fortalecer esta caminhada.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mb-4 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 p-4"
      >
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-purple-600 shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-extrabold text-foreground">
              Espaço de participação dos irmãos
            </p>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Para manter o mural edificante e organizado, as mensagens enviadas passam
              por uma breve revisão da equipe antes de aparecerem publicamente.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm"
      >
        <Input
          placeholder="Seu nome (opcional)"
          value={name}
          onChange={handleNameChange}
          className="mb-3 rounded-xl"
          maxLength={80}
        />

        <Textarea
          placeholder="Compartilhe sua expectativa para o congresso..."
          value={message}
          onChange={handleMessageChange}
          className="mb-2 min-h-[80px] rounded-xl text-sm"
          maxLength={500}
        />

        <p className="mb-3 text-right text-[11px] text-muted-foreground">
          {message.length}/500
        </p>

        <Button
          type="submit"
          disabled={!message.trim() || createPost.isPending}
          className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-white"
        >
          <Send className="mr-2 h-4 w-4" />
          {createPost.isPending ? "Enviando..." : "Compartilhar"}
        </Button>

        {createPost.isError && (
          <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
            {createPost.error?.message || "Não foi possível enviar sua mensagem."}
          </p>
        )}

        {createPost.isSuccess && (
          <p className="mt-3 rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold leading-relaxed text-green-700">
            {createPost.data?.message ||
              "Mensagem enviada com sucesso. Após uma breve revisão da equipe, ela poderá aparecer no mural da Jornada."}
          </p>
        )}
      </motion.form>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="h-7 w-7 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-center text-red-700">
          <MessageCircle className="mx-auto mb-2 h-8 w-8 opacity-70" />

          <p className="text-sm font-bold">Não foi possível carregar o mural.</p>

          <p className="mt-1 text-xs">
            {error?.message || "Verifique a conexão com o Supabase e tente novamente."}
          </p>
        </div>
      ) : posts.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">
          <MessageCircle className="mx-auto mb-2 h-8 w-8 opacity-40" />

          <p className="text-sm font-medium">
            Ainda não há mensagens aprovadas no mural.
          </p>

          <p className="mt-1 text-xs">
            Compartilhe sua expectativa e aguarde a revisão da equipe.
          </p>
        </div>
      ) : (
        <div className="columns-2 gap-3 space-y-3">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="break-inside-avoid"
            >
              <div
                className={`rounded-2xl border bg-gradient-to-br ${
                  cardStyles[index % cardStyles.length]
                } p-4`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/80">
                    <User className="h-3 w-3 text-purple-500" />
                  </div>

                  <span className="text-xs font-bold text-foreground">
                    {post.author_name || "Anônimo"}
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-foreground/80">
                  {post.message}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}