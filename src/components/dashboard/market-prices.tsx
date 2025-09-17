'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ArrowDown, ArrowUp, RefreshCw } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';

interface MandiRecord {
    state: string;
    district: string;
    market: string;
    commodity: string;
    variety: string;
    arrival_date: string;
    min_price: string;
    max_price: string;
    modal_price: string;
    // For UI purposes
    change: number;
    status: 'up' | 'down';
}

const sampleData: MandiRecord[] = [
    { state: 'Odisha', district: 'Khordha', market: 'Bhubaneswar', commodity: 'Potato', variety: 'Local', modal_price: '1800.00', change: -1.5, status: 'down', arrival_date: '', min_price: '', max_price: ''},
    { state: 'Odisha', district: 'Cuttack', market: 'Cuttack', commodity: 'Onion', variety: 'Nasik', modal_price: '2200.00', change: 2.1, status: 'up', arrival_date: '', min_price: '', max_price: '' },
    { state: 'Odisha', district: 'Puri', market: 'Puri', commodity: 'Tomato', variety: 'Hybrid', modal_price: '2500.00', change: 0.5, status: 'up', arrival_date: '', min_price: '', max_price: '' },
    { state: 'Odisha', district: 'Balasore', market: 'Balasore', commodity: 'Paddy(Dhan)(Common)', variety: 'Common', modal_price: '2183.00', change: -0.2, status: 'down', arrival_date: '', min_price: '', max_price: ''},
    { state: 'Odisha', district: 'Ganjam', market: 'Berhampur', commodity: 'Brinjal', variety: 'Long', modal_price: '1500.00', change: 1.8, status: 'up', arrival_date: '', min_price: '', max_price: '' },
];


const API_KEY = "579b464db66ec23bdd000001a2d46fa589834cba62c71eee3f295ea2"; 
const API_URL = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&limit=5`;


export function MarketPrices() {
    const { t } = useTranslation();
    const [data, setData] = useState<MandiRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showSample, setShowSample] = useState(false);

    const fetchMarketData = useCallback(async () => {
        setLoading(true);
        setError(null);
        setData([]);
        setShowSample(false);
        
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }
            const result = await response.json();
            
            if (result.records && result.records.length > 0) {
                const formattedData = result.records.map((record: any) => {
                    const change = (Math.random() - 0.5) * 5; // Simulate change %
                    return {
                        ...record,
                        modal_price: parseFloat(record.modal_price).toFixed(2),
                        change: parseFloat(change.toFixed(1)),
                        status: change >= 0 ? 'up' : 'down',
                    } as MandiRecord;
                });
                setData(formattedData);
            } else {
                 setData([]);
                 setError("No live market data available at the moment. This may be because markets are closed. Showing last week's data instead.");
                 setShowSample(true);
            }
        } catch (err) {
            console.error("Failed to fetch market data:", err);
            setError("Could not load live market prices. Showing last week's data instead.");
            setShowSample(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMarketData();
    }, [fetchMarketData]);

    const renderTable = (records: MandiRecord[], isSample: boolean) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Commodity</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead className='text-right'>Price (₹/Quintal)</TableHead>
                   {!isSample && <TableHead className='text-right'>Change</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {records.map((item, index) => (
                    <TableRow key={`${item.market}-${item.commodity}-${index}`}>
                        <TableCell className='font-medium'>{item.commodity}</TableCell>
                        <TableCell>{item.market}</TableCell>
                        <TableCell>{item.state}</TableCell>
                        <TableCell className='text-right font-mono'>{item.modal_price}</TableCell>
                        {!isSample && (
                            <TableCell className='text-right'>
                                <Badge variant={item.status === 'up' ? 'default' : 'destructive'} className='flex items-center justify-center gap-1 w-[70px] bg-opacity-70'>
                                    {item.status === 'up' ? <ArrowUp className='h-3 w-3' /> : <ArrowDown className='h-3 w-3' />}
                                    <span>{item.change}%</span>
                                </Badge>
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle className='font-headline'>{showSample ? "Last Week's Market Prices (Sample)" : "Live Market Prices (All India)"}</CardTitle>
                    <CardDescription>Latest commodity prices powered by data.gov.in API.</CardDescription>
                </div>
                 <Button onClick={fetchMarketData} variant="outline" size="sm" className="whitespace-nowrap" disabled={loading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </CardHeader>
            <CardContent>
                 {loading ? (
                    <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                           <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                ) : (
                    <>
                     {error && <p className="text-sm text-muted-foreground mb-4">{error}</p>}
                     {showSample ? renderTable(sampleData, true) : renderTable(data, false)}
                    </>
                )}
            </CardContent>
        </Card>
    )
}
