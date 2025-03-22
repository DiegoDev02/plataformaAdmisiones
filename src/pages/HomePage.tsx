import { Code2, ArrowRight, ChevronDown, Sparkles, Rocket, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { supabase } from '../lib/supabase';
import { useState, useEffect, useRef } from 'react';

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
  const { scrollY } = useScroll();
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const textScale = useTransform(scrollY, [0, 300], [1, 0.7]);
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const arrowOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  // Referencias para la animación de secciones
  const [bootcampsRef, bootcampsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    async function fetchBootcamps() {
      try {
        setLoading(true);
        
        // Consulta a Supabase para obtener bootcamps destacados
        const { data, error } = await supabase
          .from('bootcamps')
          .select('*')
          // Usamos una cadena para el filtro en lugar de un booleano directo
          .filter('is_featured', 'eq', 'true')
          .limit(6);
          
        if (error) {
          console.error('Error fetching bootcamps:', error);
          return;
        }
        
        // Asegurarse de que los datos se ajusten al tipo Bootcamp
        const typedData = data as unknown as Bootcamp[];
        setBootcamps(typedData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBootcamps();
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: "Currículo actualizado",
      description: "Nuestros programas están diseñados con las tecnologías más demandadas del mercado."
    },
    {
      icon: Rocket,
      title: "Aprendizaje acelerado",
      description: "Metodología intensiva para maximizar tu tiempo y acelerar tu inserción laboral."
    },
    {
      icon: Brain,
      title: "Enfoque práctico",
      description: "Aprende construyendo proyectos reales que fortalecerán tu portafolio profesional."
    },
    {
      icon: Code2,
      title: "Mentores expertos",
      description: "Instructores con experiencia real en la industria tecnológica."
    }
  ];

  return (
    <div className="min-h-screen">
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Fondo base */}
        <div className="absolute inset-0" style={{ backgroundColor: '#1A0B2E' }} />
        
        {/* Gradiente animado */}
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'linear-gradient(135deg, rgba(45,27,105,0.3) 0%, rgba(76,34,179,0.3) 25%, rgba(107,32,255,0.3) 50%, rgba(138,67,255,0.3) 75%, rgba(45,27,105,0.3) 100%)',
            backgroundSize: '200% 200%',
            animation: 'flowGradient 15s ease-in-out infinite'
          }} 
        />
        
        {/* Efectos de destellos */}
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(107, 32, 255, 0.3) 0%, transparent 8%), 
              radial-gradient(circle at 80% 20%, rgba(138, 67, 255, 0.3) 0%, transparent 10%),
              radial-gradient(circle at 40% 70%, rgba(76, 34, 179, 0.3) 0%, transparent 12%),
              radial-gradient(circle at 70% 60%, rgba(107, 32, 255, 0.2) 0%, transparent 15%),
              radial-gradient(circle at 10% 10%, rgba(138, 67, 255, 0.2) 0%, transparent 7%),
              radial-gradient(circle at 90% 90%, rgba(76, 34, 179, 0.2) 0%, transparent 9%)
            `,
            opacity: 0.8
          }} 
        />
        
        {/* Partículas flotantes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full"
              style={{
                backgroundColor: '#6B20FF',
                width: `${2 + (i % 5)}px`,
                height: `${2 + (i % 5)}px`,
                top: `${10 + (i * 6) % 90}%`,
                left: `${5 + (i * 7) % 90}%`,
                opacity: 0.1 + (i % 5) * 0.05,
                animation: `floatParticle ${15 + i % 10}s linear infinite`,
                animationDelay: `${i * 0.7}s`
              }}
            />
          ))}
        </div>
        
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

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flowGradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }
      `}} />

      <section className="py-12" style={{ backgroundColor: '#1A0B2E' }} ref={bootcampsRef}>
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
            {bootcamps.map((bootcamp) => (
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
                className="overflow-hidden hover:shadow-xl transition-shadow rounded-xl"
                style={{ backgroundColor: '#2D1B69' }}
              >
                <div className="relative h-48">
                  <img
                    src={bootcamp.image_url}
                    alt={bootcamp.name}
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className="absolute inset-0" 
                    style={{ 
                      backgroundImage: 'linear-gradient(to top, rgba(45, 27, 105, 1), transparent)'
                    }} 
                  />
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

      <section className="py-12" style={{ backgroundColor: '#1A0B2E' }} ref={featuresRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={featuresInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={featuresInView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: index * 0.2 }}
                className="bg-[#2D1B69] rounded-xl p-8 text-center w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
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
    </div>
  );
}