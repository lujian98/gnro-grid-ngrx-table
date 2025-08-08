export interface GnroFormFieldError {
  type: string;
  requiredLength?: number;
  actualLength?: number;
  max?: number;
  min?: number;
  message?: string;
}
