'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";

const faqs = [
    {
        question: "How does the AI generate recommendations?",
        answer: "Our AI, powered by Google Gemini, analyzes the real-time data from your soil sensors (moisture, NPK, temperature) and combines it with weather forecasts and crop-specific models to provide tailored advice for irrigation, fertilization, and pest control."
    },
    {
        question: "How do I calibrate my soil sensors?",
        answer: "Sensor calibration is typically done upon installation. If you suspect your readings are inaccurate, please refer to the sensor's user manual or contact our support team for a step-by-step guide on recalibration."
    },
    {
        question: "Can I add multiple fields or farms to my account?",
        answer: "Currently, the dashboard supports monitoring a single, contiguous field defined during registration. We are working on multi-field support for a future release."
    },
    {
        question: "How often is the market price data updated?",
        answer: "The live market prices are updated every 15 minutes from major agricultural markets (Mandis) across your region to ensure you have the most current information for making selling decisions."
    }
]

export default function SupportPage() {
    const { t } = useTranslation();
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Request Submitted!",
            description: "An expert will get back to you within 24 hours.",
        })
    }
    return (
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Contact an Expert</CardTitle>
                        <CardDescription>Have a specific question? Fill out the form below and one of our agricultural experts will assist you.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Your Name</Label>
                                <Input id="name" defaultValue="Farmer" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="category">Inquiry Category</Label>
                                 <Select>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="crop-disease">Crop Disease</SelectItem>
                                        <SelectItem value="fertilizer">Fertilizer/Nutrients</SelectItem>
                                        <SelectItem value="irrigation">Irrigation</SelectItem>
                                        <SelectItem value="technical">Technical Support</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="question">Your Question</Label>
                                <Textarea id="question" placeholder="Please describe your issue in detail..." className="min-h-[150px]" />
                            </div>
                            <Button type="submit">Submit Request</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Frequently Asked Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                           {faqs.map((faq, index) => (
                             <AccordionItem value={`item-${index+1}`} key={index}>
                                <AccordionTrigger>{faq.question}</AccordionTrigger>
                                <AccordionContent>
                                   {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                           ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
