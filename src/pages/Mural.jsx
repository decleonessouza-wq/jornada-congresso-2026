import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  HeartHandshake,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
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

const muralTypes = {
  expectation: {
    label: "Expectativas",
    shortLabel: "Expectativa",
    icon: Sparkles,
    title: "Mural da Jornada",
    subtitle: "O que você espera que Deus fale com você no congresso?",
    helperTitle: "Espaço de participação dos irmãos",
    helperText:
      "Para manter o mural edificante e organizado, as mensagens enviadas passam por uma breve revisão da equipe antes de aparecerem publicamente.",
    placeholder: "Compartilhe sua expectativa para o congresso...",
    button: "Compartilhar expectativa",
    emptyTitle: "Ainda não há expectativas aprovadas no mural.",
    emptyText: "Compartilhe sua expectativa e aguarde a revisão da equipe.",
    successFallback:
      "Mensagem enviada com sucesso. Após uma breve revisão da equipe, ela poderá aparecer no mural da Jornada.",
    maxLength: 700,
    theme: {
      border: "border-purple-100",
      bg: "from-purple-50 to-indigo-50",
      iconBg: "bg-white",
      iconText: "text-purple-600",
      text: "text-purple-700",
      button: "from-purple-600 to-indigo-600",
    },
  },
  testimony: {
    label: "Testemunhos",
    shortLabel: "Testemunho",
    icon: HeartHandshake,
    title: "Testemunhos da Jornada",
    subtitle: "Compartilhe o que Deus fez e edifique outros irmãos.",
    helperTitle: "Testemunhe o que Deus fez",
    helperText:
      "Se Deus respondeu uma oração, fortaleceu seu coração, abriu uma porta, trouxe consolo ou falou com você de alguma forma durante esta Jornada, compartilhe seu testemunho. Você pode testemunhar agora ou voltar depois, quando desejar. Todos os testemunhos passam por uma breve revisão antes de aparecerem publicamente.",
    placeholder: "Conte aqui seu testemunho, bênção recebida ou experiência com Deus...",
    button: "Enviar testemunho",
    emptyTitle: "Ainda não há testemunhos aprovados.",
    emptyText:
      "Quando Deus fizer algo, volte aqui e compartilhe para fortalecer a fé dos irmãos.",
    successFallback:
      "Testemunho enviado com sucesso. Após uma breve revisão da equipe, ele poderá aparecer no mural para edificar outros irmãos.",
    maxLength: 700,
    theme: {
      border: "border-amber-100",
      bg: "from-amber-50 to-orange-50",
      iconBg: "bg-white",
      iconText: "text-amber-600",
      text: "text-amber-700",
      button: "from-amber-500 to-orange-500",
    },
  },
};

function getParticipantName() {
  const participant = getParticipant();
  return participant?.fullName || "";
}

function getInitialType(searchParams) {
  const type = searchParams.get("tipo");

  if (type === "testemunho" || type === "testimony") {
    return "testimony";
  }

  return "expectation";
}

export default function Mural() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeType, setActiveType] = useState(() => getInitialType(searchParams));
  const [name, setName] = useState(() => getParticipantName());
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const participant = getParticipant();
  const firstName = participant?.firstName || "irmão";

  const currentType = muralTypes[activeType];
  const CurrentIcon = currentType.icon;

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["muralPosts", activeType],
    queryFn: () => listMuralPosts(50, activeType),
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

  const visiblePosts = useMemo(() => {
    return posts.filter((post) => (post.post_type || "expectation") === activeType);
  }, [posts, activeType]);

  const handleTypeChange = (type) => {
    setActiveType(type);
    setMessage("");
    createPost.reset();

    if (type === "testimony") {
      setSearchParams({ tipo: "testemunho" });
      return;
    }

    setSearchParams({});
  };

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
      post_type: activeType,
    });
  };

  return (
    <div className="px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-0.5 text-2xl font-extrabold text-foreground">
          {currentType.title}
        </h1>

        <p className="mb-2 text-sm text-muted-foreground">
          {currentType.subtitle}
        </p>

        <p
          className={`mb-5 rounded-2xl border ${currentType.theme.border} bg-white/70 px-3 py-2 text-xs font-semibold ${currentType.theme.text} shadow-sm`}
        >
          Olá, {firstName}! Sua participação pode fortalecer outros irmãos.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-purple-100 bg-white p-2 shadow-sm"
      >
        {Object.entries(muralTypes).map(([type, data]) => {
          const Icon = data.icon;
          const active = activeType === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeChange(type)}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-extrabold transition ${
                active
                  ? `bg-gradient-to-r ${data.theme.button} text-white shadow-md`
                  : "bg-slate-50 text-slate-500 hover:bg-purple-50 hover:text-purple-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              {data.label}
            </button>
          );
        })}
      </motion.div>

      {activeType === "testimony" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3"
        >
          <p className="text-xs font-bold leading-relaxed text-amber-800">
            Seu testemunho pode edificar alguém. Compartilhe o que Deus fez e ajude
            outros irmãos a permanecerem firmes em fé, esperança e oração.
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className={`mb-4 rounded-2xl border ${currentType.theme.border} bg-gradient-to-r ${currentType.theme.bg} p-4`}
      >
        <div className="flex gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${currentType.theme.iconBg} ${currentType.theme.iconText} shadow-sm`}
          >
            {activeType === "expectation" ? (
              <ShieldCheck className="h-5 w-5" />
            ) : (
              <CurrentIcon className="h-5 w-5" />
            )}
          </div>

          <div>
            <p className="text-sm font-extrabold text-foreground">
              {currentType.helperTitle}
            </p>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {currentType.helperText}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={`mb-6 rounded-2xl border ${currentType.theme.border} bg-white p-5 shadow-sm`}
      >
        <Input
          placeholder="Seu nome (opcional)"
          value={name}
          onChange={handleNameChange}
          className="mb-3 rounded-xl"
          maxLength={80}
        />

        <Textarea
          placeholder={currentType.placeholder}
          value={message}
          onChange={handleMessageChange}
          className="mb-2 min-h-[100px] rounded-xl text-sm"
          maxLength={currentType.maxLength}
        />

        <p className="mb-3 text-right text-[11px] text-muted-foreground">
          {message.length}/{currentType.maxLength}
        </p>

        <Button
          type="submit"
          disabled={!message.trim() || createPost.isPending}
          className={`w-full rounded-xl bg-gradient-to-r ${currentType.theme.button} font-bold text-white`}
        >
          <Send className="mr-2 h-4 w-4" />
          {createPost.isPending ? "Enviando..." : currentType.button}
        </Button>

        {createPost.isError && (
          <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
            {createPost.error?.message ||
              (activeType === "testimony"
                ? "Não foi possível enviar seu testemunho."
                : "Não foi possível enviar sua mensagem.")}
          </p>
        )}

        {createPost.isSuccess && (
          <p className="mt-3 rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold leading-relaxed text-green-700">
            {createPost.data?.message || currentType.successFallback}
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
      ) : visiblePosts.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">
          <MessageCircle className="mx-auto mb-2 h-8 w-8 opacity-40" />

          <p className="text-sm font-medium">{currentType.emptyTitle}</p>

          <p className="mt-1 text-xs">{currentType.emptyText}</p>
        </div>
      ) : (
        <div className="columns-2 gap-3 space-y-3">
          {visiblePosts.map((post, index) => (
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

                <div className="mt-3">
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${
                      post.post_type === "testimony"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {post.post_type === "testimony" ? "Testemunho" : "Expectativa"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}