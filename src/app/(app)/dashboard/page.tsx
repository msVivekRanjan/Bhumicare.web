import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import RealTimeMetrics from '@/components/dashboard/real-time-metrics';
import { WeatherWidget } from '@/components/dashboard/weather-widget';
import { RecommendationCard } from '@/components/dashboard/recommendation-card';
import { DataChart } from '@/components/dashboard/data-chart';
import { useTranslation } from '@/hooks/use-translation';

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <RealTimeMetrics />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium font-headline">{t('soil_data_trends')}</CardTitle>
              <div className="flex items-center gap-2">
                 <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Download className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        {t('export_csv')}
                    </span>
                 </Button>
                 <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Download className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        {t('export_pdf')}
                    </span>
                 </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataChart />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <WeatherWidget />
          <RecommendationCard />
        </div>
      </div>
    </div>
  );
}
