'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/reports/date-picker-range";
import { Download } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const availableDataPoints = [
    { id: "soilMoisture", label: "Soil Moisture" },
    { id: "temperature", label: "Temperature" },
    { id: "humidity", label: "Humidity" },
    { id: "nitrogen", label: "Nitrogen (N)" },
    { id: "phosphorus", label: "Phosphorus (P)" },
    { id: "potassium", label: "Potassium (K)" },
];

export default function ReportsPage() {
    const { t } = useTranslation();

    const handleExport = () => {
        // Mock data generation
        const headers = "Date,Soil Moisture (%),Temperature (°C),Humidity (%),Nitrogen (mg/kg),Phosphorus (mg/kg),Potassium (mg/kg)\n";
        const rows = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return `${date.toISOString().split('T')[0]},${(45 + Math.random() * 10).toFixed(1)},${(30 + Math.random() * 5).toFixed(1)},${(70 + Math.random() * 10).toFixed(1)},${(150 + Math.random() * 20).toFixed(0)},${(50 + Math.random() * 10).toFixed(0)},${(100 + Math.random() * 15).toFixed(0)}`;
        }).join('\n');

        const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "bhumicare_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Farm Performance Reports</CardTitle>
                    <CardDescription>Generate and download historical data for your farm.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label className="font-semibold">Select Date Range</Label>
                        <DatePickerWithRange className="mt-2" />
                    </div>
                     <div>
                        <Label className="font-semibold">Select Data Points</Label>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                            {availableDataPoints.map((item) => (
                                <div key={item.id} className="flex items-center space-x-2">
                                    <Checkbox id={item.id} defaultChecked />
                                    <Label htmlFor={item.id} className="font-normal">{item.label}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        {t('export_csv')}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
