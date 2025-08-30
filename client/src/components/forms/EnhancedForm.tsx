import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  AlertCircle, 
  Save, 
  Upload,
  FileText,
  Clock,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'file' | 'date';
  placeholder?: string;
  required?: boolean;
  validation?: (value: any) => string | null;
  options?: { value: string; label: string }[];
  description?: string;
  step?: number;
}

interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: string[];
}

interface EnhancedFormProps {
  title: string;
  description?: string;
  fields: FormField[];
  steps?: FormStep[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onSave?: (data: Record<string, any>) => void;
  autoSave?: boolean;
  autoSaveInterval?: number; // in seconds
  showProgress?: boolean;
  allowStepJumping?: boolean;
  initialData?: Record<string, any>;
}

export function EnhancedForm({
  title,
  description,
  fields,
  steps = [],
  onSubmit,
  onSave,
  autoSave = true,
  autoSaveInterval = 30,
  showProgress = true,
  allowStepJumping = false,
  initialData = {}
}: EnhancedFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});

  const { toast } = useToast();

  // Auto-save functionality
  const saveFormData = useCallback(async () => {
    if (onSave && hasUnsavedChanges) {
      await onSave({ ...formData, uploadedFiles });
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      toast({
        title: "Auto-saved",
        description: "Your progress has been saved automatically.",
        duration: 2000,
      });
    }
  }, [formData, uploadedFiles, onSave, hasUnsavedChanges, toast]);

  // Auto-save timer
  useEffect(() => {
    if (!autoSave) return;

    const timer = setInterval(() => {
      saveFormData();
    }, autoSaveInterval * 1000);

    return () => clearInterval(timer);
  }, [autoSave, autoSaveInterval, saveFormData]);

  // Update form data
  const updateField = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    setHasUnsavedChanges(true);
    
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[fieldId];
        return updated;
      });
    }
  };

  // File upload handler
  const handleFileUpload = (fieldId: string, file: File | null) => {
    if (file) {
      setUploadedFiles(prev => ({ ...prev, [fieldId]: file }));
      updateField(fieldId, file.name);
    } else {
      setUploadedFiles(prev => {
        const updated = { ...prev };
        delete updated[fieldId];
        return updated;
      });
      updateField(fieldId, '');
    }
  };

  // Validation
  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value === '')) {
      return `${field.label} is required`;
    }
    
    if (field.validation) {
      return field.validation(value);
    }

    // Built-in validations
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    if (field.type === 'number' && value && isNaN(Number(value))) {
      return 'Please enter a valid number';
    }

    return null;
  };

  // Validate current step
  const validateCurrentStep = (): boolean => {
    const currentStepFields = steps.length > 0 
      ? fields.filter(field => steps[currentStep].fields.includes(field.id))
      : fields;

    const newErrors: Record<string, string> = {};
    let isValid = true;

    currentStepFields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Navigation
  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const goToStep = (stepIndex: number) => {
    if (allowStepJumping || stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ ...formData, uploadedFiles });
      toast({
        title: "Form submitted successfully!",
        description: "Your data has been processed.",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current step fields
  const getCurrentStepFields = () => {
    if (steps.length === 0) return fields;
    return fields.filter(field => steps[currentStep].fields.includes(field.id));
  };

  // Calculate progress
  const getProgress = () => {
    if (steps.length === 0) {
      const completedFields = fields.filter(field => 
        formData[field.id] && (!field.required || formData[field.id] !== '')
      ).length;
      return (completedFields / fields.length) * 100;
    }
    return ((currentStep + 1) / steps.length) * 100;
  };

  // Render field
  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];

    return (
      <div key={field.id} className="space-y-2">
        <Label htmlFor={field.id} className="flex items-center gap-2">
          {field.label}
          {field.required && <span className="text-destructive">*</span>}
        </Label>
        
        {field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'number' || field.type === 'date' && (
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            className={error ? "border-destructive" : ""}
          />
        )}

        {field.type === 'textarea' && (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            className={error ? "border-destructive" : ""}
            rows={4}
          />
        )}

        {field.type === 'select' && (
          <Select value={value} onValueChange={(val) => updateField(field.id, val)}>
            <SelectTrigger className={error ? "border-destructive" : ""}>
              <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}...`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {field.type === 'checkbox' && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={value === true}
              onCheckedChange={(checked) => updateField(field.id, checked)}
            />
            <Label htmlFor={field.id} className="text-sm cursor-pointer">
              {field.description || field.placeholder}
            </Label>
          </div>
        )}

        {field.type === 'file' && (
          <div className="space-y-2">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <Label htmlFor={field.id} className="cursor-pointer">
                <span className="text-primary hover:text-primary/80">Click to upload</span>
                <span className="text-muted-foreground"> or drag and drop</span>
              </Label>
              <Input
                id={field.id}
                type="file"
                onChange={(e) => handleFileUpload(field.id, e.target.files?.[0] || null)}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.png,.csv,.xlsx"
              />
              <p className="text-sm text-muted-foreground mt-1">
                PDF, DOC, images, or spreadsheet files
              </p>
            </div>
            {uploadedFiles[field.id] && (
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm flex-1">{uploadedFiles[field.id].name}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleFileUpload(field.id, null)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        )}

        {field.description && field.type !== 'checkbox' && (
          <p className="text-sm text-muted-foreground">{field.description}</p>
        )}

        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            {description && <CardDescription className="mt-2">{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            {autoSave && lastSaved && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="text-xs">
                Unsaved changes
              </Badge>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(getProgress())}% complete</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </div>
        )}

        {/* Step Navigation */}
        {steps.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer",
                    allowStepJumping || index <= currentStep ? "text-foreground" : "text-muted-foreground"
                  )}
                  onClick={() => goToStep(index)}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    index === currentStep ? "bg-primary text-primary-foreground" :
                    index < currentStep ? "bg-success text-success-foreground" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className="hidden sm:block font-medium">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Step Content */}
        {steps.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold">{steps[currentStep].title}</h3>
            {steps[currentStep].description && (
              <p className="text-muted-foreground">{steps[currentStep].description}</p>
            )}
          </div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {getCurrentStepFields().map(renderField)}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex gap-2">
            {steps.length > 0 && currentStep > 0 && (
              <Button variant="outline" onClick={prevStep}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {autoSave && onSave && (
              <Button variant="outline" onClick={saveFormData} disabled={!hasUnsavedChanges}>
                <Save className="w-4 h-4 mr-1" />
                Save Draft
              </Button>
            )}

            {steps.length > 0 && currentStep < steps.length - 1 ? (
              <Button onClick={nextStep}>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </div>

        {/* Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fix the following errors before proceeding:
              <ul className="list-disc list-inside mt-2">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
