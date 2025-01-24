import type { FC } from "react";

const LoadingSpinner: FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
    </div>
  );
};

export default LoadingSpinner;