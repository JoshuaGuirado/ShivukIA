
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'pt-br' | 'en' | 'es';
type Theme = 'dark' | 'light';

// Translations Dictionary
const translations = {
  'pt-br': {
    sidebar: {
      chat: 'Chat / Criar',
      ideas: 'Menu de Ideias',
      brands: 'Minhas Marcas',
      library: 'Biblioteca',
      analytics: 'Analytics',
      about: 'Sobre o Site',
      settings: 'Configurações',
      profile: 'Perfil',
      logout: 'Encerrar Sessão',
      plan: 'Plano Profissional',
      status: 'Status do Plano',
      manage: 'Gerenciar Assinatura'
    },
    header: {
      studio: 'Estúdio de Criação',
      ideas: 'Menu de Ideias',
      brands: 'Gerenciar Marcas',
      library: 'Biblioteca de Ativos',
      analytics: 'Dados & Insights',
      about: 'Informações do Sistema',
      settings: 'Configurações de Conta',
      profile: 'Meu Perfil',
      role: 'Diretor Criativo',
      account: 'Conta Pro'
    },
    mainChat: {
        subtitle: 'Motor de Geração Criativa 2.0',
        context: 'Contexto 2026 Ativo',
        socialPost: 'Post Social',
        veoVideo: 'Vídeo Veo',
        captionMode: 'Legenda IA', 
        persona: 'Persona',
        platform: 'Plataforma',
        visualStyle: 'Estilo Visual',
        cineStyle: 'Estilo Cinematográfico',
        placeholderPost: 'O que vamos criar hoje no',
        placeholderVideo: 'Descreva a cena do vídeo...',
        placeholderCaption: 'Adicione detalhes extras sobre a foto (opcional)...', 
        chars: 'CARACTERES',
        veoReady: 'MOTOR VEO PRONTO',
        visionReady: 'VISÃO COMPUTACIONAL ATIVA', 
        generating: 'Renderizando...',
        enableVeo: 'Habilitar Veo (API Key)',
        generateVideo: 'Gerar Vídeo + Legenda',
        generateContent: 'Gerar Conteúdo',
        generateCaption: 'Ler Imagem e Gerar Legenda', 
        uploadRequired: 'Upload de Imagem Necessário', 
        pipeline: 'Motor Neural em Atividade',
        success: 'Ativo Gerado com Sucesso',
        generateVariation: 'Gerar Variação',
        videoRendered: 'Vídeo Renderizado (Veo)',
        generateOther: 'Gerar Outro'
    },
    personas: {
        joshua: 'Joshua — Analítico',
        joshuaDesc: 'Focado em dados, lógica, métricas e growth hacking.',
        gabriel: 'Gabriel — Estratégia de Funil',
        gabrielDesc: 'Especialista em etapas de consciência e conversão.',
        caelum: 'Caelum — Conexão Humana',
        caelumDesc: 'Empático, focado em storytelling, branding e comunidade.',
        nyx: 'Nyx — Vendas (Hard Sell)',
        nyxDesc: 'Persuasiva, agressiva, uso de gatilhos mentais e fechamento.',
        ziggy: 'Ziggy — Humor & Entretenimento',
        ziggyDesc: 'Engraçada, usa memes, sarcasmo leve e situações relacionáveis do dia a dia.',
        kai: 'Kai — Hype & Trends',
        kaiDesc: 'Conectado, linguagem Gen-Z, focado em virais e tendências do momento.',
        solara: 'Solara — Sofisticação & Luxo',
        solaraDesc: 'Elegante, minimalista, focada em exclusividade e alto padrão.'
    },
    brands: {
        title: 'Brand Center',
        subtitle: 'Gerencie sua identidade visual e ativos de marca.',
        save: 'Salvar Alterações',
        saved: 'Configurações aplicadas com sucesso!',
        nameColors: 'Nome & Cores',
        brandName: 'Nome da Marca',
        primary: 'Primária',
        secondary: 'Secundária',
        accent: 'Acento',
        gallery: 'Galeria de Logos',
        add: 'Adicionar',
        tip: 'Dica de Design: Para melhor legibilidade, envie logos com fundo transparente (PNG) e resolução mínima de 500x500px.',
        noLogo: 'Nenhuma logo enviada',
        useAsset: 'Usar Ativo',
        remove: 'Remover',
        preview: 'Preview ao Vivo',
        draft: 'Aviso de Rascunho',
        draftDesc: 'As alterações acima são rascunhos. Clique em Salvar Alterações para persistir.'
    },
    library: {
        title: 'Biblioteca de Ativos',
        subtitle: 'Gerencie todos os posts gerados e salvos automaticamente.',
        search: 'Buscar nos arquivos...',
        clear: 'Limpar Biblioteca',
        emptyTitle: 'Nenhum post encontrado',
        emptyDesc: 'Comece a criar no chat para ver seus ativos aparecerem aqui automaticamente.',
        slides: 'Slides',
        copy: 'Copiar',
        copied: 'Copiado'
    },
    templates: {
        title: 'Menu de Ideias',
        subtitle: 'Escolha um template estrategicamente desenhado para converter e engajar.',
        use: 'Usar este template',
        promoTitle: 'Promoção Relâmpago',
        promoDesc: 'Gere urgência e FOMO para uma oferta que expira em poucas horas.',
        inspireTitle: 'Frase Inspiradora',
        inspireDesc: 'Conecte-se emocionalmente com seu público através de uma visão forte.',
        expertTitle: 'Dica de Especialista',
        expertDesc: 'Mostre autoridade entregando valor real e prático para seus seguidores.',
        behindTitle: 'Bastidores da Marca',
        behindDesc: 'Humanize sua empresa mostrando o processo e as pessoas por trás.',
        launchTitle: 'Lançamento de Produto',
        launchDesc: 'Apresente uma novidade destacando os principais benefícios.',
        faqTitle: 'FAQ Criativo',
        faqDesc: 'Responda as principais dúvidas de forma leve e vendedora.'
    },
    about: {
        badge: 'Nossa Essência',
        title1: 'Mais do que Código,',
        title2: 'Uma Missão.',
        subtitle: 'Conheça a história por trás da inteligência que impulsiona o seu marketing.',
        founderRole: 'CEO & Founder • 19 Anos',
        location: 'Maringá, PR',
        quote: '"Acredito que a idade é apenas um número quando a vontade de mudar o mundo é gigante. O Shivuk nasceu para ser a extensão da nossa imaginação."',
        mission1Title: 'Acelerar Resultados',
        mission1Desc: 'O marketing não precisa ser lento. Automatizamos o processo.',
        mission2Title: 'Desbloqueio Criativo',
        mission2Desc: 'O fim da tela em branco. Ideias em segundos.',
        mission3Title: 'Democratizar a IA',
        mission3Desc: 'Tecnologia de ponta acessível e intuitiva para todos.',
        philosophyTitle: 'Nossa Filosofia Digital',
        philosophyDesc: 'Construímos pontes entre a genialidade humana e a eficiência da máquina.',
        madeWith: 'Feito com 💜 em Maringá para o mundo.'
    },
    plans: {
        title: 'Escolha seu Poder',
        subtitle: 'Desbloqueie todo o potencial do Shivuk AI com planos desenhados para escalar sua criatividade.',
        starter: 'Starter',
        starterDesc: 'Para criadores iniciantes explorando o poder da IA.',
        pro: 'Professional',
        proDesc: 'Potência total para freelancers e growth hackers.',
        agency: 'Agency',
        agencyDesc: 'Solução enterprise para agências e times grandes.',
        currentPlan: 'Plano Atual',
        upgrade: 'Fazer Upgrade',
        contactSales: 'Falar com Vendas',
        month: '/mês',
        consult: 'Sob Consulta',
        recommended: 'Recomendado'
    },
    analytics: {
        title: 'Performance Studio',
        subtitle: 'Visão geral da sua produção de conteúdo criativo.',
        totalAssets: 'Total de Ativos',
        totalSub: 'Posts gerados no total',
        weekly: 'Produção Semanal',
        weeklySub: 'Nos últimos 7 dias',
        topPlatform: 'Plataforma Top',
        topPlatformSub: 'Canal mais utilizado',
        videosCreated: 'Vídeos Criados',
        videosSub: 'Conteúdo Veo/Motion',
        volumeTitle: 'Volume por Canal',
        insightsTitle: 'Insights Rápidos',
        noData: 'Nenhum dado disponível ainda.'
    },
    profile: {
        title: 'Meu Perfil',
        subtitle: 'Gerencie sua identidade visual e informações profissionais.',
        personalData: 'Dados Pessoais',
        personalDataSub: 'Informações visíveis no seu estúdio',
        name: 'Nome Completo',
        email: 'E-mail Profissional',
        role: 'Cargo ou Título',
        bio: 'Sobre Mim (Bio)',
        upload: 'Upload de Foto',
        save: 'Salvar Alterações',
        processing: 'Processando...',
        privacyTitle: 'Controle Total de Privacidade',
        privacyText: 'Seus dados e foto são salvos exclusivamente no seu cache local.'
    },
    settings: {
      title: 'Configurações',
      desc: 'Gerencie suas preferências de sistema e conta.',
      appearance: 'Aparência do Sistema',
      appearanceDesc: 'Escolha seu ambiente de trabalho',
      viewMode: 'Modo de Exibição',
      light: 'Claro',
      dark: 'Escuro',
      language: 'Idioma e Região',
      notifications: 'Notificações',
      advanced: 'Modo Avançado',
      advancedDesc: 'Habilite recursos de alta qualidade (Veo/Pro Images)',
      danger: 'Zona de Perigo',
      deleteBtn: 'Excluir minha conta',
      saved: 'Preferência salva!'
    },
    preview: {
        square: 'Quadrado',
        portrait: 'Retrato',
        landscape: 'Paisagem',
        stories: 'Stories',
        download: 'Baixar Imagem',
        copy: 'Copiar',
        copied: 'Copiado!',
        caption: 'Legenda do Post',
        noImage: 'Imagem não gerada',
        tryAgain: 'Tente novamente ou use o botão de câmera para fazer upload.'
    }
  },
  'en': {
    sidebar: {
      chat: 'Chat / Create',
      ideas: 'Ideas Menu',
      brands: 'My Brands',
      library: 'Library',
      analytics: 'Analytics',
      about: 'About',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Log Out',
      plan: 'Professional Plan',
      status: 'Plan Status',
      manage: 'Manage Subscription'
    },
    header: {
      studio: 'Creative Studio',
      ideas: 'Ideas Menu',
      brands: 'Manage Brands',
      library: 'Asset Library',
      analytics: 'Data & Insights',
      about: 'System Info',
      settings: 'Account Settings',
      profile: 'My Profile',
      role: 'Creative Director',
      account: 'Pro Account'
    },
    mainChat: {
        subtitle: 'Creative Generation Engine 2.0',
        context: '2026 Context Active',
        socialPost: 'Social Post',
        veoVideo: 'Veo Video',
        captionMode: 'AI Caption', 
        persona: 'Persona',
        platform: 'Platform',
        visualStyle: 'Visual Style',
        cineStyle: 'Cinematic Style',
        placeholderPost: 'What are we creating today on',
        placeholderVideo: 'Describe the video scene...',
        placeholderCaption: 'Add extra details about the photo (optional)...', 
        chars: 'CHARACTERS',
        veoReady: 'VEO ENGINE READY',
        visionReady: 'COMPUTER VISION ACTIVE', 
        generating: 'Rendering...',
        enableVeo: 'Enable Veo (API Key)',
        generateVideo: 'Generate Video + Script',
        generateContent: 'Generate Content',
        generateCaption: 'Analyze Image & Write', 
        uploadRequired: 'Image Upload Required', 
        pipeline: 'Neural Engine Active',
        success: 'Asset Generated Successfully',
        generateVariation: 'Generate Variation',
        videoRendered: 'Video Rendered (Veo)',
        generateOther: 'Generate Another'
    },
    personas: {
        joshua: 'Joshua — Analytical',
        joshuaDesc: 'Focused on data, logic, metrics, and growth hacking.',
        gabriel: 'Gabriel — Funnel Strategy',
        gabrielDesc: 'Specialist in awareness and conversion stages.',
        caelum: 'Caelum — Human Connection',
        caelumDesc: 'Empathetic, focused on storytelling, branding, and community.',
        nyx: 'Nyx — Sales (Hard Sell)',
        nyxDesc: 'Persuasive, aggressive, uses mental triggers and closing techniques.',
        ziggy: 'Ziggy — Humor & Entertainment',
        ziggyDesc: 'Funny, uses memes, light sarcasm, and relatable daily situations.',
        kai: 'Kai — Hype & Trends',
        kaiDesc: 'Connected, Gen-Z language, focused on viral content and current trends.',
        solara: 'Solara — Sophistication & Luxury',
        solaraDesc: 'Elegant, minimalist, focused on exclusivity and high-end standards.'
    },
    brands: {
        title: 'Brand Center',
        subtitle: 'Manage your visual identity and brand assets.',
        save: 'Save Changes',
        saved: 'Settings applied successfully!',
        nameColors: 'Name & Colors',
        brandName: 'Brand Name',
        primary: 'Primary',
        secondary: 'Secondary',
        accent: 'Accent',
        gallery: 'Logo Gallery',
        add: 'Add',
        tip: 'Design Tip: For best legibility, upload logos with transparent backgrounds (PNG) and at least 500x500px resolution.',
        noLogo: 'No logo uploaded',
        useAsset: 'Use Asset',
        remove: 'Remove',
        preview: 'Live Preview',
        draft: 'Draft Notice',
        draftDesc: 'Changes above are drafts. Click Save Changes to persist.'
    },
    library: {
        title: 'Asset Library',
        subtitle: 'Manage all generated and automatically saved posts.',
        search: 'Search archives...',
        clear: 'Clear Library',
        emptyTitle: 'No posts found',
        emptyDesc: 'Start creating in the chat to see your assets appear here automatically.',
        slides: 'Slides',
        copy: 'Copy',
        copied: 'Copied'
    },
    templates: {
        title: 'Ideas Menu',
        subtitle: 'Choose a template strategically designed to convert and engage.',
        use: 'Use this template',
        promoTitle: 'Flash Sale',
        promoDesc: 'Generate urgency and FOMO for an offer expiring in a few hours.',
        inspireTitle: 'Inspirational Quote',
        inspireDesc: 'Emotionally connect with your audience through a strong vision.',
        expertTitle: 'Expert Tip',
        expertDesc: 'Show authority by delivering real practical value to your followers.',
        behindTitle: 'Brand Behind-the-Scenes',
        behindDesc: 'Humanize your company by showing the process and people behind it.',
        launchTitle: 'Product Launch',
        launchDesc: 'Introduce a novelty highlighting key benefits.',
        faqTitle: 'Creative FAQ',
        faqDesc: 'Answer main questions in a light and sales-oriented way.'
    },
    about: {
        badge: 'Our Essence',
        title1: 'More than Code,',
        title2: 'A Mission.',
        subtitle: 'Know the story behind the intelligence driving your marketing.',
        founderRole: 'CEO & Founder • 19 Years Old',
        location: 'Maringá, PR',
        quote: '"I believe age is just a number when the will to change the world is giant. Shivuk was born to be the extension of our imagination."',
        mission1Title: 'Accelerate Results',
        mission1Desc: 'Marketing doesnt need to be slow. We automate the process.',
        mission2Title: 'Creative Unblock',
        mission2Desc: 'The end of the blank screen. Ideas in seconds.',
        mission3Title: 'Democratize AI',
        mission3Desc: 'Cutting-edge technology accessible and intuitive for everyone.',
        philosophyTitle: 'Our Digital Philosophy',
        philosophyDesc: 'We build bridges between human genius and machine efficiency.',
        madeWith: 'Made with 💜 in Maringá for the world.'
    },
    plans: {
        title: 'Choose Your Power',
        subtitle: 'Unlock Shivuk AI\'s full potential with plans designed to scale your creativity.',
        starter: 'Starter',
        starterDesc: 'For beginner creators exploring AI power.',
        pro: 'Professional',
        proDesc: 'Full power for freelancers and growth hackers.',
        agency: 'Agency',
        agencyDesc: 'Enterprise solution for agencies and large teams.',
        currentPlan: 'Current Plan',
        upgrade: 'Upgrade Now',
        contactSales: 'Contact Sales',
        month: '/mo',
        consult: 'On Request',
        recommended: 'Recommended'
    },
    analytics: {
        title: 'Performance Studio',
        subtitle: 'Overview of your creative content production.',
        totalAssets: 'Total Assets',
        totalSub: 'Total generated posts',
        weekly: 'Weekly Production',
        weeklySub: 'Last 7 days',
        topPlatform: 'Top Platform',
        topPlatformSub: 'Most used channel',
        videosCreated: 'Videos Created',
        videosSub: 'Veo/Motion Content',
        volumeTitle: 'Volume by Channel',
        insightsTitle: 'Quick Insights',
        noData: 'No data available yet.'
    },
    profile: {
        title: 'My Profile',
        subtitle: 'Manage your visual identity and professional info.',
        personalData: 'Personal Data',
        personalDataSub: 'Information visible in your studio',
        name: 'Full Name',
        email: 'Professional Email',
        role: 'Role or Title',
        bio: 'About Me (Bio)',
        upload: 'Upload Photo',
        save: 'Save Changes',
        processing: 'Processing...',
        privacyTitle: 'Total Privacy Control',
        privacyText: 'Your data and photo are saved exclusively in your local cache.'
    },
    settings: {
      title: 'Settings',
      desc: 'Manage your system and account preferences.',
      appearance: 'System Appearance',
      appearanceDesc: 'Choose how Shivuk AI looks to you.',
      viewMode: 'Display Mode',
      light: 'Light',
      dark: 'Dark',
      language: 'Language & Region',
      notifications: 'Notifications',
      advanced: 'Advanced Mode',
      advancedDesc: 'Enable high-quality features (Veo/Pro Images)',
      danger: 'Danger Zone',
      deleteBtn: 'Delete my account',
      saved: 'Preference saved!'
    },
    preview: {
        square: 'Square',
        portrait: 'Portrait',
        landscape: 'Landscape',
        stories: 'Stories',
        download: 'Download Image',
        copy: 'Copy',
        copied: 'Copied!',
        caption: 'Post Caption',
        noImage: 'Image not generated',
        tryAgain: 'Try again or use camera button to upload.'
    }
  },
  'es': {
    sidebar: {
      chat: 'Chat / Crear',
      ideas: 'Menú de Ideas',
      brands: 'Mis Marcas',
      library: 'Biblioteca',
      analytics: 'Analítica',
      about: 'Acerca de',
      settings: 'Ajustes',
      profile: 'Perfil',
      logout: 'Cerrar Sesión',
      plan: 'Plan Profesional',
      status: 'Estado del Plan',
      manage: 'Gestionar Suscripción'
    },
    header: {
      studio: 'Estudio Creativo',
      ideas: 'Menú de Ideas',
      brands: 'Gestionar Marcas',
      library: 'Biblioteca de Activos',
      analytics: 'Datos e Insights',
      about: 'Info del Sistema',
      settings: 'Ajustes de Cuenta',
      profile: 'Mi Perfil',
      role: 'Director Creativo',
      account: 'Cuenta Pro'
    },
    mainChat: {
        subtitle: 'Motor de Generación Creativa 2.0',
        context: 'Contexto 2026 Activo',
        socialPost: 'Post Social',
        veoVideo: 'Video Veo',
        captionMode: 'Leyenda IA', 
        persona: 'Persona',
        platform: 'Plataforma',
        visualStyle: 'Estilo Visual',
        cineStyle: 'Estilo Cinematográfico',
        placeholderPost: '¿Qué creamos hoy en',
        placeholderVideo: 'Describe la escena del video...',
        placeholderCaption: 'Agrega detalles extra sobre la foto (opcional)...', 
        chars: 'CARACTERES',
        veoReady: 'MOTOR VEO LISTO',
        visionReady: 'VISIÓN POR COMPUTADORA ACTIVA', 
        generating: 'Renderizando...',
        enableVeo: 'Habilitar Veo (API Key)',
        generateVideo: 'Generar Video + Guión',
        generateContent: 'Generar Contenido',
        generateCaption: 'Analizar Imagen y Escribir', 
        uploadRequired: 'Subir Imagen Requerido', 
        pipeline: 'Motor Neuronal Activo',
        success: 'Activo Generado con Éxito',
        generateVariation: 'Generar Variación',
        videoRendered: 'Video Renderizado (Veo)',
        generateOther: 'Generar Otro'
    },
    personas: {
        joshua: 'Joshua — Analítico',
        joshuaDesc: 'Enfocado en datos, lógica, métricas y growth hacking.',
        gabriel: 'Gabriel — Estrategia de Embudo',
        gabrielDesc: 'Especialista en etapas de conciencia y conversión.',
        caelum: 'Caelum — Conexión Humana',
        caelumDesc: 'Empático, enfocado en storytelling, branding y comunidad.',
        nyx: 'Nyx — Ventas (Hard Sell)',
        nyxDesc: 'Persuasiva, agresiva, uso de gatillos mentales y cierre.',
        ziggy: 'Ziggy — Humor y Entretenimiento',
        ziggyDesc: 'Divertida, usa memes, sarcasmo ligero y situaciones cotidianas.',
        kai: 'Kai — Hype y Tendencias',
        kaiDesc: 'Conectado, lenguaje Gen-Z, enfocado en virales y tendencias actuales.',
        solara: 'Solara — Sofisticación y Lujo',
        solaraDesc: 'Elegante, minimalista, enfocada en exclusividad y altos estándares.'
    },
    brands: {
        title: 'Centro de Marca',
        subtitle: 'Gestiona tu identidad visual y activos de marca.',
        save: 'Guardar Cambios',
        saved: '¡Configuraciones aplicadas con éxito!',
        nameColors: 'Nombre y Colores',
        brandName: 'Nombre de la Marca',
        primary: 'Primario',
        secondary: 'Secundario',
        accent: 'Acento',
        gallery: 'Galería de Logos',
        add: 'Añadir',
        tip: 'Consejo de Diseño: Para mejor legibilidad, sube logos con fondo transparente (PNG) y resolución mínima de 500x500px.',
        noLogo: 'Ningún logo subido',
        useAsset: 'Usar Activo',
        remove: 'Eliminar',
        preview: 'Vista Previa en Vivo',
        draft: 'Aviso de Borrador',
        draftDesc: 'Los cambios arriba son borradores. Haz clic en Guardar Cambios para persistir.'
    },
    library: {
        title: 'Biblioteca de Activos',
        subtitle: 'Gestiona todos los posts generados y guardados automáticamente.',
        search: 'Buscar en archivos...',
        clear: 'Limpiar Biblioteca',
        emptyTitle: 'No se encontraron posts',
        emptyDesc: 'Comienza a crear en el chat para ver tus activos aparecer aquí automáticamente.',
        slides: 'Diapositivas',
        copy: 'Copiar',
        copied: '¡Copiado!'
    },
    templates: {
        title: 'Menú de Ideas',
        subtitle: 'Elige una plantilla estratégicamente diseñada para convertir y atraer.',
        use: 'Usar esta plantilla',
        promoTitle: 'Venta Flash',
        promoDesc: 'Genera urgencia y FOMO para una oferta que expira en pocas horas.',
        inspireTitle: 'Frase Inspiradora',
        inspireDesc: 'Conecta emocionalmente con tu audiencia a través de una visión fuerte.',
        expertTitle: 'Consejo de Experto',
        expertDesc: 'Muestra autoridad entregando valor real y práctico a tus seguidores.',
        behindTitle: 'Detrás de Escena',
        behindDesc: 'Humaniza tu empresa mostrando el proceso y las personas detrás.',
        launchTitle: 'Lanzamiento de Producto',
        launchDesc: 'Presenta una novedad destacando los beneficios clave.',
        faqTitle: 'FAQ Creativo',
        faqDesc: 'Responde las principales dudas de forma ligera y orientada a la venta.'
    },
    about: {
        badge: 'Nuestra Esencia',
        title1: 'Más que Código,',
        title2: 'Una Misión.',
        subtitle: 'Conoce la historia detrás de la inteligencia que impulsa tu marketing.',
        founderRole: 'CEO y Fundador • 19 Años',
        location: 'Maringá, PR',
        quote: '"Creo que la edad es solo un número cuando la voluntad de cambiar el mundo es gigante. Shivuk nació para ser la extensión de nuestra imaginación."',
        mission1Title: 'Acelerar Resultados',
        mission1Desc: 'El marketing no necesita ser lento. Automatizamos el proceso.',
        mission2Title: 'Desbloqueo Creativo',
        mission2Desc: 'El fin de la pantalla en blanco. Ideas en segundos.',
        mission3Title: 'Democratizar la IA',
        mission3Desc: 'Tecnología de punta accesible e intuitiva para todos.',
        philosophyTitle: 'Nuestra Filosofía Digital',
        philosophyDesc: 'Construimos puentes entre el genio humano y la eficiencia de la máquina.',
        madeWith: 'Hecho con 💜 en Maringá para el mundo.'
    },
    plans: {
        title: 'Elige tu Poder',
        subtitle: 'Desbloquea todo el potencial de Shivuk AI con planes diseñados para escalar tu creatividad.',
        starter: 'Starter',
        starterDesc: 'Para creadores principiantes explorando el poder de la IA.',
        pro: 'Profesional',
        proDesc: 'Potencia total para freelancers y growth hackers.',
        agency: 'Agencia',
        agencyDesc: 'Solución empresarial para agencias y grandes equipos.',
        currentPlan: 'Plan Actual',
        upgrade: 'Mejorar Ahora',
        contactSales: 'Contactar Ventas',
        month: '/mes',
        consult: 'A Consultar',
        recommended: 'Recomendado'
    },
    analytics: {
        title: 'Estudio de Rendimiento',
        subtitle: 'Visión general de tu producción de contenido creativo.',
        totalAssets: 'Total de Activos',
        totalSub: 'Posts generados en total',
        weekly: 'Producción Semanal',
        weeklySub: 'Últimos 7 días',
        topPlatform: 'Plataforma Top',
        topPlatformSub: 'Canal más utilizado',
        videosCreated: 'Videos Creados',
        videosSub: 'Contenido Veo/Motion',
        volumeTitle: 'Volumen por Canal',
        insightsTitle: 'Insights Rápidos',
        noData: 'Sin datos disponibles aún.'
    },
    profile: {
        title: 'Mi Perfil',
        subtitle: 'Gestiona tu identidad visual e información profesional.',
        personalData: 'Datos Personales',
        personalDataSub: 'Información visible en tu estudio',
        name: 'Nombre Completo',
        email: 'E-mail Profesional',
        role: 'Cargo o Título',
        bio: 'Sobre Mí (Bio)',
        upload: 'Subir Foto',
        save: 'Guardar Cambios',
        processing: 'Procesando...',
        privacyTitle: 'Control Total de Privacidad',
        privacyText: 'Tus datos y foto se guardan exclusivamente en tu caché local. Shivuk AI 2.0 no envía tu información personal a servidores externos, garantizando anonimato total.'
    },
    settings: {
      title: 'Ajustes',
      desc: 'Gestiona tus preferencias de sistema e cuenta.',
      appearance: 'Apariencia del Sistema',
      appearanceDesc: 'Elige tu entorno de trabajo',
      viewMode: 'Modo de Visualización',
      light: 'Claro',
      dark: 'Oscuro',
      language: 'Idioma y Región',
      notifications: 'Notificaciones',
      advanced: 'Modo Avanzado',
      advancedDesc: 'Habilita recursos de alta calidad (Veo/Pro Images)',
      danger: 'Zona de Peligro',
      deleteBtn: 'Eliminar mi cuenta',
      saved: '¡Preferencia guardada!'
    },
    preview: {
        square: 'Cuadrado',
        portrait: 'Retrato',
        landscape: 'Paisaje',
        stories: 'Stories',
        download: 'Descargar Imagen',
        copy: 'Copiar',
        copied: '¡Copiado!',
        caption: 'Leyenda del Post',
        noImage: 'Imagen no generada',
        tryAgain: 'Intenta de nuevo o usa el botón de cámara para subir.'
    }
  }
};

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: typeof translations['pt-br'];
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children?: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => 
    (localStorage.getItem('shivuk_lang') as Language) || 'pt-br'
  );
  
  const [theme, setThemeState] = useState<Theme>(() => 
    (localStorage.getItem('shivuk_theme') as Theme) || 'dark'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('shivuk_theme', theme);
  }, [theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('shivuk_lang', lang);
  };

  const setTheme = (thm: Theme) => {
    setThemeState(thm);
    localStorage.setItem('shivuk_theme', thm);
  };

  const value = {
    language,
    setLanguage,
    theme,
    setTheme,
    t: translations[language] || translations['pt-br']
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
}
