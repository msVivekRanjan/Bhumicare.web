import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "@/hooks/use-translation";

export default function SettingsPage() {
    const { t } = useTranslation();
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
                        <Input id="name" defaultValue="Farmer" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('email')}</Label>
                        <Input id="email" type="email" defaultValue="farmer@bhumicare.com" />
                    </div>
                    <Button>Save Changes</Button>
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
                    <Button>Save Preferences</Button>
                </CardContent>
            </Card>
        </div>
    );
}
