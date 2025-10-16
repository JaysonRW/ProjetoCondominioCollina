import React from 'react';
import { icons, LucideProps } from 'lucide-react';

// FIX: Update IconProps to extend LucideProps. This allows passing props like 'size' to the underlying Lucide icon, fixing type errors.
interface IconProps extends LucideProps {
  name: string;
}

const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const LucideIcon = icons[name as keyof typeof icons];

  if (!LucideIcon) {
    // Retorna um ícone padrão ou nulo se o nome for inválido
    return null;
  }

  return <LucideIcon {...props} />;
};

export default Icon;
