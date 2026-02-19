// app/utils/services-data.ts
// ─── Datos estáticos de servicios ───
// Luego vendrán de la base de datos. Por ahora los definimos aquí.
// Nuxt auto-importa todo lo de utils/, así que podrás usar
// getServices() y getServiceBySlug() directamente en cualquier componente.

export interface ServiceInfo {
  slug: string; // URL amigable: "cambio-aceite"
  name: string; // "Cambio de Aceite"
  shortDescription: string;
  fullDescription: string;
  icon: string; // Icono de Material Icons
  category: string;
  estimatedDuration: string;
  priceRange: string;
  features: string[]; // Lista de qué incluye
  faqs: { question: string; answer: string }[];
}

// Servicios reales de Mobauto en Humanes de Madrid
// Especialidad: Chapa y Pintura + Reparación general + Cristales
const services: ServiceInfo[] = [
  {
    slug: "chapa-pintura",
    name: "Chapa y Pintura",
    shortDescription:
      "Reparación de carrocería, abolladuras, arañazos y pintado profesional.",
    fullDescription:
      "Nuestro servicio estrella. En Mobauto somos especialistas en chapa y pintura con más de 10 años de experiencia. Reparamos desde pequeños arañazos hasta daños graves por colisión, con acabados de fábrica y materiales de primera calidad.",
    icon: "format_paint",
    category: "BODYWORK",
    estimatedDuration: "1-5 días",
    priceRange: "Presupuesto sin compromiso",
    features: [
      "Reparación de abolladuras y golpes",
      "Pintado parcial o completo del vehículo",
      "Igualación de color con tecnología computerizada",
      "Reparación de arañazos profundos y superficiales",
      "Tratamiento anticorrosión",
      "Coche de sustitución disponible",
      "Acabado de fábrica garantizado",
    ],
    faqs: [
      {
        question: "¿Ofrecen coche de sustitución?",
        answer:
          "Sí, disponemos de coches de sustitución gratuitos mientras tu vehículo está en el taller.",
      },
      {
        question: "¿Cuánto tarda una reparación de chapa?",
        answer:
          "Depende del daño. Un arañazo puede estar listo en 1 día, una reparación por colisión puede llevar 3-5 días. Te damos plazo exacto con el presupuesto.",
      },
      {
        question: "¿Trabajan con aseguradoras?",
        answer:
          "Sí, gestionamos el trámite completo con tu compañía de seguros para que no tengas que preocuparte de nada.",
      },
    ],
  },
  {
    slug: "cristales",
    name: "Cristales para Automóviles",
    shortDescription:
      "Reparación y sustitución de lunas, parabrisas y cristales laterales.",
    fullDescription:
      "Servicio integral de cristales para tu vehículo. Reparamos impactos en el parabrisas y sustituimos lunas rotas con cristales homologados. También trabajamos con lunas térmicas y laminadas.",
    icon: "window",
    category: "REPAIR",
    estimatedDuration: "1-3 horas",
    priceRange: "Presupuesto sin compromiso",
    features: [
      "Reparación de impactos en parabrisas",
      "Sustitución de lunas delanteras y traseras",
      "Cristales laterales y de techo",
      "Lunas térmicas y laminadas",
      "Cristales homologados",
      "Gestión con el seguro incluida",
    ],
    faqs: [
      {
        question: "¿Se puede reparar un impacto sin cambiar el parabrisas?",
        answer:
          "Sí, si el impacto es pequeño (menor que una moneda de 2€) y no está en la zona de visión del conductor, generalmente se puede reparar sin sustituir el parabrisas completo.",
      },
      {
        question: "¿Cubren las aseguradoras el cambio de lunas?",
        answer:
          "Sí, la mayoría de pólizas a todo riesgo y muchas a terceros ampliado cubren la rotura de lunas. Nosotros gestionamos el trámite.",
      },
    ],
  },
  {
    slug: "reparacion-general",
    name: "Reparación de Automóviles",
    shortDescription:
      "Mecánica general: motor, frenos, suspensión, embrague y más.",
    fullDescription:
      "Taller de reparación integral. Diagnosticamos y reparamos averías mecánicas de todo tipo: motor, sistema de frenado, suspensión, dirección, embrague, distribución y más. Diagnóstico preciso antes de cualquier intervención.",
    icon: "build",
    category: "REPAIR",
    estimatedDuration: "Según diagnóstico",
    priceRange: "Presupuesto sin compromiso",
    features: [
      "Diagnóstico electrónico avanzado",
      "Reparación de motor",
      "Cambio de embrague y distribución",
      "Sistemas de frenado",
      "Suspensión y amortiguadores",
      "Sistema de escape",
      "Presupuesto detallado sin compromiso",
    ],
    faqs: [
      {
        question: "¿Hacen diagnóstico antes de reparar?",
        answer:
          "Siempre. Antes de cualquier intervención, nuestros especialistas realizan un diagnóstico preciso y te proporcionan una explicación detallada del trabajo y un presupuesto ajustado.",
      },
      {
        question: "¿Reparan todas las marcas?",
        answer: "Sí, trabajamos con todas las marcas y modelos de vehículos.",
      },
    ],
  },
  {
    slug: "mantenimiento",
    name: "Mantenimiento Preventivo",
    shortDescription:
      "Cambio de aceite, filtros, revisiones y mantenimiento periódico.",
    fullDescription:
      "El mantenimiento preventivo es clave para alargar la vida de tu vehículo y evitar averías costosas. Realizamos todos los servicios de mantenimiento según las recomendaciones del fabricante.",
    icon: "oil_barrel",
    category: "MAINTENANCE",
    estimatedDuration: "30 min - 2 horas",
    priceRange: "Desde 49€",
    features: [
      "Cambio de aceite y filtros",
      "Revisión de niveles",
      "Cambio de líquido de frenos",
      "Cambio de correa de distribución",
      "Cambio de pastillas de freno",
      "Revisión pre-ITV",
    ],
    faqs: [
      {
        question: "¿Cada cuánto debo hacer el mantenimiento?",
        answer:
          "Generalmente cada 15.000-20.000 km o una vez al año. Consulta el manual de tu vehículo o pregúntanos y te asesoramos según tu modelo.",
      },
    ],
  },
  {
    slug: "pre-itv",
    name: "Pre-ITV",
    shortDescription:
      "Revisión completa previa a la ITV para asegurar que tu vehículo la pasa.",
    fullDescription:
      "Revisamos todos los puntos que se evalúan en la ITV: emisiones, frenos, luces, suspensión, dirección, etc. Si encontramos problemas, los solucionamos antes de tu cita en la ITV.",
    icon: "verified",
    category: "INSPECTION",
    estimatedDuration: "1-2 horas",
    priceRange: "Desde 39€",
    features: [
      "Revisión de emisiones",
      "Comprobación de luces y señalización",
      "Estado de frenos",
      "Suspensión y dirección",
      "Neumáticos y limpiaparabrisas",
      "Ajustes menores incluidos",
    ],
    faqs: [
      {
        question: "¿Garantizan que pase la ITV?",
        answer:
          "Si realizamos la pre-ITV y las reparaciones recomendadas, la probabilidad de pasar es superior al 95%.",
      },
    ],
  },
  {
    slug: "peritaje-siniestros",
    name: "Peritaje y Siniestros",
    shortDescription:
      "Gestión completa de siniestros con aseguradoras y peritaje.",
    fullDescription:
      "Nos encargamos de todo el proceso de gestión con tu aseguradora: peritaje, presupuesto, trámites y reparación. Tú solo tienes que traer el coche y nosotros nos ocupamos del resto.",
    icon: "description",
    category: "OTHER",
    estimatedDuration: "Según siniestro",
    priceRange: "Según peritaje",
    features: [
      "Gestión integral con aseguradoras",
      "Peritaje in situ",
      "Presupuesto detallado de daños",
      "Reparación según acuerdo con la compañía",
      "Coche de sustitución durante la reparación",
      "Seguimiento del estado de la reparación",
    ],
    faqs: [
      {
        question: "¿Puedo elegir taller para el siniestro?",
        answer:
          "Sí, por ley tienes derecho a elegir el taller donde reparar tu vehículo. No estás obligado a ir al taller que te sugiera la aseguradora.",
      },
    ],
  },
];

// ─── Funciones de acceso ───

export function getServices(): ServiceInfo[] {
  return services;
}

export function getServiceBySlug(slug: string): ServiceInfo | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServicesByCategory(category: string): ServiceInfo[] {
  return services.filter((s) => s.category === category);
}
