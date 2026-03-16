export const siteConfig = {
    url: "https://miquinho-distribuidora.vercel.app",
    company: {
        name: "Miquinho Distribuidora",
        tagline: "Do Coração da Amazônia Para Sua Açaiteria",
        description: "Distribuidora de açaí direto do produtor para açaiterias em Porto Alegre. Açaí cremoso premium, embalagens descartáveis e entrega garantida em 24h.",
        shortDescription: "Açaí direto do produtor para sua açaiteria. Qualidade premium, preços competitivos e entrega em 24h em Porto Alegre.",
        whatsapp: "+55 (51) 99493-0575",
        whatsappE164: "+55-51-99493-0575",
        email: "contato@miquinho.com.br",
        instagram: "@miquinhodistribuidora",
        instagramUrl: "https://www.instagram.com/miquinhodistribuidora",
        operatingHours: "Seg - Sex: 08:00 - 18:00\nSáb: 08:00 - 12:00",
        keywords: ["distribuidora de açaí", "açaí porto alegre", "açaí para açaiteria", "açaí atacado", "fornecedor açaí RS"],
    },
    logo: {
        url: "/logo-com-espaço.png",
        alt: "Miquinho Distribuidora Logo",
        width: 120,
        height: 120,
    },
    colors: {
        primary: "#4A0080",
        secondary: "#2E7D32",
        accent: "#F9C715",
        background: "#FFFFFF",
        surface: "#F8F4FF",
        text: "#1A0030",
        textLight: "#FFFFFF",
    },
    nav: {
        links: [
            { label: "Início", href: "#hero" },
            { label: "Sobre", href: "#about" },
            { label: "Produtos", href: "#products" },
            { label: "Benefícios", href: "#benefits" },
            { label: "Localização", href: "#address" },
            { label: "Contato", href: "#contact" },
        ],
        catalogoHref: "/catalogo",
    },
    hero: {
        title: "Do Coração da Amazônia",
        titleHighlight: "Para Sua Açaiteria",
        subtitle: "Açaí produzido com paixão e tradição. Qualidade premium direto do produtor para o seu negócio crescer.",
        ctaText: "Fazer Pedido",
        ctaSecondaryText: "Conheça Nossos Produtos",
    },
    about: {
        overline: "Quem Somos",
        title: "Nossa História",
        description:
            "A Miquinho Distribuidora nasceu do amor pelo açaí genuíno. Somos produtores diretos, cultivando e processando nosso próprio açaí com rigorosos controles de qualidade. Nossa missão é levar o sabor autêntico da Amazônia para cada açaiteria parceira, garantindo frescor, consistência e o melhor preço do mercado.",
        stats: [
            { value: "5+", label: "Anos de Experiência" },
            { value: "40+", label: "Açaiterias Atendidas" },
            { value: "100%", label: "Produção Própria" },
            { value: "24h", label: "Entrega Garantida" },
        ],
    },
    products: {
        overline: "Catálogo",
        title: "Nossos Produtos",
        subtitle: "Linha completa para sua açaiteria",
        items: [            
            {
                name: "Açaí Cremoso",
                description:
                    "Açaí já preparado com a cremosidade ideal, pronto para servir. A escolha certa para quem busca praticidade sem abrir mão da qualidade.",
                emoji: "🫐",
            },
            {
                name: "Leite Condensado",
                description: "Leite condensado de alta qualidade para adoçar e enriquecer seus açaís. Embalagem prática para uso profissional.",
                emoji: "🥛",
            },
            {
                name: "Embalagens e Utensílios",
                description:
                    "Linha completa de potes, copos, tampas e colheres descartáveis, ideais para servir açaí e acompanhamentos. Produtos resistentes, padronizados e prontos para o uso profissional no dia a dia da sua açaiteria.",
                emoji: "🥄",
            },
            //{ name: 'Açaí Polpa Premium', description: 'Polpa pura e cremosa, ideal para servir com frutas e complementos. Textura perfeita e sabor intenso da Amazônia.', emoji: '🫐' },
            //{ name: 'Açaí com Frutas', description: 'Blend especial com frutas selecionadas. Morango, banana e outras frutas tropicais que complementam o sabor único do açaí.', emoji: '🍓' },
            //{ name: 'Granola Premium', description: 'Granola crocante e saborosa, produzida especialmente para complementar seu açaí. Mix com castanhas, aveia e mel.', emoji: '🥣' },
            //{ name: 'Complementos Variados', description: 'Kit completo com complementos selecionados: paçoca, Nutella, mel, coco ralado e muito mais para diversificar seu cardápio.', emoji: '🍯' },  
        ],
    },
    benefits: {
        overline: "Diferenciais",
        title: "Por Que Escolher a Miquinho?",
        subtitle: "Somos mais que um fornecedor — somos seu parceiro de negócios",
        items: [
            {
                icon: "Agriculture",
                title: "Produção Própria",
                description: "Do campo à sua açaiteria. Controlamos toda a cadeia produtiva, garantindo qualidade inigualável.",
            },
            {
                icon: "Verified",
                title: "Qualidade Garantida",
                description: "Rigoroso controle de qualidade em cada lote. Certificações e padrões que garantem o melhor produto.",
            },
            {
                icon: "AttachMoney",
                title: "Preços Competitivos",
                description: "Produtor direto = menor preço. Economize e aumente sua margem de lucro sem sacrificar a qualidade.",
            },
            /*{
                icon: "LocalShipping",
                title: "Entrega Pontual",
                description: "Logística eficiente com entrega em até 24 horas. Sua açaiteria nunca ficará sem produto.",
            },
            {
                icon: "Inventory",
                title: "Variedade Completa",
                description: "Linha completa de produtos para sua açaiteria. Tudo que você precisa em um único fornecedor.",
            },
            {
                icon: "Support",
                title: "Suporte Dedicado",
                description: "Equipe de atendimento especializada, sempre pronta para ajudar seu negócio a crescer.",
            },*/
        ],
    },
    contact: {
        title: "Vamos Crescer Juntos?",
        subtitle: "Entre em contato e descubra como a Miquinho Distribuidora pode transformar sua açaiteria",
        whatsappText: "Falar no WhatsApp",
        emailText: "Enviar E-mail",
    },
    address: {
        overline: "Onde Estamos",
        title: "Nossa Localização",
        street: "Av. Baltazar de Oliveira Garcia, 4987",
        neighborhood: "Rubem Berta",
        city: "Porto Alegre",
        state: "RS",
        cep: "91180-001",
        geoLatitude: -30.0121,
        geoLongitude: -51.0967,
        googleMapsEmbedUrl: "https://www.google.com/maps?q=-30.0122,-51.0966&z=17&output=embed&z=17",
    },
    footer: {
        copyright: "© 2024 Miquinho Distribuidora. Todos os direitos reservados.",
        links: [
            { label: "Política de Privacidade", href: "#" },
            { label: "Termos de Uso", href: "#" },
        ],
    },
};
