import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Send, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function PrayerRequests() {
  const [name, setName] = useState('');
  const [request, setRequest] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [sent, setSent] = useState(false);

  const createRequest = useMutation({
    mutationFn: (data) => base44.entities.PrayerRequest.create(data),
    onSuccess: () => {
      setSent(true);
      setName('');
      setRequest('');
      setAnonymous(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!request.trim()) return;
    createRequest.mutate({
      author_name: anonymous ? 'Anônimo' : (name.trim() || 'Anônimo'),
      prayer_text: request.trim(),
      is_anonymous: anonymous,
    });
  };

  return (
    <div className="px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-foreground mb-0.5">Pedido de Oração</h1>
        <p className="text-sm text-muted-foreground mb-5">Compartilhe seu coração conosco</p>
      </motion.div>

      {/* Encouragement card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 mb-6 border border-purple-100"
      >
        <Heart className="h-6 w-6 text-pink-400 mb-2" />
        <p className="text-sm text-foreground leading-relaxed">
          A liderança da igreja estará orando por cada pedido recebido. Sinta-se à vontade para
          compartilhar o que está em seu coração. Seu pedido será tratado com amor e sigilo.
        </p>
      </motion.div>

      {sent ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-green-200 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="font-extrabold text-foreground text-lg mb-2">Pedido enviado!</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Estaremos orando por você. Deus ouve e responde cada oração. 🙏
          </p>
          <Button onClick={() => setSent(false)} variant="outline" className="rounded-xl">
            Enviar outro pedido
          </Button>
        </motion.div>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          {!anonymous && (
            <div className="mb-4">
              <label className="text-sm font-bold text-foreground mb-1.5 block">Nome (opcional)</label>
              <Input
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="text-sm font-bold text-foreground mb-1.5 block">Seu pedido de oração</label>
            <Textarea
              placeholder="Escreva aqui o que você gostaria que orássemos por você..."
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              className="rounded-xl min-h-[120px] text-sm"
            />
          </div>

          <div className="flex items-center gap-2.5 mb-6">
            <Checkbox id="anon" checked={anonymous} onCheckedChange={setAnonymous} />
            <label htmlFor="anon" className="text-sm text-muted-foreground cursor-pointer select-none">
              Quero enviar de forma anônima
            </label>
          </div>

          <Button
            type="submit"
            disabled={!request.trim() || createRequest.isPending}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white py-6 text-base font-bold active:scale-[0.98] transition-all"
          >
            <Send className="h-4 w-4 mr-2" /> Enviar pedido
          </Button>
        </motion.form>
      )}
    </div>
  );
}