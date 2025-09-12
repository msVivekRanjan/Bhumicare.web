import { FertilityMapLoader } from "@/components/farm-map/fertility-map-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export default function FarmMapPage() {
    const { t } = useTranslation();
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="font-headline">{t('soil_fertility_map')}</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)]">
                <FertilityMapLoader />
            </CardContent>
        </Card>
    );
}
