'use client';

import { useTranslation } from '@/hooks/use-translation';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Badge } from '../ui/badge';

const mockMarketData = [
    { crop: 'Wheat', variety: 'HD-2967', price: 2150, change: 1.2, status: 'up' },
    { crop: 'Rice', variety: 'Basmati-1121', price: 3500, change: -0.8, status: 'down' },
    { crop: 'Maize', variety: 'Hybrid-900M', price: 1850, change: 2.5, status: 'up' },
    { crop: 'Potato', variety: 'Kufri Jyoti', price: 1200, change: 0.5, status: 'up' },
    { crop: 'Tomato', variety: 'Hybrid', price: 2500, change: -3.1, status: 'down' },
];

export function MarketPrices() {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle className='font-headline'>Live Market Prices (Mandi)</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Crop</TableHead>
                            <TableHead>Variety</TableHead>
                            <TableHead className='text-right'>Price (₹/Quintal)</TableHead>
                            <TableHead className='text-right'>Change</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockMarketData.map((item) => (
                            <TableRow key={item.crop}>
                                <TableCell className='font-medium'>{item.crop}</TableCell>
                                <TableCell>{item.variety}</TableCell>
                                <TableCell className='text-right font-mono'>{item.price.toFixed(2)}</TableCell>
                                <TableCell className='text-right'>
                                    <Badge variant={item.status === 'up' ? 'default' : 'destructive'} className='flex items-center justify-center gap-1 w-[70px] bg-opacity-70'>
                                        {item.status === 'up' ? <ArrowUp className='h-3 w-3' /> : <ArrowDown className='h-3 w-3' />}
                                        <span>{item.change.toFixed(1)}%</span>
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
