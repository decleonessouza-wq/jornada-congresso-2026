import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const cardStyles = [
  'from-purple-100 to-purple-50 border-purple-200',
  'from-amber-100 to-amber-50 border-amber-200',
  'from-blue-100 to-blue-50 border-blue-200',
  'from-green-100 to-green-50 border-green-200',
  'from-pink-100 to-pink-50 border-pink-200',
  'from-violet-100 to-violet-50 border-violet-200',
  'from-cyan-100 to-cyan-50 border-cyan-200',
  'from-rose-100 to-rose-50 border-rose-200',
];

export default function Mural() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['muralPosts'],
    queryFn: () => base44.entities.MuralPost.list('-created_date', 50),
  });

  const createPost = useMutation({
    mutationFn: (data) => base44.entities.MuralPost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['muralPosts'] });
      setName('');
      setMessage('');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    createPost.mutate({ author_name: name.trim() || 'Anônimo', message: message.trim() });
  };

  return (
    <div className="px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-foreground mb-0.5">Mural da Jornada</h1>
        <p className="text-sm text-muted-foreground mb-5">
          O que você espera que Deus fale com você no congresso?
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100 mb-6"
      >
        <Input
          placeholder="Seu nome (opcional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-3 rounded-xl"
        />
        <Textarea
          placeholder="Compartilhe sua expectativa para o congresso..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mb-3 rounded-xl min-h-[80px] text-sm"
        />
        <Button
          type="submit"
          disabled={!message.trim() || createPost.isPending}
          className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold"
        >
          <Send className="h-4 w-4 mr-2" /> Compartilhar
        </Button>
      </motion.form>

      {/* Posts */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-7 h-7 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-medium">Seja o primeiro a compartilhar!</p>
          <p className="text-xs mt-1">Sua voz faz parte dessa jornada</p>
        </div>
      ) : (
        <div className="columns-2 gap-3 space-y-3">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="break-inside-avoid"
            >
              <div className={`bg-gradient-to-br ${cardStyles[idx % cardStyles.length]} rounded-2xl p-4 border`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center">
                    <User className="h-3 w-3 text-purple-500" />
                  </div>
                  <span className="text-xs font-bold text-foreground">{post.author_name}</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">{post.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}