'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import { MessageCircle, ThumbsUp } from "lucide-react";

const mockPosts = [
    {
        id: '1',
        author: 'Ram Kumar',
        avatar: 'https://picsum.photos/seed/user2/40/40',
        timestamp: '2 hours ago',
        content: "My wheat crop is showing signs of yellowing leaves. I've already applied urea, but it's not helping. Any suggestions for what might be the cause? Could it be a nutrient deficiency other than nitrogen?",
        likes: 12,
        comments: 3,
    },
    {
        id: '2',
        author: 'Sita Devi',
        avatar: 'https://picsum.photos/seed/user3/40/40',
        timestamp: '1 day ago',
        content: "Has anyone tried the new drought-resistant maize variety (Pioneer P3501)? I'm thinking of planting it this season in the Vidarbha region. Looking for feedback on its yield and water requirements.",
        likes: 25,
        comments: 8,
    },
    {
        id: '3',
        author: 'Vijay Singh',
        avatar: 'https://picsum.photos/seed/user4/40/40',
        timestamp: '3 days ago',
        content: "Sharing a success story! I used the AI recommendation for drip irrigation scheduling, and it's saved me almost 30% on my water usage for my tomato crop without affecting the yield. Highly recommend trusting the AI!",
        likes: 42,
        comments: 11,
    }
]

export default function CommunityForumPage() {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Community Forum</CardTitle>
                    <CardDescription>Ask questions and share your knowledge with fellow farmers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full gap-2">
                        <Textarea placeholder="What's on your mind, Farmer?" />
                        <Button>Post to Community</Button>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {mockPosts.map(post => (
                    <Card key={post.id}>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={post.avatar} alt={post.author} />
                                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{post.author}</p>
                                    <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed">{post.content}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                             <div className="flex gap-4 text-muted-foreground">
                                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                    <ThumbsUp className="h-4 w-4" /> {post.likes} Likes
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                    <MessageCircle className="h-4 w-4" /> {post.comments} Comments
                                </Button>
                             </div>
                             <Button variant="outline" size="sm">Read More</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
