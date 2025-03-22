import { Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="col-span-1">
            <Link to="/" className="flex items-center">
              <Code2 className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">Kodigo</span>
            </Link>
          </div>
        
          <div className="mt-8">
            <p className="text-center text-gray-300">
              © {new Date().getFullYear()} Kodigo. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}