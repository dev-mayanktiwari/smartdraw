import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Title skeleton */}
        <Skeleton className="h-10 w-64 mb-8" />

        {/* Cards grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Generate 3 card skeletons */}
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg">
              {/* Card header skeleton */}
              <div className="flex items-center mb-4">
                <Skeleton className="h-6 w-6 rounded-full mr-2" />
                <Skeleton className="h-6 w-32" />
              </div>
              {/* Card content skeleton */}
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>

        {/* Recent Projects section skeleton */}
        <div className="mt-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="bg-gray-800 rounded-lg p-6">
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
