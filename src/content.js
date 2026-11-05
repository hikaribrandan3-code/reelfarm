const video = (id, category, title, description, duration, language, tags, order, industry = 'Restaurant / Food') => ({
  id, slug: id, category, title, description, duration, language, tags,
  industry, video: `/media/${id}.mp4`, poster: `/media/${id}.webp`,
  aspectRatio: '9:16', featured: order < 7, published: true, order,
});

// Portfolio pieces supplied by the studio. No engagement or client claims.
export const videos = [
  video('bellevue-irrigation', 'educational',
    {en:'Bellevue irrigation, explained',es:'Riego en Bellevue, explicado',pt:'Irrigação em Bellevue, explicada'},
    {en:'An educational construction and home-services video about irrigation, made for short-form feeds.',es:'Un video educativo de construcción y servicios para el hogar sobre riego, en formato vertical.',pt:'Um vídeo educativo de construção e serviços residenciais sobre irrigação, em formato vertical.'},61.5,'English',['Construction','Irrigation','Home services','Educational'], -3, 'Home Services'),
  video('driveway-commercial', 'educational',
    {en:'Driveways, built to last',es:'Entradas de vehículos hechas para durar',pt:'Entradas de garagem feitas para durar'},
    {en:'A construction-focused commercial that turns driveway services into a clear visual story.',es:'Un comercial de construcción que presenta servicios de entradas de vehículos con una historia visual clara.',pt:'Um comercial de construção que apresenta serviços de entradas de garagem com uma narrativa visual clara.'},60.2,'English',['Construction','Driveway','Building','Promotion','Educational'], -2, 'Home Services'),
  video('how-lego-bricks-are-made', 'educational',
    {en:'How LEGO bricks are made',es:'Cómo se fabrican los bloques LEGO',pt:'Como os blocos LEGO são feitos'},
    {en:'A building-style explainer exploring how LEGO bricks are made. Episode 01.',es:'Un explicativo de estilo construcción sobre cómo se fabrican los bloques LEGO. Episodio 01.',pt:'Um vídeo explicativo em estilo de construção sobre como os blocos LEGO são feitos. Episódio 01.'},71.567,'English',['Explainer','Building blocks','Manufacturing','Educational'], -1, 'Coaching / Education'),
  video('acai-brasil', 'visuals',
    { en: 'A little taste of Brasil', es: 'Un poquito de Brasil', pt: 'Um gostinho do Brasil' },
    { en: 'A sun-soaked clay-style world, built around food, discovery, and a little Brazilian energy. A MenuTree promotional concept.', es: 'Un mundo de estilo plastilina lleno de sol, comida y energía brasileña. Concepto promocional para MenuTree.', pt: 'Um universo com estilo de massinha, sol, comida e muita energia brasileira. Conceito promocional para MenuTree.' }, 70.9, 'Português', ['3D', 'Clay animation', 'Promotion', 'MenuTree', 'Brasil'], 0),
  video('influencer-from-hell', 'comedy',
    { en: 'The influencer from hell', es: 'La influencer del infierno', pt: 'A influencer do inferno' },
    { en: 'A burger, an influencer, and a very unreasonable request. Character-led restaurant comedy.', es: 'Una hamburguesa, una influencer y un pedido imposible. Comedia animada de restaurante.', pt: 'Um hambúrguer, uma influencer e um pedido absurdo. Comédia animada de restaurante.' }, 40.939, 'English', ['Cartoon', 'Restaurant', 'Comedy', 'MenuTree'], 1),
  video('gringo-in-cordoba', 'comedy',
    { en: 'The gringo in Córdoba', es: 'El gringo en Córdoba', pt: 'O gringo em Córdoba' },
    { en: 'Local flavor meets a visitor with a lot to learn. An animated short with a distinctly Córdoba personality.', es: 'El sabor local se cruza con un visitante que tiene mucho por aprender. Un corto con personalidad cordobesa.', pt: 'O sabor local encontra um visitante que tem muito a aprender. Um curta com a personalidade de Córdoba.' }, 60.352, 'English / Español', ['Cartoon', 'Local business', 'Córdoba', 'MenuTree'], 2),
  video('kung-pao-call', 'comedy',
    { en: 'The Kung Pao call', es: 'La llamada Kung Pao', pt: 'A ligação Kung Pao' },
    { en: 'One phone call. A lot of restaurant chaos. A hand-drawn comedy short made for vertical feeds.', es: 'Una llamada. Mucho caos de restaurante. Comedia dibujada para formato vertical.', pt: 'Uma ligação. Muita confusão no restaurante. Comédia desenhada para o formato vertical.' }, 45.013, 'English', ['Cartoon', 'Food', 'Comedy', 'MenuTree'], 3),
  video('exact-change', 'comedy',
    { en: 'Exact change, please', es: 'El cambio justo', pt: 'O troco exato' },
    { en: 'A familiar hospitality moment becomes a memorable animated story. Restaurant humor with a human touch.', es: 'Una situación cotidiana se convierte en una historia animada memorable. Humor de restaurante.', pt: 'Uma situação cotidiana vira uma história animada memorável. Humor de restaurante com um toque humano.' }, 38.933, 'English', ['Cartoon', 'Restaurant', 'Comedy', 'MenuTree'], 4),
  video('google-ranking', 'educational',
    { en: 'Get found. Get chosen.', es: 'Que te encuentren. Que te elijan.', pt: 'Seja encontrado. Seja escolhido.' },
    { en: 'Google discovery explained with simple characters and clear visual storytelling. An educational MenuTree example.', es: 'Cómo aparecer en Google, explicado con personajes sencillos y una historia visual clara. Ejemplo educativo de MenuTree.', pt: 'Descoberta no Google explicada com personagens simples e uma narrativa visual clara. Exemplo educativo do MenuTree.' }, 64, 'Español', ['Stickman', 'Google', 'Explainer', 'MenuTree'], 5),
  video('vendehumo', 'comedy',
    { en: 'The big promise', es: 'Cómo desarmar a un vendehumo', pt: 'A grande promessa' },
    { en: 'An exaggerated sales pitch gets the cartoon treatment. A Spanish-language short about influencer promises.', es: 'Una promesa exagerada merece su propia caricatura. Un corto sobre las promesas de los influencers.', pt: 'Uma promessa exagerada merece sua própria caricatura. Um curta em espanhol sobre promessas de influencers.' }, 59.904, 'Español', ['Cartoon', 'Influencer', 'Comedy', 'MenuTree'], 6),
  video('ai-for-business', 'educational',
    { en: 'Why business owners need AI', es: 'Por qué tu negocio necesita IA', pt: 'Por que seu negócio precisa de IA' },
    { en: 'A motion-led explainer on using AI as a thinking partner in a busy business. Bold type, clear ideas.', es: 'Un explicativo sobre la IA como aliada para pensar tu negocio. Tipografía potente e ideas claras.', pt: 'Um vídeo explicativo sobre usar a IA como parceira para pensar o seu negócio. Tipografia forte e ideias claras.' }, 62.1, 'English', ['Motion graphics', 'AI', 'Business', 'Explainer'], 7),
  video('studio-edit', 'editing',
    { en: 'Ideas in motion', es: 'Ideas en movimiento', pt: 'Ideias em movimento' },
    { en: 'A studio-supplied vertical motion edit with typography and visual storytelling. Any dashboard figures inside the video are illustrative.', es: 'Una edición vertical del estudio con tipografía y narrativa visual. Las cifras del panel dentro del video son ilustrativas.', pt: 'Uma edição vertical do estúdio com tipografia e narrativa visual. Os números do painel dentro do vídeo são ilustrativos.' }, 60.024, 'English', ['Editing', 'Motion graphics', 'Short-form'], 8),
  video('views-to-visits', 'educational',
    { en: 'Views to visits', es: 'De vistas a visitas', pt: 'De visualizações a visitas' },
    { en: 'A motion explainer on turning local attention into a clear reason to visit and an easy next step.', es: 'Un video animado sobre cómo dar al público local un motivo para visitar y facilitar el siguiente paso.', pt: 'Um vídeo animado sobre como dar ao público local um motivo para visitar e facilitar o próximo passo.' },
    32.7, 'English', ['Motion graphics', 'Local marketing', 'Explainer'], 9),
  video('content-treadmill', 'educational',
    { en: 'The content treadmill', es: 'La rueda del contenido', pt: 'A esteira de conteúdo' },
    { en: 'A paper collage explainer that turns one real customer question into three useful posts.', es: 'Un video animado con collage de papel que convierte una pregunta real de un cliente en tres publicaciones útiles.', pt: 'Um vídeo animado com colagem de papel que transforma uma pergunta real de cliente em três publicações úteis.' },
    35.9, 'English', ['Motion graphics', 'Paper collage', 'Local marketing', 'Explainer'], 10),
].filter(v => v.published).sort((a, b) => a.order - b.order);

export const categories = ['all', 'comedy', 'educational', 'editing', 'visuals', 'promotions', 'explainers'];
export const categoryMatches = (v, category) => category === 'all' || v.category === category || (category === 'promotions' && v.tags.includes('Promotion')) || (category === 'explainers' && v.tags.includes('Explainer'));
export const durationLabel = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
export const industries = ['Restaurant / Food', 'Home Services', 'Real Estate', 'Coaching / Education', 'Fitness / Wellness', 'Automotive', 'Beauty / Personal Care', 'E-commerce', 'Other'];
