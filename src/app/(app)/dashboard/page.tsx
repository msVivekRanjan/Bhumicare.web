'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RealTimeMetrics from '@/components/dashboard/real-time-metrics';
import { WeatherWidget } from '@/components/dashboard/weather-widget';
import { RecommendationCard } from '@/components/dashboard/recommendation-card';
import { DataChart } from '@/components/dashboard/data-chart';
import { useTranslation } from '@/hooks/use-translation';
import { MarketPrices } from '@/components/dashboard/market-prices';
import { WelcomeBanner } from '@/components/dashboard/welcome-banner';
import { PestAlerts } from '@/components/dashboard/pest-alerts';
import { CropCalendar } from '@/components/dashboard/crop-calendar';

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner name="Farmer" />
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Main Data */}
        <div className="lg:col-span-2 space-y-6">
           <RealTimeMetrics />
           <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium font-headline">{t('soil_data_trends')}</CardTitle>
              <CardDescription>24-hour performance data</CardDescription>
            </CardHeader>
            <CardContent>
              <DataChart />
            </CardContent>
          </Card>
           <MarketPrices />
           <PestAlerts />
        </div>
        
        {/* Right Column: Widgets & Tools */}
        <div className="space-y-6">
          <WeatherWidget />
          <RecommendationCard />
          <CropCalendar />
        </div>
      </div>
    </div>
  );
}
