export const phases = [
  {
    id: "1",
    title: "Alegria na Esperança",
    subtitle: "A alegria que nasce da esperança em Deus",
    iconName: "Sun",
    gradient: "from-amber-400 to-orange-500",
    lightBg: "bg-amber-50",
    borderColor: "border-amber-300",
    textColor: "text-amber-600",
    badgeColor: "bg-amber-100 text-amber-700",
    summary: "A alegria cristã não depende das circunstâncias, mas da esperança que temos em Cristo. Quando nossos olhos estão fixos nas promessas de Deus, nosso coração transborda de alegria, mesmo em meio às dificuldades.",
    videoUrl: "",
    quiz: [
      {
        question: "Segundo Romanos 12:12, devemos nos alegrar em quê?",
        options: ["Na riqueza", "Na esperança", "Nas circunstâncias", "Na sabedoria"],
        correct: 1
      },
      {
        question: "O que é a esperança cristã?",
        options: ["Um desejo incerto", "Confiança firme nas promessas de Deus", "Otimismo natural", "Pensamento positivo"],
        correct: 1
      },
      {
        question: "Qual livro da Bíblia diz 'Alegrai-vos na esperança'?",
        options: ["Salmos", "Provérbios", "Romanos", "Hebreus"],
        correct: 2
      }
    ],
    crossword: [
      { word: "ALEGRIA", display: "ALEGRIA", clue: "Sentimento que Romanos 12:12 nos manda ter" },
      { word: "ESPERANCA", display: "ESPERANÇA", clue: "Fundamento da alegria cristã" },
      { word: "GOZO", display: "GOZO", clue: "Alegria profunda que vem do Espírito" },
      { word: "LOUVOR", display: "LOUVOR", clue: "Expressão de gratidão a Deus" }
    ],
    challenge: "Durante esta semana, anote 3 motivos de alegria e gratidão a Deus todos os dias.",
    badge: "Selo da Alegria"
  },
  {
    id: "2",
    title: "Paciência na Tribulação",
    subtitle: "Firmeza espiritual em meio às lutas",
    iconName: "Shield",
    gradient: "from-blue-400 to-cyan-500",
    lightBg: "bg-blue-50",
    borderColor: "border-blue-300",
    textColor: "text-blue-600",
    badgeColor: "bg-blue-100 text-blue-700",
    summary: "A tribulação faz parte da caminhada cristã, mas Deus nos capacita a ser pacientes. A paciência não é passividade — é confiança ativa de que Deus está no controle e cumprirá Suas promessas.",
    videoUrl: "",
    quiz: [
      {
        question: "O que Romanos 12:12 nos ensina sobre a tribulação?",
        options: ["Fugir dela", "Reclamar", "Ser pacientes nela", "Ignorá-la"],
        correct: 2
      },
      {
        question: "A paciência na tribulação é fruto de quê?",
        options: ["Força própria", "Indiferença", "Obra do Espírito Santo", "Costume"],
        correct: 2
      },
      {
        question: "O que Tiago 1:3 diz que a provação da fé produz?",
        options: ["Tristeza", "Perseverança", "Medo", "Dúvida"],
        correct: 1
      }
    ],
    crossword: [
      { word: "PACIENCIA", display: "PACIÊNCIA", clue: "Virtude que nos sustenta nas provas" },
      { word: "FIRMEZA", display: "FIRMEZA", clue: "Qualidade de quem permanece inabalável" },
      { word: "GRACA", display: "GRAÇA", clue: "Favor imerecido de Deus que nos fortalece" },
      { word: "RESISTIR", display: "RESISTIR", clue: "Não ceder diante das dificuldades" }
    ],
    challenge: "Identifique uma dificuldade que você está enfrentando e entregue a Deus em oração, confiando na Sua fidelidade.",
    badge: "Selo da Paciência"
  },
  {
    id: "3",
    title: "Perseverança na Oração",
    subtitle: "Constância em buscar a face de Deus",
    iconName: "Flame",
    gradient: "from-violet-500 to-purple-600",
    lightBg: "bg-violet-50",
    borderColor: "border-violet-300",
    textColor: "text-violet-600",
    badgeColor: "bg-violet-100 text-violet-700",
    summary: "A oração é o combustível da vida espiritual. Perseverar na oração é manter uma conexão constante com Deus, buscando Sua face não apenas nos momentos difíceis, mas em todos os momentos.",
    videoUrl: "",
    quiz: [
      {
        question: "Romanos 12:12 nos exorta a perseverar em quê?",
        options: ["No trabalho", "Na oração", "Nos estudos", "Nas viagens"],
        correct: 1
      },
      {
        question: "Qual personagem bíblico orou sem cessar por 3 semanas?",
        options: ["Moisés", "Elias", "Daniel", "Davi"],
        correct: 2
      },
      {
        question: "O que 1 Tessalonicenses 5:17 nos manda fazer?",
        options: ["Orar uma vez ao dia", "Orar sem cessar", "Orar só na igreja", "Orar só nos problemas"],
        correct: 1
      }
    ],
    crossword: [
      { word: "ORACAO", display: "ORAÇÃO", clue: "Conversa íntima com Deus" },
      { word: "CLAMOR", display: "CLAMOR", clue: "Oração intensa e profunda" },
      { word: "JEJUM", display: "JEJUM", clue: "Prática que acompanha a oração" },
      { word: "VIGILIA", display: "VIGÍLIA", clue: "Tempo dedicado à oração durante a noite" }
    ],
    challenge: "Separe 15 minutos extras por dia esta semana para orar pelo congresso e pelos irmãos.",
    badge: "Selo da Oração"
  }
];

export function getPhaseById(id) {
  return phases.find(p => p.id === String(id));
}