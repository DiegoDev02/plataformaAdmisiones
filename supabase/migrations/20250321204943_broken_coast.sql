/*
  # Insert bootcamp data
  
  1. Changes
    - Insert initial bootcamp records with complete information
    - Include both fundamentals and full bootcamps
    - Add realistic pricing and durations
    - Include detailed topics and skills arrays
*/

-- Insert bootcamp data
INSERT INTO bootcamps (
  name,
  description,
  category,
  duration_weeks,
  price,
  requires_test,
  is_active,
  is_featured,
  topics,
  skills,
  image_url
) VALUES
-- Full Bootcamps
(
  'Full Stack Developer',
  'Conviértete en un desarrollador web completo dominando las tecnologías más demandadas del mercado. Aprenderás desde los fundamentos hasta técnicas avanzadas de desarrollo.',
  'web',
  16,
  1299.99,
  true,
  true,
  true,
  ARRAY[
    'HTML5, CSS3 y JavaScript moderno',
    'React y desarrollo frontend',
    'Node.js y Express',
    'Bases de datos SQL y NoSQL',
    'APIs RESTful y GraphQL',
    'DevOps y despliegue',
    'Testing y debugging',
    'Seguridad web'
  ],
  ARRAY[
    'Desarrollo frontend profesional',
    'Arquitectura backend robusta',
    'Gestión de bases de datos',
    'Control de versiones con Git',
    'Testing y debugging',
    'Metodologías ágiles'
  ],
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200'
),
(
  'Data Science & AI',
  'Domina el análisis de datos y la inteligencia artificial. Aprende a extraer insights valiosos y construir modelos predictivos con las últimas tecnologías.',
  'data',
  20,
  1499.99,
  true,
  true,
  true,
  ARRAY[
    'Python para Data Science',
    'Estadística y probabilidad',
    'Machine Learning',
    'Deep Learning',
    'Procesamiento de datos',
    'Visualización de datos',
    'Big Data',
    'MLOps'
  ],
  ARRAY[
    'Análisis de datos avanzado',
    'Construcción de modelos ML',
    'Visualización de datos',
    'Programación en Python',
    'Gestión de proyectos de datos',
    'Deployment de modelos'
  ],
  'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=1200'
),
(
  'Mobile Developer',
  'Especialízate en el desarrollo de aplicaciones móviles nativas y multiplataforma. Aprende las mejores prácticas y frameworks más utilizados.',
  'mobile',
  14,
  1199.99,
  true,
  true,
  false,
  ARRAY[
    'React Native',
    'Flutter',
    'Diseño de UI/UX móvil',
    'APIs y backend para móviles',
    'Testing en dispositivos',
    'Publicación en stores',
    'Push notifications',
    'Offline-first'
  ],
  ARRAY[
    'Desarrollo multiplataforma',
    'Diseño de interfaces móviles',
    'Integración con APIs',
    'Testing en dispositivos',
    'Optimización de rendimiento',
    'Publicación en stores'
  ],
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200'
),

-- Fundamentals
(
  'Programming Fundamentals',
  'Inicia tu carrera en programación con una base sólida. Aprende los conceptos fundamentales aplicables a cualquier lenguaje de programación.',
  'fundamentals',
  8,
  499.99,
  false,
  true,
  false,
  ARRAY[
    'Lógica de programación',
    'Estructuras de datos',
    'Algoritmos básicos',
    'Control de versiones',
    'Metodologías de desarrollo',
    'Buenas prácticas'
  ],
  ARRAY[
    'Pensamiento lógico',
    'Resolución de problemas',
    'Fundamentos de programación',
    'Trabajo en equipo',
    'Control de versiones',
    'Metodologías ágiles'
  ],
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1200'
),
(
  'Data Analytics Fundamentals',
  'Introduce los conceptos esenciales del análisis de datos y la ciencia de datos. Aprende las herramientas básicas y metodologías.',
  'fundamentals',
  10,
  599.99,
  false,
  true,
  false,
  ARRAY[
    'Introducción a Python',
    'Estadística básica',
    'Análisis exploratorio',
    'Visualización de datos',
    'SQL básico',
    'Reportes y dashboards'
  ],
  ARRAY[
    'Análisis de datos básico',
    'Visualización de datos',
    'Programación básica',
    'Pensamiento analítico',
    'Manejo de bases de datos',
    'Presentación de resultados'
  ],
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200'
),
(
  'UX/UI Design Fundamentals',
  'Aprende los fundamentos del diseño de experiencias e interfaces de usuario. Domina las herramientas básicas y principios de diseño.',
  'fundamentals',
  8,
  499.99,
  false,
  true,
  false,
  ARRAY[
    'Principios de diseño',
    'Diseño centrado en usuario',
    'Prototipado',
    'Herramientas de diseño',
    'Design systems',
    'Evaluación de usabilidad'
  ],
  ARRAY[
    'Diseño de interfaces',
    'Prototipado',
    'Investigación de usuarios',
    'Evaluación de usabilidad',
    'Trabajo con stakeholders',
    'Presentación de diseños'
  ],
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200'
);