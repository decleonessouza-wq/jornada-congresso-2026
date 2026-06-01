import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Archive,
  CheckCircle2,
  Eye,
  EyeOff,
  Heart,
  HeartHandshake,
  Home,
  Loader2,
  LogOut,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Trophy,
  Users,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  approveMuralMessage,
  archivePrayerRequest,
  deleteMuralMessage,
  deletePrayerRequest,
  deleteUserScore,
  getCurrentAdminProfile,
  hideMuralMessage,
  listMuralMessagesForAdmin,
  listPrayerRequestsForAdmin,
  listUserScoresForAdmin,
  markPrayerAsPrayed,
  signOutAdmin,
} from "@/services/adminService";

const tabs = [
  { id: "mural", label: "Mural", icon: MessageCircle },
  { id: "oracoes", label: "Orações", icon: Heart },
  { id: "participacao", label: "Caminhada", icon: Trophy },
];

function formatDate(value) {
  if (!value) return "Data não informada";

  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "Data inválida";
  }
}

function getMuralTypeMeta(type) {
  if (type === "testimony") {
    return {
      label: "Testemunho",
      pendingLabel: "testemunho pendente",
      icon: HeartHandshake,
      badgeClass: "bg-amber-100 text-amber-700",
      borderClass: "border-amber-200",
      pendingClass: "border-amber-200 bg-amber-50/60",
    };
  }

  return {
    label: "Expectativa",
    pendingLabel: "expectativa pendente",
    icon: Sparkles,
    badgeClass: "bg-purple-100 text-purple-700",
    borderClass: "border-purple-100",
    pendingClass: "border-purple-200 bg-purple-50/60",
  };
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="rounded-3xl border border-dashed border-purple-100 bg-white/70 p-8 text-center">
      <Icon className="mx-auto mb-3 h-10 w-10 text-purple-300" />
      <h3 className="text-sm font-extrabold text-slate-800">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
      {message || "Não foi possível carregar as informações agora."}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("mural");

  const adminQuery = useQuery({
    queryKey: ["adminProfile"],
    queryFn: getCurrentAdminProfile,
    retry: false,
  });

  const muralQuery = useQuery({
    queryKey: ["adminMuralMessages"],
    queryFn: listMuralMessagesForAdmin,
    enabled: Boolean(adminQuery.data),
  });

  const prayersQuery = useQuery({
    queryKey: ["adminPrayerRequests"],
    queryFn: listPrayerRequestsForAdmin,
    enabled: Boolean(adminQuery.data),
  });

  const scoresQuery = useQuery({
    queryKey: ["adminUserScores"],
    queryFn: listUserScoresForAdmin,
    enabled: Boolean(adminQuery.data),
  });

  useEffect(() => {
    if (!adminQuery.isLoading && !adminQuery.data) {
      navigate("/admin/login", { replace: true });
    }
  }, [adminQuery.isLoading, adminQuery.data, navigate]);

  const muralMessages = muralQuery.data || [];
  const prayerRequests = prayersQuery.data || [];
  const userScores = scoresQuery.data || [];

  const pendingMuralMessages = useMemo(
    () => muralMessages.filter((item) => !item.is_approved),
    [muralMessages]
  );

  const approvedMuralMessages = useMemo(
    () => muralMessages.filter((item) => item.is_approved),
    [muralMessages]
  );

  const pendingTestimonies = useMemo(
    () =>
      muralMessages.filter(
        (item) => item.post_type === "testimony" && !item.is_approved
      ),
    [muralMessages]
  );

  const approvedTestimonies = useMemo(
    () =>
      muralMessages.filter(
        (item) => item.post_type === "testimony" && item.is_approved
      ),
    [muralMessages]
  );

  const activePrayerRequests = useMemo(
    () => prayerRequests.filter((item) => !item.is_archived),
    [prayerRequests]
  );

  const archivedPrayerRequests = useMemo(
    () => prayerRequests.filter((item) => item.is_archived),
    [prayerRequests]
  );

  const approveMuralMutation = useMutation({
    mutationFn: approveMuralMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMuralMessages"] });
      queryClient.invalidateQueries({ queryKey: ["muralPosts"] });
    },
  });

  const hideMuralMutation = useMutation({
    mutationFn: hideMuralMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMuralMessages"] });
      queryClient.invalidateQueries({ queryKey: ["muralPosts"] });
    },
  });

  const deleteMuralMutation = useMutation({
    mutationFn: deleteMuralMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMuralMessages"] });
      queryClient.invalidateQueries({ queryKey: ["muralPosts"] });
    },
  });

  const markPrayerMutation = useMutation({
    mutationFn: ({ id, value }) => markPrayerAsPrayed(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPrayerRequests"] });
    },
  });

  const archivePrayerMutation = useMutation({
    mutationFn: ({ id, value }) => archivePrayerRequest(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPrayerRequests"] });
    },
  });

  const deletePrayerMutation = useMutation({
    mutationFn: deletePrayerRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPrayerRequests"] });
    },
  });

  const deleteScoreMutation = useMutation({
    mutationFn: deleteUserScore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUserScores"] });
      queryClient.invalidateQueries({ queryKey: ["userScores"] });
    },
  });

  async function handleLogout() {
    await signOutAdmin();
    navigate("/admin/login", { replace: true });
  }

  function refreshAll() {
    queryClient.invalidateQueries({ queryKey: ["adminMuralMessages"] });
    queryClient.invalidateQueries({ queryKey: ["adminPrayerRequests"] });
    queryClient.invalidateQueries({ queryKey: ["adminUserScores"] });
  }

  function confirmDelete(message, callback) {
    const shouldDelete = window.confirm(message);

    if (shouldDelete) {
      callback();
    }
  }

  if (adminQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 px-5">
        <div className="flex items-center gap-3 rounded-3xl border border-purple-100 bg-white px-5 py-4 shadow-xl">
          <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
          <span className="text-sm font-bold text-slate-700">
            Verificando painel...
          </span>
        </div>
      </div>
    );
  }

  if (adminQuery.error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 px-5">
        <div className="w-full max-w-sm rounded-3xl border border-red-100 bg-white p-6 text-center shadow-xl">
          <ShieldCheck className="mx-auto mb-3 h-12 w-12 text-red-400" />
          <h1 className="text-lg font-extrabold text-slate-900">
            Acesso não autorizado
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Faça login com um usuário administrador válido para acessar esta área.
          </p>
          <Button
            onClick={() => navigate("/admin/login", { replace: true })}
            className="mt-5 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 py-6 font-bold text-white"
          >
            Ir para login
          </Button>
        </div>
      </div>
    );
  }

  const isBusy =
    approveMuralMutation.isPending ||
    hideMuralMutation.isPending ||
    deleteMuralMutation.isPending ||
    markPrayerMutation.isPending ||
    archivePrayerMutation.isPending ||
    deletePrayerMutation.isPending ||
    deleteScoreMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 px-4 py-5">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-5 rounded-[2rem] border border-purple-100 bg-white p-5 shadow-xl shadow-purple-100/70">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-purple-500">
                  Jornada Congresso 2026
                </p>
                <h1 className="text-2xl font-extrabold text-slate-950">
                  Painel Administrativo
                </h1>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  Gerencie expectativas, testemunhos, pedidos de oração e a caminhada
                  dos participantes.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="rounded-2xl border-purple-100 bg-white"
              >
                <Home className="mr-2 h-4 w-4" />
                Ver app
              </Button>

              <Button
                variant="outline"
                onClick={refreshAll}
                disabled={isBusy}
                className="rounded-2xl border-purple-100 bg-white"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar
              </Button>

              <Button
                onClick={handleLogout}
                className="rounded-2xl bg-slate-900 text-white hover:bg-slate-800"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        <section className="mb-5 grid gap-3 md:grid-cols-5">
          <div className="rounded-3xl border border-purple-100 bg-white p-4 shadow-sm">
            <MessageCircle className="mb-2 h-5 w-5 text-purple-500" />
            <p className="text-2xl font-extrabold text-slate-950">
              {pendingMuralMessages.length}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              itens pendentes
            </p>
          </div>

          <div className="rounded-3xl border border-green-100 bg-white p-4 shadow-sm">
            <Eye className="mb-2 h-5 w-5 text-green-500" />
            <p className="text-2xl font-extrabold text-slate-950">
              {approvedMuralMessages.length}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              itens aprovados
            </p>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white p-4 shadow-sm">
            <HeartHandshake className="mb-2 h-5 w-5 text-amber-500" />
            <p className="text-2xl font-extrabold text-slate-950">
              {pendingTestimonies.length}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              testemunhos pendentes
            </p>
          </div>

          <div className="rounded-3xl border border-pink-100 bg-white p-4 shadow-sm">
            <Heart className="mb-2 h-5 w-5 text-pink-500" />
            <p className="text-2xl font-extrabold text-slate-950">
              {activePrayerRequests.length}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              pedidos ativos
            </p>
          </div>

          <div className="rounded-3xl border border-violet-100 bg-white p-4 shadow-sm">
            <Users className="mb-2 h-5 w-5 text-violet-500" />
            <p className="text-2xl font-extrabold text-slate-950">
              {userScores.length}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              participantes
            </p>
          </div>
        </section>

        <nav className="mb-5 grid grid-cols-3 gap-2 rounded-3xl border border-purple-100 bg-white p-2 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-xs font-extrabold transition ${
                  active
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-100"
                    : "text-slate-500 hover:bg-purple-50 hover:text-purple-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {activeTab === "mural" && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="rounded-3xl border border-purple-100 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-950">
                Moderação do Mural
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Aprove, oculte ou exclua expectativas e testemunhos enviados pelos irmãos.
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-purple-50 px-3 py-2">
                  <p className="text-xs font-extrabold text-purple-700">
                    Expectativas
                  </p>
                  <p className="text-[11px] text-purple-700/70">
                    Mensagens sobre o que os irmãos esperam que Deus fale no congresso.
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-50 px-3 py-2">
                  <p className="text-xs font-extrabold text-amber-700">
                    Testemunhos
                  </p>
                  <p className="text-[11px] text-amber-700/70">
                    Relatos de bênçãos, respostas e experiências para edificar a igreja.
                  </p>
                </div>
              </div>
            </div>

            {muralQuery.isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-7 w-7 animate-spin text-purple-600" />
              </div>
            ) : muralQuery.error ? (
              <ErrorState message={muralQuery.error.message} />
            ) : muralMessages.length === 0 ? (
              <EmptyState
                icon={MessageCircle}
                title="Nenhum item no mural"
                description="Quando os irmãos enviarem expectativas ou testemunhos, eles aparecerão aqui para revisão."
              />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {muralMessages.map((message) => {
                  const typeMeta = getMuralTypeMeta(message.post_type);
                  const TypeIcon = typeMeta.icon;

                  return (
                    <div
                      key={message.id}
                      className={`rounded-3xl border bg-white p-4 shadow-sm ${
                        message.is_approved
                          ? typeMeta.borderClass
                          : typeMeta.pendingClass
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <div className="mb-1 flex flex-wrap items-center gap-1.5">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-extrabold ${typeMeta.badgeClass}`}>
                              <TypeIcon className="h-3 w-3" />
                              {typeMeta.label}
                            </span>

                            <span
                              className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${
                                message.is_approved
                                  ? "bg-green-100 text-green-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {message.is_approved ? "Aprovada" : "Pendente"}
                            </span>
                          </div>

                          <p className="text-sm font-extrabold text-slate-900">
                            {message.author_name || "Anônimo"}
                          </p>

                          <p className="text-[11px] font-semibold text-slate-400">
                            {formatDate(message.created_at)}
                          </p>
                        </div>
                      </div>

                      <p className="mb-4 text-sm leading-relaxed text-slate-700">
                        {message.message}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {!message.is_approved ? (
                          <Button
                            size="sm"
                            disabled={approveMuralMutation.isPending}
                            onClick={() => approveMuralMutation.mutate(message.id)}
                            className="rounded-xl bg-green-600 text-white hover:bg-green-700"
                          >
                            <CheckCircle2 className="mr-1 h-4 w-4" />
                            Aprovar
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={hideMuralMutation.isPending}
                            onClick={() => hideMuralMutation.mutate(message.id)}
                            className="rounded-xl border-amber-200 text-amber-700"
                          >
                            <EyeOff className="mr-1 h-4 w-4" />
                            Ocultar
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          disabled={deleteMuralMutation.isPending}
                          onClick={() =>
                            confirmDelete(
                              `Excluir este ${typeMeta.label.toLowerCase()} do mural?`,
                              () => deleteMuralMutation.mutate(message.id)
                            )
                          }
                          className="rounded-xl border-red-100 text-red-600"
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.section>
        )}

        {activeTab === "oracoes" && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="rounded-3xl border border-pink-100 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-950">
                Pedidos de Oração
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Acompanhe os pedidos recebidos com cuidado e sigilo.
              </p>
            </div>

            {prayersQuery.isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-7 w-7 animate-spin text-purple-600" />
              </div>
            ) : prayersQuery.error ? (
              <ErrorState message={prayersQuery.error.message} />
            ) : prayerRequests.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="Nenhum pedido recebido"
                description="Quando os irmãos enviarem pedidos de oração, eles aparecerão aqui."
              />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {[...activePrayerRequests, ...archivedPrayerRequests].map((request) => (
                  <div
                    key={request.id}
                    className={`rounded-3xl border bg-white p-4 shadow-sm ${
                      request.is_archived
                        ? "border-slate-100 opacity-70"
                        : "border-pink-100"
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-extrabold text-slate-900">
                          {request.is_anonymous
                            ? "Anônimo"
                            : request.author_name || "Anônimo"}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-400">
                          {formatDate(request.created_at)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {request.is_prayed && (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-extrabold text-green-700">
                            Orado
                          </span>
                        )}

                        {request.is_archived && (
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-extrabold text-slate-600">
                            Arquivado
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mb-4 text-sm leading-relaxed text-slate-700">
                      {request.prayer_text}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={markPrayerMutation.isPending}
                        onClick={() =>
                          markPrayerMutation.mutate({
                            id: request.id,
                            value: !request.is_prayed,
                          })
                        }
                        className="rounded-xl border-green-100 text-green-700"
                      >
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        {request.is_prayed ? "Desmarcar" : "Marcar orado"}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={archivePrayerMutation.isPending}
                        onClick={() =>
                          archivePrayerMutation.mutate({
                            id: request.id,
                            value: !request.is_archived,
                          })
                        }
                        className="rounded-xl border-slate-200 text-slate-700"
                      >
                        <Archive className="mr-1 h-4 w-4" />
                        {request.is_archived ? "Restaurar" : "Arquivar"}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={deletePrayerMutation.isPending}
                        onClick={() =>
                          confirmDelete("Excluir este pedido de oração?", () =>
                            deletePrayerMutation.mutate(request.id)
                          )
                        }
                        className="rounded-xl border-red-100 text-red-600"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {activeTab === "participacao" && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="rounded-3xl border border-amber-100 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-950">
                Caminhada dos Participantes
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Acompanhe os registros de participação e remova duplicidades ou testes.
              </p>
            </div>

            {scoresQuery.isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-7 w-7 animate-spin text-purple-600" />
              </div>
            ) : scoresQuery.error ? (
              <ErrorState message={scoresQuery.error.message} />
            ) : userScores.length === 0 ? (
              <EmptyState
                icon={Trophy}
                title="Nenhuma participação registrada"
                description="Quando os irmãos registrarem sua caminhada, os dados aparecerão aqui."
              />
            ) : (
              <div className="overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm">
                {userScores.map((score, index) => (
                  <div
                    key={score.id}
                    className="flex items-center gap-3 border-b border-slate-100 p-4 last:border-b-0"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-sm font-extrabold text-amber-700">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold text-slate-900">
                        {score.player_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {score.completed_phases || 0} etapas · {formatDate(score.created_at)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-extrabold text-slate-900">
                        {score.score}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-400">
                        pontos
                      </p>
                    </div>

                    <Button
                      size="icon"
                      variant="outline"
                      disabled={deleteScoreMutation.isPending}
                      onClick={() =>
                        confirmDelete("Excluir esta participação?", () =>
                          deleteScoreMutation.mutate(score.id)
                        )
                      }
                      className="h-9 w-9 rounded-xl border-red-100 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        )}
      </div>
    </div>
  );
}