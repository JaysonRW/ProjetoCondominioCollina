import React from 'react';
import { icons, LucideProps } from 'lucide-react';

// FIX: The IconProps interface now extends LucideProps. This allows passing standard Lucide icon properties like 'size' and 'className' directly to the Icon component, which resolves the type errors.
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