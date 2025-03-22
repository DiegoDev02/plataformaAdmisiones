interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export default function LoadingSpinner({ 
  size = 'medium', 
  color = '#7B5DFA' 
}: LoadingSpinnerProps) {
  // Determinar el tamaño del spinner
  const sizeMap = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };
  
  const spinnerSize = sizeMap[size];

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full ${spinnerSize} border-4 border-solid border-t-transparent`} 
           style={{ borderColor: `transparent transparent transparent ${color}` }} />
    </div>
  );
}
