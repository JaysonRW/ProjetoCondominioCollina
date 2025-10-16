// FIX: Corrected React import to fix JSX typing errors.
import React from 'react';

const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-md ${className}`}></div>
  );
};

export const AnuncianteCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl">
        <div className="p-5">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
            </div>
            <div className="mt-4 flex justify-between items-center">
                 <Skeleton className="h-8 w-24 rounded-full" />
                 <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
        </div>
    </div>
);

export const ComunicadoCardSkeleton: React.FC = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-5 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
        <Skeleton className="h-4 w-1/2" />
    </div>
);


export default Skeleton;