
import React from 'react';
import { icons } from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
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
