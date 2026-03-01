import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number): string {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
}

export function getSeverityColor(severity: string): string {
    switch (severity.toLowerCase()) {
        case "critical":
            return "text-red-500 bg-red-500/10 border-red-500/30";
        case "high":
            return "text-orange-500 bg-orange-500/10 border-orange-500/30";
        case "medium":
            return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
        case "low":
            return "text-blue-500 bg-blue-500/10 border-blue-500/30";
        case "informational":
            return "text-gray-500 bg-gray-500/10 border-gray-500/30";
        default:
            return "text-gray-500 bg-gray-500/10 border-gray-500/30";
    }
}

export function getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
        case "open":
            return "text-neon-green bg-neon-green/10 border-neon-green/30";
        case "in_progress":
            return "text-neon-teal bg-neon-teal/10 border-neon-teal/30";
        case "resolved":
            return "text-blue-500 bg-blue-500/10 border-blue-500/30";
        case "closed":
            return "text-gray-500 bg-gray-500/10 border-gray-500/30";
        case "duplicate":
            return "text-purple-500 bg-purple-500/10 border-purple-500/30";
        case "invalid":
            return "text-red-500 bg-red-500/10 border-red-500/30";
        default:
            return "text-gray-500 bg-gray-500/10 border-gray-500/30";
    }
}
