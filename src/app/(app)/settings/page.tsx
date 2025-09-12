'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "@/hooks/use-translation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
    const { t } = useTranslation();
    const { toast } = useToast();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('bhumicare_user_name');
        const storedEmail = localStorage.getItem('bhumicare_user_email');
        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
    }, []);

    const handleSaveChanges = (section: string) => {
        toast({
            title: "Settings Saved!",
            description: `Your ${section} have been updated.`,
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Profile</CardTitle>
                    <CardDescription>Manage your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t('full_name')}</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('email')}</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <Button onClick={() => handleSaveChanges('profile settings')}>Save Changes</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Farm Details</CardTitle>
                    <CardDescription>Provide details about your farm for more accurate recommendations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="crop-type">Primary Crop Type</Label>
                            <Select defaultValue="wheat">
                                <SelectTrigger id="crop-type">
                                    <SelectValue placeholder="Select crop" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="wheat">Wheat</SelectItem>
                                    <SelectItem value="rice">Rice</SelectItem>
                                    <SelectItem value="maize">Maize</SelectItem>
                                    <SelectItem value="sugarcane">Sugarcane</SelectItem>
                                    <SelectItem value="cotton">Cotton</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="soil-type">Soil Type</Label>
                             <Select defaultValue="alluvial">
                                <SelectTrigger id="soil-type">
                                    <SelectValue placeholder="Select soil type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="alluvial">Alluvial</SelectItem>
                                    <SelectItem value="black">Black</SelectItem>
                                    <SelectItem value="red">Red</SelectItem>
                                    <SelectItem value="laterite">Laterite</SelectItem>
                                    <SelectItem value="sandy">Sandy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="farm-size">Farm Size (in acres)</Label>
                        <Input id="farm-size" type="number" defaultValue="10" />
                    </div>
                    <Button onClick={() => handleSaveChanges('farm details')}>Save Farm Details</Button>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Measurement Units</CardTitle>
                    <CardDescription>Choose your preferred units for data display.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Temperature</Label>
                        <RadioGroup defaultValue="celsius" className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="celsius" id="celsius" />
                                <Label htmlFor="celsius">Celsius (°C)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="fahrenheit" id="fahrenheit" />
                                <Label htmlFor="fahrenheit">Fahrenheit (°F)</Label>
                            </div>
                        </RadioGroup>
                    </div>
                     <div className="space-y-2">
                        <Label>Area</Label>
                        <RadioGroup defaultValue="acres" className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="acres" id="acres" />
                                <Label htmlFor="acres">Acres</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="hectares" id="hectares" />
                                <Label htmlFor="hectares">Hectares</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <Button onClick={() => handleSaveChanges('unit preferences')}>Save Unit Preferences</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Notifications</CardTitle>
                    <CardDescription>Manage how you receive alerts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="email-notifications" defaultChecked />
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="push-notifications" />
                        <Label htmlFor="push-notifications">Browser Push Notifications</Label>
                    </div>
                    <Button onClick={() => handleSaveChanges('notification preferences')}>Save Preferences</Button>
                </CardContent>
            </Card>
        </div>
    );
}
