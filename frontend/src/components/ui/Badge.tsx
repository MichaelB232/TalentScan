// src/components/ui/Badge.tsx
// Reusable badge/chip component.

interface BadgeProps {
  label: string;
  variant?: "blue" | "orange" | "green" | "gray" | "red" | "yellow";
}

const variantMap: Record<string, string> = {
  blue:   "bg-blue-100 text-blue-700",
  orange: "bg-orange-100 text-orange-700",
  green:  "bg-green-100 text-green-700",
  gray:   "bg-gray-100 text-gray-600",
  red:    "bg-red-100 text-red-600",
  yellow: "bg-yellow-100 text-yellow-700",
};

export default function Badge({ label, variant = "gray" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantMap[variant]}`}>
      {label}
    </span>
  );
}
