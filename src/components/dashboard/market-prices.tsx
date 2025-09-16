'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';

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

const API_KEY = "579b464db66ec23bdd000001a2d46fa589834cba62c71eee3f295ea2"; 
const API_URL = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&limit=5&filters[state]=Odisha&filters[district]=Khordha&filters[market]=Bhubaneswar`;


export function MarketPrices() {
    const { t } = useTranslation();
    const [data, setData] = useState<MandiRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMarketData = async () => {
            setLoading(true);
            setError(null);
            
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
                     // setError("No records found for the selected market.");
                }
            } catch (err) {
                console.error("Failed to fetch market data:", err);
                setError("Could not load live market prices. Please check the API key and network.");
            } finally {
                setLoading(false);
            }
        };

        fetchMarketData();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className='font-headline'>Live Market Prices (Bhubaneswar)</CardTitle>
                <CardDescription>Latest prices from agricultural markets.</CardDescription>
            </CardHeader>
            <CardContent>
                 {error && <p className="text-sm text-center text-destructive p-4">{error}</p>}
                 {loading ? (
                    <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                           <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                ) : !error && data.length === 0 ? (
                    <p className="text-sm text-center text-muted-foreground p-4">No live market data available for Bhubaneswar at the moment.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Commodity</TableHead>
                                <TableHead>Variety</TableHead>
                                <TableHead className='text-right'>Price (₹/Quintal)</TableHead>
                                <TableHead className='text-right'>Change</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={`${item.market}-${item.commodity}-${index}`}>
                                    <TableCell className='font-medium'>{item.commodity}</TableCell>
                                    <TableCell>{item.variety}</TableCell>
                                    <TableCell className='text-right font-mono'>{item.modal_price}</TableCell>
                                    <TableCell className='text-right'>
                                        <Badge variant={item.status === 'up' ? 'default' : 'destructive'} className='flex items-center justify-center gap-1 w-[70px] bg-opacity-70'>
                                            {item.status === 'up' ? <ArrowUp className='h-3 w-3' /> : <ArrowDown className='h-3 w-3' />}
                                            <span>{item.change}%</span>
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}
