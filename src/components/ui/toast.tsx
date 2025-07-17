"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-white border-gray-200 text-gray-900",
        destructive: "bg-red-600 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Toast.displayName = "Toast";

const ToastTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("text-sm font-semibold", className)}
      {...props}
    />
  );
});
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
  );
});
ToastDescription.displayName = "ToastDescription";

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>; // Platzhalter, falls kein Context genutzt wird
};

const useToast = () => {
  const toast = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    alert(`${title}\n\n${description}`); // Fallback: kannst du durch echten Toast ersetzen
  };
  return { toast };
};

export { ToastProvider, Toast, ToastTitle, ToastDescription, useToast };
