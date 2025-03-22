import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Search, Filter, ArrowRight, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

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
  tag_color?: string;
  interaction_count?: number;
}

const TAG_COLORS = {
  'web': 'bg-blue-500/20 text-blue-400',
  'data': 'bg-purple-500/20 text-purple-400',
  'mobile': 'bg-green-500/20 text-green-400',
  'fundamentals': 'bg-yellow-500/20 text-yellow-400'
};

export default function BootcampsPage() {
  const { user } = useAuth();
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredBootcamps, setFeaturedBootcamps] = useState<Bootcamp[]>([]);

  useEffect(() => {
    fetchBootcamps();
    if (user) {
      fetchInteractions();
    }
  }, [user]);

  const trackInteraction = async (bootcampId: string) => {
    if (!user) return;

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

    try {
      await supabase
        .from('bootcamp_interactions')
        .upsert({
          bootcamp_id: bootcampId,
          user_id: user.id,
          interaction_type: 'view',
          month: currentMonth
        }, {
          onConflict: 'bootcamp_id,user_id,interaction_type,month'
        });

      fetchInteractions();
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  const fetchInteractions = async () => {
    try {
      const { data: interactions, error } = await supabase
        .rpc('get_bootcamp_interactions', {
          interaction_type: 'view'
        });

      if (error) throw error;

      // Update bootcamps with interaction counts
      setBootcamps(current => 
        current.map(bootcamp => ({
          ...bootcamp,
          interaction_count: interactions.find(i => i.bootcamp_id === bootcamp.id)?.count || 0
        }))
      );

      // Update featured bootcamps based on interaction count
      const sorted = [...bootcamps].sort((a, b) => 
        (b.interaction_count || 0) - (a.interaction_count || 0)
      );
      setFeaturedBootcamps(sorted.slice(0, 3));
    } catch (error) {
      console.error('Error fetching interactions:', error);
    }
  };

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

  const filteredBootcamps = bootcamps.filter(bootcamp => {
    const matchesSearch = bootcamp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bootcamp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || bootcamp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(bootcamps.map(b => b.category))];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1A0B2E] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Explora nuestros Bootcamps
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Encuentra el programa perfecto para impulsar tu carrera en tecnología
          </motion.p>
        </div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#2D1B69] rounded-xl p-6 mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar bootcamp..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1A0B2E] text-white rounded-lg border border-[#3D2B79] focus:border-[#6B20FF] focus:outline-none"
                />
              </div>
            </div>
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1A0B2E] text-white rounded-lg border border-[#3D2B79] focus:border-[#6B20FF] focus:outline-none appearance-none"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.filter(c => c !== 'all').map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bootcamps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredBootcamps.map((bootcamp) => (
            <motion.div
              key={bootcamp.id}
              variants={itemVariants}
              className="bg-[#2D1B69] rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={bootcamp.image_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200'}
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
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      TAG_COLORS[bootcamp.category as keyof typeof TAG_COLORS] ||
                      'bg-[#6B20FF]/20 text-[#6B20FF]'
                    }`}>
                      {bootcamp.category}
                    </span>
                    {bootcamp.interaction_count && bootcamp.interaction_count > 5 && (
                      <span className="ml-2 inline-flex items-center text-yellow-400">
                        <Star className="w-4 h-4 mr-1" />
                        Destacado
                      </span>
                    )}
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
                  onClick={() => trackInteraction(bootcamp.id)}
                  className="flex items-center justify-center w-full py-3 bg-[#6B20FF] text-white rounded-lg hover:bg-[#5910FF] transition-colors group"
                >
                  Ver detalles
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B20FF]" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBootcamps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No se encontraron bootcamps que coincidan con tu búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}