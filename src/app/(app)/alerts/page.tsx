import { AlertItem } from "@/components/alerts/alert-item";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Alert } from "@/types";

const mockAlerts: Alert[] = [
    { id: '1', type: 'critical', message: 'Soil moisture is critically low (20%). Immediate irrigation required.', timestamp: '2 hours ago' },
    { id: '2', type: 'warning', message: 'Temperature approaching critical threshold (38°C). Monitor crop stress.', timestamp: '1 day ago' },
    { id: '3', type: 'info', message: 'Nitrogen levels are optimal after recent fertilization.', timestamp: '2 days ago' },
    { id: '4', type: 'warning', message: 'Phosphorus levels are slightly below the recommended range.', timestamp: '3 days ago' },
];

export default function AlertsPage() {
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">{t('alerts')}</CardTitle>
                <CardDescription>History of all notifications and alerts.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {mockAlerts.map(alert => (
                        <AlertItem key={alert.id} alert={alert} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
