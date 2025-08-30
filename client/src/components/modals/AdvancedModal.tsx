import { useState, useEffect, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Maximize2,
  Minimize2,
  Move,
  AlertTriangle,
  CheckCircle,
  Info,
  AlertCircle,
  Download,
  Share,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalAction {
  label: string;
  variant?: "default" | "destructive" | "outline" | "secondary";
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

interface AdvancedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  type?:
    | "default"
    | "alert"
    | "confirm"
    | "info"
    | "success"
    | "warning"
    | "error";
  actions?: ModalAction[];
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  fullscreenToggle?: boolean;
  headerActions?: ReactNode;
  footer?: ReactNode;
  className?: string;
  overlayClassName?: string;
  zIndex?: number;
  autoClose?: number; // in seconds
  preventClose?: boolean;
}

const modalIcons = {
  alert: AlertTriangle,
  confirm: AlertCircle,
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const modalColors = {
  default: "border-border",
  alert:
    "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950",
  confirm: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950",
  info: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950",
  success:
    "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950",
  warning:
    "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950",
  error: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
};

const iconColors = {
  alert: "text-yellow-600 dark:text-yellow-400",
  confirm: "text-blue-600 dark:text-blue-400",
  info: "text-blue-600 dark:text-blue-400",
  success: "text-green-600 dark:text-green-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  error: "text-red-600 dark:text-red-400",
};

export function AdvancedModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  type = "default",
  actions = [],
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  draggable = false,
  resizable = false,
  fullscreenToggle = false,
  headerActions,
  footer,
  className,
  overlayClassName,
  zIndex = 1000,
  autoClose,
  preventClose = false,
}: AdvancedModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [timeLeft, setTimeLeft] = useState(autoClose);

  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Auto-close timer
  useEffect(() => {
    if (!autoClose || !isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          onClose();
          return 0;
        }
        return prev ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoClose, isOpen, onClose]);

  // Reset timer when modal opens
  useEffect(() => {
    if (isOpen && autoClose) {
      setTimeLeft(autoClose);
    }
  }, [isOpen, autoClose]);

  // Escape key handler
  useEffect(() => {
    if (!closeOnEscape || preventClose) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeOnEscape, isOpen, onClose, preventClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw] max-h-[95vh]",
  };

  const IconComponent = type !== "default" ? modalIcons[type] : null;

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center p-4",
        overlayClassName,
      )}
      style={{ zIndex }}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlayClick && !preventClose ? onClose : undefined}
      />

      {/* Modal */}
      <Card
        ref={modalRef}
        className={cn(
          "relative w-full max-h-[90vh] overflow-hidden",
          sizeClasses[size],
          isFullscreen && "max-w-[98vw] max-h-[98vh]",
          modalColors[type],
          className,
        )}
        style={{
          transform:
            draggable && !isFullscreen
              ? `translate(${position.x}px, ${position.y}px)`
              : undefined,
          cursor: isDragging ? "grabbing" : undefined,
        }}
      >
        {/* Header */}
        <CardHeader
          ref={headerRef}
          className={cn(
            "flex flex-row items-center justify-between space-y-0 pb-3",
            draggable && !isFullscreen && "cursor-grab active:cursor-grabbing",
          )}
        >
          <div className="flex items-center gap-3">
            {IconComponent && (
              <IconComponent className={cn("w-5 h-5", iconColors[type])} />
            )}
            <div>
              {title && <CardTitle className="text-lg">{title}</CardTitle>}
              {description && (
                <CardDescription className="mt-1">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-close timer */}
            {autoClose && timeLeft && (
              <Badge variant="secondary" className="text-xs">
                {timeLeft}s
              </Badge>
            )}

            {/* Header actions */}
            {headerActions}

            {/* Fullscreen toggle */}
            {fullscreenToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-8 w-8 p-0"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            )}

            {/* Draggable indicator */}
            {draggable && !isFullscreen && (
              <Move className="w-4 h-4 text-muted-foreground" />
            )}

            {/* Close button */}
            {showCloseButton && !preventClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="max-h-[70vh] overflow-y-auto">
          {children}
        </CardContent>

        {/* Actions */}
        {(actions.length > 0 || footer) && (
          <div className="px-6 py-4 border-t bg-muted/20">
            {footer || (
              <div className="flex justify-end gap-2">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || "default"}
                    onClick={action.onClick}
                    disabled={action.disabled || action.loading}
                    className="min-w-[80px]"
                  >
                    {action.loading ? "Loading..." : action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );

  return createPortal(modalContent, document.body);
}

// Predefined modal types for common use cases
export function AlertModal({
  isOpen,
  onClose,
  title = "Alert",
  message,
  onConfirm,
  confirmLabel = "OK",
  type = "alert",
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  onConfirm?: () => void;
  confirmLabel?: string;
  type?: "alert" | "info" | "success" | "warning" | "error";
}) {
  return (
    <AdvancedModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type={type}
      size="sm"
      actions={[
        {
          label: confirmLabel,
          onClick: onConfirm || onClose,
          variant: type === "error" ? "destructive" : "default",
        },
      ]}
    >
      <p className="text-sm">{message}</p>
    </AdvancedModal>
  );
}

export function ConfirmModal({
  isOpen,
  onClose,
  title = "Confirm Action",
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
}) {
  return (
    <AdvancedModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type="confirm"
      size="sm"
      actions={[
        {
          label: cancelLabel,
          variant: "outline",
          onClick: onCancel || onClose,
        },
        {
          label: confirmLabel,
          variant: destructive ? "destructive" : "default",
          onClick: onConfirm,
          loading,
        },
      ]}
    >
      <p className="text-sm">{message}</p>
    </AdvancedModal>
  );
}
