import {roofing} from './demo/roofing.js';
// Campaign registry. To add a funnel (solar, HVAC, remodeling): create src/demo/<name>.js, register it here, set
// `landingPage` for the video in library/sources.json, and add its path to `routes` in the build.
export const campaigns = {[roofing.path]: {config: roofing, showcase: true, preview: '/demo/roofing-preview.webp', previewAlt: 'Roofing landing page preview'}};
export const demoPaths = Object.keys(campaigns);
export const demoCopy = {
  en:{cta:'View Live Roofing Demo',detailTitle:'See This Video in a Real Landing Page',detailText:'See how educational content can connect to a customer estimate funnel.',
    eyebrow:'FROM VIDEO TO INQUIRY',title:'See How Your Content Turns Into Customer Inquiries',text:'From educational videos to dedicated landing pages, see how we help contractors turn attention into opportunities.',
    video:'Roofing explainer',page:'Roofing landing page',watch:'Watch the film',open:'Open live demo',journey:['Watch','Learn','Click','Request Estimate','Contractor Follow-Up'],journeyLabel:'Customer journey',note:'Demo brand and content for illustration.'},
  es:{cta:'Ver demo en vivo de techos',detailTitle:'Mirá este video en una landing real',detailText:'Mirá cómo el contenido educativo se conecta con un embudo de presupuestos para clientes.',
    eyebrow:'DEL VIDEO A LA CONSULTA',title:'Mirá cómo tu contenido se convierte en consultas de clientes',text:'De videos educativos a landing pages dedicadas: así ayudamos a los contratistas a convertir atención en oportunidades.',
    video:'Explicativo de techos',page:'Landing page de techos',watch:'Ver el video',open:'Abrir demo en vivo',journey:['Mira','Aprende','Clic','Pide presupuesto','Seguimiento del contratista'],journeyLabel:'Recorrido del cliente',note:'Marca y contenido de demostración.'},
  pt:{cta:'Ver demo ao vivo de telhados',detailTitle:'Veja este vídeo em uma landing page real',detailText:'Veja como o conteúdo educativo se conecta a um funil de orçamentos para clientes.',
    eyebrow:'DO VÍDEO À SOLICITAÇÃO',title:'Veja como seu conteúdo vira solicitações de clientes',text:'De vídeos educativos a landing pages dedicadas: veja como ajudamos empreiteiros a transformar atenção em oportunidades.',
    video:'Explicativo de telhados',page:'Landing page de telhados',watch:'Assistir ao vídeo',open:'Abrir demo ao vivo',journey:['Assista','Aprenda','Clique','Peça orçamento','Retorno do empreiteiro'],journeyLabel:'Jornada do cliente',note:'Marca e conteúdo de demonstração.'},
};
