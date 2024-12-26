"use client";

import React, { useState, useEffect } from "react";
import { updateProductStocks } from "@/actions/update-stock";
import { Button } from "@/components/ui/button";

const AdminUpdateStocks: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);

  const handleUpdateStocks = async () => {
    setIsLoading(true);
    setUpdateSuccess(null);

    try {
      const response = await updateProductStocks();
      if (response.success) {
        setUpdateSuccess(true);
      } else {
        throw new Error(response.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating stocks:", error);
      setUpdateSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-around flex-col items-start w-full md:w-56  mx-2 mt-5 rounded-lg h-24 md:h-28 bg-gray-100 px-4 py-2">
      <span className="font-semibold text-center mb-2">Update Stocks</span>
      {isLoading !== null ? (
        <Button
          onClick={handleUpdateStocks}
          disabled={isLoading}
          variant={isLoading ? "destructive" : "default"}
          className="mt-2 ml-5 "
        >
          {isLoading ? "Updating Stocks..." : "Update Stocks"}
        </Button>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AdminUpdateStocks;
