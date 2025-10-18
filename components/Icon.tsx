import React from 'react';
import { icons } from 'lucide-react';

// FIX: Inlined LucideProps definition to fix type inheritance issue.
// This ensures 'size', 'className', and other SVG attributes are available on IconProps.
interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: string;
  size?: string | number;
  absoluteStrokeWidth?: boolean;
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