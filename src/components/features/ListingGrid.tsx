import React from "react";
import { ListingCardProps, ListingCard } from "./ListingCard";

export const ListingGrid: React.FC<{ listings: ListingCardProps[] }> = ({ listings }) => {
  if (listings.length === 0) {
    return (
      <div className="w-full text-center py-12 text-gray-500">
        No listings found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {listings.map(l => (
        <ListingCard key={l.id} {...l} />
      ))}
    </div>
  );
};
