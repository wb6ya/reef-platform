"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "./Button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={cn(
          "w-full max-w-md bg-white rounded-2xl shadow-lg flex flex-col max-h-[90vh] overflow-hidden",
          "animate-in zoom-in-95 duration-200"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 px-0" aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
