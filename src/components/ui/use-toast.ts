"use client";

import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  useToast as useShadcnToast,
} from "./toast";

export const useToast = useShadcnToast;
export { ToastProvider, Toast, ToastTitle, ToastDescription };
