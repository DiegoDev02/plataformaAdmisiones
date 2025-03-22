import { Code2, ArrowRight, BookOpen, Users, Briefcase, ChevronDown, Sparkles, Rocket, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useState, useEffect, useRef } from 'react';

const bootcampTypes = [
  {
    id: '1',
    title: 'Frontend Developer',
    description: 'Aprende a crear interfaces web modernas y responsivas.',
    duration: '12 semanas',
    tag: 'POPULAR',
    color: 'bg-blue-500',
    icon: Code2
  },
  {
    id: '2',
    title: 'Full-Stack Jr.',
    description: 'Conviértete en un desarrollador capaz de trabajar en frontend y backend.',
    duration: '20 semanas',
    tag: 'MÁS COMPLETO',
    color: 'bg-purple-500',
    icon: BookOpen
  },
  {
    id: '3',
    title: 'Data Analyst',
    description: 'Domina las herramientas necesarias para analizar datos y extraer insights valiosos.',
    duration: '14 semanas',
    tag: 'ALTA DEMANDA',
    color: 'bg-green-500',
    icon: Users
  },
  {
    id: '4',
    title: 'Programming Fundamentals',
    description: 'Aprende los fundamentos de la programación aplicables a cualquier lenguaje.',
    duration: '8 semanas',
    tag: 'PRINCIPIANTES',
    color: 'bg-gray-700',
    icon: Code2
  },
  {
    id: '5',
    title: 'Data Fundamentals',
    description: 'Introduce los conceptos esenciales para trabajar con datos y análisis.',
    duration: '10 semanas',
    tag: 'INTRODUCTORIO',
    color: 'bg-yellow-500',
    icon: Briefcase
  }
];

interface Bootcamp {
  id: string;
  name: string;
  description: string;
  category: string;
  duration_weeks: number;
  price: number;
  topics: string[];
  skills: string[];
  image_url: string;
  is_featured: boolean;
}

export default function HomePage() {
  const { user } = useAuth();
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const textScale = useTransform(scrollY, [0, 300], [1, 0.7]);
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const arrowOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  const [sectionRef, sectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [bootcampsRef, bootcampsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    fetchBootcamps();
  }, []);

  const fetchBootcamps = async () => {
    try {
      const { data, error } = await supabase
        .from('bootcamps')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setBootcamps(data || []);
    } catch (error) {
      console.error('Error fetching bootcamps:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: 'Aprendizaje Práctico',
      description: 'Proyectos reales y casos de estudio de la industria'
    },
    {
      icon: Rocket,
      title: 'Mentoría Personalizada',
      description: 'Soporte individual para tu desarrollo profesional'
    },
    {
      icon: Brain,
      title: 'Tecnologías Actuales',
      description: 'Currículum actualizado con las últimas tendencias'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(-45deg, #581C87, #4338CA, #2563EB, #7C3AED)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite'
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.4)_100%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 mb-24">
          <motion.div 
            style={{ scale: textScale, opacity: textOpacity }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Bienvenido a tu<br />Futuro Digital
            </h1>
            <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Descubre nuestros bootcamps especializados y da el primer paso hacia tu
              carrera en tecnología. Cada programa está diseñado para transformar tu pasión
              por la tecnología en habilidades profesionales demandadas por la industria.
            </p>
          </motion.div>

        </div>
        
        {/* Scroll Indicator - Positioned independently */}
        <motion.div 
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20"
          style={{ opacity: arrowOpacity }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="cursor-pointer group"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <ChevronDown className="h-14 w-14 text-white/50 group-hover:text-white/90 transition-all duration-300 transform group-hover:scale-110" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="py-12 bg-[#1A0B2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={bootcampsInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={bootcampsInView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: index * 0.2 }}
                className="bg-[#2D1B69] rounded-xl p-8 text-center"
              >
                <div className="inline-flex p-4 bg-[#6B20FF]/20 rounded-xl mb-6">
                  <feature.icon className="h-8 w-8 text-[#6B20FF]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bootcamps Section */}
      <section className="py-12 bg-[#1A0B2E]" ref={bootcampsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={bootcampsInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Bootcamps Destacados
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Elige el programa que mejor se adapte a tus objetivos profesionales y comienza tu
              camino hacia una carrera exitosa en tecnología.
            </p>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            initial="hidden"
            animate={bootcampsInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {bootcamps.map((bootcamp, index) => (
              <motion.div 
                key={bootcamp.id} 
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 100
                    }
                  }
                }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-[#2D1B69] rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={bootcamp.image_url}
                    alt={bootcamp.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B69] to-transparent" />
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {bootcamp.name}
                      </h3>
                      <span className="inline-block px-3 py-1 bg-[#6B20FF]/20 text-[#6B20FF] rounded-full text-sm">
                        {bootcamp.category}
                      </span>
                    </div>
                    <div className="p-3 bg-[#1A0B2E] rounded-lg">
                      <Code2 className="h-6 w-6 text-[#6B20FF]" />
                    </div>
                  </div>

                  <p className="text-gray-400 mb-6 line-clamp-2">
                    {bootcamp.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                    <span>{bootcamp.duration_weeks} semanas</span>
                    <span>${bootcamp.price} USD</span>
                  </div>

                  <Link
                    to={`/bootcamp/${bootcamp.id}`}
                    className="flex items-center justify-center w-full py-3 bg-[#6B20FF] text-white rounded-lg hover:bg-[#5910FF] transition-colors group"
                  >
                    Ver detalles
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B20FF]" />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}