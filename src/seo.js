import {videos} from './content.js';
import {dictionaries} from './i18n.js';
import {homeCopy} from './homeCopy.js';
import {faqCopy} from './faq.js';
const descriptions={
 en:{home:homeCopy.en.intro,explore:'Explore real ReelFarm video examples. Browse animated comedy, educational videos, promotions, 3D animation, and edited content. Save creative references for your quote.',packages:'Video production, lead generation websites, AI agents, and custom software for contractors. Compare video packages and request a custom quote.',quote:'Tell ReelFarm about your brand, select video styles, and prepare a project brief to request a personal quote. No account required.',contact:'Contact ReelFarm about video production, animated content, and creative campaigns. Send your brief to hikaristudioai@gmail.com.',privacy:'How ReelFarm handles your quote information, email handoff, language preference, and selected video references.'},
 es:{home:homeCopy.es.intro,explore:'Explorá ejemplos reales de ReelFarm. Comedia, videos educativos, promociones, animación 3D y edición. Guardá referencias para tu presupuesto.',packages:'Compará los planes Content, Growth y Creator de ReelFarm. Combiná estilos y pedí un presupuesto personalizado.',quote:'Contanos sobre tu marca, elegí estilos y prepará tu consulta para pedir un presupuesto. Sin crear una cuenta.',contact:'Contactá a ReelFarm por producción de video, animación y campañas creativas. Escribinos a hikaristudioai@gmail.com.',privacy:'Cómo ReelFarm trata tus datos, consultas por correo, idioma y referencias de video.'},
 pt:{home:homeCopy.pt.intro,explore:'Explore exemplos reais do ReelFarm. Comédia, vídeos educativos, promoções, animação 3D e edição. Salve referências para seu orçamento.',packages:'Compare os planos Content, Growth e Creator do ReelFarm. Misture estilos e peça um orçamento personalizado.',quote:'Conte sobre sua marca, escolha estilos e prepare seu pedido de orçamento. Sem precisar de conta.',contact:'Entre em contato com o ReelFarm sobre produção de vídeo, animação e campanhas criativas. Escreva para hikaristudioai@gmail.com.',privacy:'Como o ReelFarm trata seus dados, pedidos por e-mail, idioma e referências de vídeo.'}
};

export function getSEO(locale,route,origin='') {
 const t=dictionaries[locale];const video=videos.find(v=>route===`/explore/${v.slug}`);
 const name=video?video.title[locale]:route==='/'?homeCopy[locale].hero+' '+homeCopy[locale].accent.replace(/\.$/,''):({'/explore':t.explore,'/packages':t.packages,'/quote':t.quote,'/contact':t.contact,'/privacy':t.privacy})[route]||'ReelFarm';
 const title=`${name} | ReelFarm`;
 const description=video?video.description[locale]:descriptions[locale][route==='/'?'home':route.slice(1)]||descriptions[locale].home;
 const structured=[{'@context':'https://schema.org','@type':'Organization',name:'ReelFarm',description:descriptions[locale].home,email:'hikaristudioai@gmail.com',...(origin?{url:origin,logo:origin+'/brand/reelfarm-logo.webp'}:{}),knowsLanguage:['en','es','pt-BR']}];
 if(route==='/')structured.push({'@context':'https://schema.org','@type':'Service',name:'Contractor video ads and landing pages',serviceType:['Sponsored video ad production','Contractor landing pages'],description,provider:{'@type':'Organization',name:'ReelFarm'},availableChannel:{'@type':'ServiceChannel',availableLanguage:['English','Spanish','Portuguese']}});
 if(route==='/')structured.push({'@context':'https://schema.org','@type':'FAQPage',mainEntity:(route==='/'?homeCopy[locale].faq:faqCopy[locale].items).map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))});
 if(video&&origin)structured.push({'@context':'https://schema.org','@type':'VideoObject',name:video.title[locale],description,thumbnailUrl:origin+video.poster,contentUrl:origin+video.video,duration:`PT${video.duration.toFixed(3)}S`,inLanguage:video.language});
 return {title,description,structured,video};
}
