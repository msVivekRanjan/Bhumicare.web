import { Alert as AlertType } from "@/types";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Alert as ShadcnAlert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface AlertItemProps {
    alert: AlertType;
}

const alertConfig = {
    critical: {
        icon: <AlertTriangle className="h-4 w-4" />,
        title: "Critical Alert",
        variant: "destructive" as "destructive"
    },
    warning: {
        icon: <AlertCircle className="h-4 w-4" />,
        title: "Warning",
        variant: "default" as "default"
    },
    info: {
        icon: <Info className="h-4 w-4" />,
        title: "Information",
        variant: "default" as "default"
    }
};

export function AlertItem({ alert }: AlertItemProps) {
    const config = alertConfig[alert.type];

    return (
        <ShadcnAlert variant={config.variant} className={cn(alert.type === 'warning' && "border-yellow-500/50 text-yellow-500 dark:border-yellow-500 [&>svg]:text-yellow-500")}>
            {config.icon}
            <AlertTitle className="flex justify-between items-center">
                <span>{config.title}</span>
                <span className="text-xs font-normal text-muted-foreground">{alert.timestamp}</span>
            </AlertTitle>
            <AlertDescription>
                {alert.message}
            </AlertDescription>
        </ShadcnAlert>
    );
}
