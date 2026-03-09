
import { 
  ShoppingBag, Heart, Lightbulb, Users, Megaphone, HelpCircle, 
  Star, ShieldCheck, ListOrdered, TrendingUp, AlertTriangle, MessageCircle, 
  BookOpen, Target, Award, Scale, Clock, Smile, Trophy, FileText, Flag, Repeat, Layers
} from 'lucide-react';

export interface Template {
  id: string;
  title: string;
  description: string;
  category: 'Vendas' | 'Engajamento' | 'Educativo' | 'Institucional';
  icon: any;
  prompt: string;
}

export const TEMPLATES: Template[] = [
  // --- VENDAS ---
  {
    id: 'promo-fomo',
    title: 'Promoção Relâmpago',
    description: 'Gere urgência e FOMO para uma oferta que expira em poucas horas.',
    category: 'Vendas',
    icon: Megaphone,
    prompt: 'Crie uma promoção relâmpago de 24 horas para meu produto. Use gatilhos de escassez e urgência extrema. Comece com uma headline impactante sobre perder uma oportunidade.',
  },
  {
    id: 'product-launch',
    title: 'Lançamento de Produto',
    description: 'Apresente uma novidade destacando os principais benefícios.',
    category: 'Vendas',
    icon: ShoppingBag,
    prompt: 'Crie um post de lançamento para uma nova funcionalidade/produto. Foque no benefício principal (transformação) e não apenas nas características técnicas. Gere curiosidade.',
  },
  {
    id: 'social-proof',
    title: 'Prova Social (Review)',
    description: 'Transforme um depoimento de cliente em uma história de sucesso.',
    category: 'Vendas',
    icon: Star,
    prompt: 'Escreva um post baseada em um estudo de caso ou depoimento de cliente. Estruture como: "O Problema do Cliente" -> "A Solução (Meu Produto)" -> "O Resultado Incrível".',
  },
  {
    id: 'pain-agitation',
    title: 'Dor x Solução (PAS)',
    description: 'Toque na ferida do cliente e apresente seu produto como o único remédio.',
    category: 'Vendas',
    icon: Target,
    prompt: 'Use a estrutura PAS (Problema, Agitação, Solução). Identifique uma dor latente do meu público, intensifique essa dor mostrando as consequências de ignorá-la, e apresente meu produto como a solução definitiva.',
  },
  {
    id: 'product-comparison',
    title: 'Comparativo de Soluções',
    description: 'Ajude o cliente a escolher mostrando porque sua opção é superior.',
    category: 'Vendas',
    icon: Scale,
    prompt: 'Crie um post comparativo "Opção Comum vs. Minha Solução". Destaque 3 pontos onde meu produto vence a concorrência (preço, qualidade, velocidade) sem citar nomes de concorrentes diretamente.',
  },
  {
    id: 'last-units',
    title: 'Últimas Unidades',
    description: 'Aviso final de escassez para fechar vendas pendentes.',
    category: 'Vendas',
    icon: Clock,
    prompt: 'Crie um post de "Última Chamada". O estoque está acabando ou as vagas estão fechando. Use tom de urgência real e chame para o link da bio imediatamente.',
  },
   {
    id: 'objection-killer',
    title: 'Quebra de Objeção',
    description: 'Responda o motivo nº 1 que impede seu cliente de comprar.',
    category: 'Vendas',
    icon: ShieldCheck,
    prompt: 'Identifique a maior objeção de compra do meu nicho (ex: "está caro" ou "não tenho tempo") e crie um post que desmonte esse argumento com lógica e empatia, provando o valor do investimento.',
  },

  // --- ENGAJAMENTO ---
  {
    id: 'inspire-quote',
    title: 'Frase Inspiradora',
    description: 'Conecte-se emocionalmente com seu público através de uma visão forte.',
    category: 'Engajamento',
    icon: Heart,
    prompt: 'Crie um post inspirador que conecte os valores da minha marca com um estilo de vida aspiracional. Use uma linguagem poética mas acessível.',
  },
  {
    id: 'unpopular-opinion',
    title: 'Opinião Impopular',
    description: 'Gere debate com uma opinião contrária ao senso comum do mercado.',
    category: 'Engajamento',
    icon: AlertTriangle,
    prompt: 'Escreva um "Opinião Impopular" sobre o meu nicho de mercado. Algo que todos fazem errado, mas minha marca faz diferente. Seja polêmico, mas respeitoso, para gerar comentários.',
  },
  {
    id: 'trend-alert',
    title: 'Alerta de Tendência',
    description: 'Posicione-se como pioneiro comentando uma novidade do setor.',
    category: 'Engajamento',
    icon: TrendingUp,
    prompt: 'Crie um post de "Trend Alert". Identifique uma tendência atual no meu nicho e dê minha opinião profissional sobre ela (se vai durar ou se é passageira).',
  },
  {
    id: 'this-or-that',
    title: 'Batalha: Isso ou Aquilo',
    description: 'Uma comparação simples para fazer os seguidores votarem.',
    category: 'Engajamento',
    icon: MessageCircle,
    prompt: 'Crie um post de batalha "Isso ou Aquilo" relacionado ao meu nicho. Coloque duas opções comuns frente a frente e peça para os seguidores votarem nos comentários.',
  },
  {
    id: 'relatable-meme',
    title: 'Situação Relacionável',
    description: 'Humor leve sobre os perrengues do dia a dia do seu cliente.',
    category: 'Engajamento',
    icon: Smile,
    prompt: 'Crie uma legenda para um meme ou imagem engraçada sobre um "perrengue" comum que meu público alvo passa. Use humor leve e autodepreciativo para gerar identificação.',
  },
  {
    id: 'challenge-week',
    title: 'Desafio da Semana',
    description: 'Mova sua comunidade para uma ação prática.',
    category: 'Engajamento',
    icon: Trophy,
    prompt: 'Crie um "Desafio da Semana" para meus seguidores. Algo simples e realizável em 7 dias relacionado ao meu nicho. Peça para postarem os resultados e marcarem a página.',
  },
  {
    id: 'fill-blanks',
    title: 'Complete a Frase',
    description: 'A maneira mais fácil de conseguir comentários.',
    category: 'Engajamento',
    icon: MessageCircle,
    prompt: 'Crie um post interativo de "Complete a Frase". Exemplo: "Se eu pudesse ter apenas uma ferramenta de [meu nicho], seria ______". Incentive a resposta nos comentários.',
  },

  // --- EDUCATIVO ---
  {
    id: 'expert-tip',
    title: 'Dica de Especialista',
    description: 'Mostre autoridade entregando valor real e prático para seus seguidores.',
    category: 'Educativo',
    icon: Lightbulb,
    prompt: 'Crie um post educativo com 3 dicas práticas e pouco conhecidas sobre como meu serviço resolve um problema comum do cliente.',
  },
  {
    id: 'creative-faq',
    title: 'FAQ Criativo',
    description: 'Responda as principais dúvidas de forma leve e vendedora.',
    category: 'Educativo',
    icon: HelpCircle,
    prompt: 'Selecione uma objeção ou dúvida muito comum dos clientes sobre meu nicho e responda de forma criativa, definitiva e que quebre a barreira de compra.',
  },
  {
    id: 'myth-buster',
    title: 'Mito vs. Verdade',
    description: 'Quebre crenças limitantes do seu público com fatos.',
    category: 'Educativo',
    icon: ShieldCheck,
    prompt: 'Crie um post "Mito vs. Verdade". Cite um mito muito comum que atrapalha meu cliente e revele a verdade por trás dele, posicionando minha marca como autoridade.',
  },
  {
    id: 'step-by-step',
    title: 'Tutorial Passo a Passo',
    description: 'Ensine algo rápido que gere uma pequena vitória para o cliente.',
    category: 'Educativo',
    icon: ListOrdered,
    prompt: 'Crie um mini-tutorial de 5 passos ensinando meu cliente a resolver um problema simples relacionado ao meu nicho. Use emojis para listar os passos.',
  },
  {
    id: 'checklist',
    title: 'Checklist Essencial',
    description: 'Uma lista prática para o cliente salvar e consultar depois.',
    category: 'Educativo',
    icon: BookOpen,
    prompt: 'Crie um "Checklist Essencial" para o meu cliente atingir um objetivo específico. Liste 5 a 7 itens que ele não pode esquecer.',
  },
  {
    id: 'niche-glossary',
    title: 'Glossário do Nicho',
    description: 'Explique um termo técnico de forma simples.',
    category: 'Educativo',
    icon: FileText,
    prompt: 'Escolha um termo técnico ou sigla do meu mercado que confunde os iniciantes e explique o significado de forma didática, como se fosse para uma criança de 10 anos.',
  },
  {
    id: 'mistake-fix',
    title: 'Erro x Correção',
    description: 'Aponte um erro comum e ensine o jeito certo.',
    category: 'Educativo',
    icon: Repeat,
    prompt: 'Crie um carrossel "Pare de fazer isso / Comece a fazer isso". Identifique um hábito prejudicial comum no meu nicho e ofereça a alternativa correta e mais eficiente.',
  },
  {
    id: 'curated-tools',
    title: 'Top Ferramentas',
    description: 'Compartilhe recursos que ajudam seu cliente.',
    category: 'Educativo',
    icon: Layers,
    prompt: 'Liste 3 a 5 ferramentas (apps, sites ou livros) indispensáveis para quem quer ter sucesso no meu nicho. Explique brevemente por que cada uma é útil.',
  },

  // --- INSTITUCIONAL ---
  {
    id: 'behind-scenes',
    title: 'Bastidores da Marca',
    description: 'Humanize sua empresa mostrando o processo e as pessoas por trás.',
    category: 'Institucional',
    icon: Users,
    prompt: 'Crie uma legenda para um post de bastidores (Behind the Scenes), mostrando o cuidado, a dedicação e o processo artesanal/técnico na criação dos nossos produtos.',
  },
  {
    id: 'founder-story',
    title: 'História de Origem',
    description: 'Conecte através da vulnerabilidade e da jornada do herói.',
    category: 'Institucional',
    icon: BookOpen,
    prompt: 'Escreva um post contando uma breve história de superação ou o "porquê" a marca foi criada. Foque na missão e nos valores, gerando conexão emocional.',
  },
  {
    id: 'award-milestone',
    title: 'Celebração de Marco',
    description: 'Compartilhe uma conquista e agradeça aos clientes.',
    category: 'Institucional',
    icon: Award,
    prompt: 'Crie um post celebrando uma conquista recente da empresa (ex: número de clientes, aniversário, prêmio). O foco deve ser agradecer aos clientes por tornarem isso possível.',
  },
  {
    id: 'brand-manifesto',
    title: 'Manifesto da Marca',
    description: 'Declare suas crenças e atraia quem pensa igual.',
    category: 'Institucional',
    icon: Flag,
    prompt: 'Escreva um manifesto curto e poderoso sobre o que minha marca acredita. Comece com "Nós acreditamos que..." ou "O mundo precisa de mais...". Polarize levemente para atrair a tribo certa.',
  },
  {
    id: 'team-spotlight',
    title: 'Conheça o Time',
    description: 'Apresente quem faz a mágica acontecer.',
    category: 'Institucional',
    icon: Users,
    prompt: 'Crie um post apresentando um membro do time (ou o criador). Destaque uma curiosidade pessoal, a função na empresa e o "superpoder" dessa pessoa em ajudar os clientes.',
  }
];
