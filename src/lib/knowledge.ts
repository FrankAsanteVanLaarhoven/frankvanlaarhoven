export type SupportedLang = 'en' | 'de' | 'nl' | 'es' | 'pt' | 'zh' | 'ar';

export interface KnowledgeEntry {
  keywords: { [key in SupportedLang]?: string[] };
  responses: { [key in SupportedLang]?: string };
  action?: 'books' | 'services' | 'research' | 'terminal' | 'close' | null;
  category: 'portfolio' | 'personal' | 'technical' | 'internet_simulation';
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // Portfolio Context
  {
    keywords: {
      en: ['frank', 'who are you', 'creator', 'about'],
      de: ['frank', 'wer bist du', 'shopfer', 'uber'],
      nl: ['frank', 'wie ben jij', 'maker', 'over'],
      es: ['frank', 'quien eres', 'creador', 'sobre'],
      pt: ['frank', 'quem e voce', 'criador', 'sobre'],
      zh: ['frank', '你是谁', '创作者', '关于'],
      ar: ['فرانك', 'من انت', 'المبدع', 'حول']
    },
    responses: {
      en: "I am the digital assistant for Frank van Laarhoven, a Creative Technologist.",
      de: "Ich bin der digitale Assistent von Frank van Laarhoven, einem Creative Technologist.",
      nl: "Ik ben de digitale assistent van Frank van Laarhoven, een Creative Technologist.",
      es: "Soy el asistente digital de Frank van Laarhoven, un tecnólogo creativo.",
      pt: "Sou o assistente digital de Frank van Laarhoven, um tecnólogo criativo.",
      zh: "我是 Frank van Laarhoven 的数字助理，一位创意技术专家。",
      ar: "أنا المساعد الرقمي لفرانك فان لارهوفن، تقني مبدع."
    },
    category: 'personal',
    action: null
  },
  {
    keywords: {
      en: ['open books', 'nexus books'],
      de: ['öffne bücher', 'bucher öffnen'],
      nl: ['boeken openen', 'open boeken'],
      es: ['abrir libros', 'libros'],
      pt: ['abrir livros', 'livros'],
      zh: ['打开书', '书籍'],
      ar: ['افتح الكتب', 'كتب']
    },
    responses: {
      en: "Accessing Neural Archives.",
      de: "Zugriff auf neuronale Archive.",
      nl: "Toegang tot neurale archieven.",
      es: "Accediendo a archivos neuronales.",
      pt: "Acessando arquivos neurais.",
      zh: "访问神经档案。",
      ar: "الوصول إلى الأرشيف العصبي."
    },
    action: 'books',
    category: 'portfolio'
  },
  // Add more simplified entries for commands
  {
    keywords: {
      en: ['open services', 'vla services'],
      de: ['dienste öffnen', 'services'],
      nl: ['diensten openen', 'services'],
      es: ['abrir servicios', 'servicios'],
      pt: ['abrir servicos', 'servicos'],
      zh: ['打开服务', '服务'],
      ar: ['افتح الخدمات', 'خدمات']
    },
    responses: {
      en: "Connecting to VLA Robotics Services.",
      de: "Verbindung zu VLA Robotics Services.",
      nl: "Verbinding maken met VLA Robotics Services.",
      es: "Conectando con VLA Robotics Services.",
      pt: "Conectando aos Serviços de Robótica VLA.",
      zh: "连接到 VLA 机器人服务。",
      ar: "الاتصال بخدمات الروبوتات VLA."
    },
    action: 'services',
    category: 'portfolio'
  },
   {
    keywords: {
      en: ['open research', 'research lab'],
      de: ['forschung öffnen', 'labor'],
      nl: ['onderzoek openen', 'lab'],
      es: ['abrir investigación', 'laboratorio'],
      pt: ['abrir pesquisa', 'laboratorio'],
      zh: ['打开研究', '实验室'],
      ar: ['افتح البحث', 'مختبر']
    },
    responses: {
      en: "Decrypting Research Laboratory Data.",
      de: "Entschlüsselung der Forschungslabordaten.",
      nl: "Onderzoekslaboratoriumgegevens ontsleutelen.",
      es: "Descifrando datos del laboratorio de investigación.",
      pt: "Descriptografando dados do laboratório de pesquisa.",
      zh: "解密研究实验室数据。",
      ar: "فك تشفير بيانات مختبر البحث."
    },
    action: 'research',
    category: 'portfolio'
  },
  {
    keywords: {
      en: ['hello', 'hi'],
      de: ['hallo', 'guten tag'],
      nl: ['hallo', 'hoi'],
      es: ['hola'],
      pt: ['ola', 'oi'],
      zh: ['你好'],
      ar: ['مرحبا', 'اهلا']
    },
    responses: {
      en: "Systems online. Ready.",
      de: "Systeme online. Bereit.",
      nl: "Systemen online. Klaar.",
      es: "Sistemas en línea. Listo.",
      pt: "Sistemas online. Pronto.",
      zh: "系统在线。准备就绪。",
      ar: "الأنظمة متصلة. مستعد."
    },
    category: 'personal',
    action: null
  }
];

export function queryAgent(text: string, lang: SupportedLang = 'en'): { response: string; action?: string | null } | null {
  const normalized = text.toLowerCase();
  
  const match = KNOWLEDGE_BASE.find(entry => {
    const keywords = entry.keywords[lang];
    return keywords?.some(k => normalized.includes(k));
  });

  if (match) {
    return { 
      response: match.responses[lang] || match.responses['en'] || "Data corrupted.", 
      action: match.action || null 
    };
  }

  return null;
}
