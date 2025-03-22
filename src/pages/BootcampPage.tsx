import { CheckCircle2, Clock, DollarSign, ArrowRight, Lock, Sparkles, Users, Trophy } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function BootcampPage() {
  const { id } = useParams();
  const { user } = useAuth();

  // This would normally fetch from your API
  const bootcamp = {
    id,
    title: 'Desarrollo Web Full Stack',
    tag: 'MÁS POPULAR',
    description: 'Conviértete en un desarrollador web full stack dominando las tecnologías más demandadas del mercado. Aprende a crear aplicaciones web completas desde cero.',
    duration: '12 semanas',
    price: 39.99,
    topics: [
      'HTML5, CSS3 y JavaScript moderno',
      'React y desarrollo frontend',
      'Node.js y Express',
      'Bases de datos SQL y NoSQL',
      'APIs RESTful y GraphQL',
      'DevOps y despliegue'
    ],
    skills: [
      'Desarrollo frontend profesional',
      'Arquitectura backend robusta',
      'Gestión de bases de datos',
      'Control de versiones con Git',
      'Testing y debugging',
      'Metodologías ágiles'
    ],
    benefits: [
      {
        icon: Sparkles,
        title: 'Proyectos Reales',
        description: 'Trabaja en proyectos basados en casos reales de la industria'
      },
      {
        icon: Users,
        title: 'Mentoría Personalizada',
        description: 'Acceso a mentores expertos durante todo el programa'
      },
      {
        icon: Trophy,
        title: 'Certificación',
        description: 'Obtén un certificado avalado por la industria'
      }
    ],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src={bootcamp.image}
          alt={bootcamp.title}
          className="w-full h-[300px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block bg-accent text-white px-3 py-1 rounded-full text-sm font-medium mb-4"
              >
                {bootcamp.tag}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-white mb-4"
              >
                {bootcamp.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-100"
              >
                {bootcamp.description}
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Benefits */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-sm p-6 mb-8"
            >
              <h2 className="text-2xl font-semibold mb-6">¿Por qué elegir este bootcamp?</h2>
              <div className="grid gap-6">
                {bootcamp.benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Topics */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-lg shadow-sm p-6 mb-8"
            >
              <h2 className="text-2xl font-semibold mb-6">Contenido del Bootcamp</h2>
              <div className="grid gap-4">
                {bootcamp.topics.map((topic, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-start"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-3" />
                    <span>{topic}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Skills */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-2xl font-semibold mb-6">¿Qué aprenderás?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bootcamp.skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-start"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1 mr-3" />
                    <span>{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-sm p-6 sticky top-4"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{bootcamp.duration}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-5 w-5 mr-2" />
                  <span>${bootcamp.price} USD</span>
                </div>
              </div>
              
              {user ? (
                <Link
                  to={`/enroll/${bootcamp.id}`}
                  className="block w-full bg-primary text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors group"
                >
                  <span className="flex items-center justify-center">
                    Inscríbete ahora
                    <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ) : (
                <div className="space-y-4">
                  <Link
                    to="/login"
                    state={{ from: `/bootcamp/${id}` }}
                    className="block w-full bg-primary text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                  >
                    <span className="flex items-center justify-center">
                      <Lock className="h-5 w-5 mr-2" />
                      Inicia sesión para inscribirte
                    </span>
                  </Link>
                  <p className="text-sm text-gray-500 text-center">
                    ¿No tienes una cuenta?{' '}
                    <Link to="/register" className="text-primary hover:underline">
                      Regístrate
                    </Link>
                  </p>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-semibold mb-2">Incluye:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    Acceso de por vida al contenido
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    Certificado de finalización
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    Soporte técnico
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}