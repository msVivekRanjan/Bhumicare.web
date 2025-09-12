'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, ThumbsUp } from "lucide-react";

interface Post {
    id: string;
    author: string;
    avatar: string;
    timestamp: string;
    content: string;
    likes: number;
    commentsCount: number;
}

interface PostCardProps {
    post: Post;
    onLike: () => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
    const { toast } = useToast();

    const handleViewComments = () => {
        toast({
            title: "Feature Coming Soon!",
            description: "The ability to view and add comments is under development."
        })
    }

    return (
        <Card>
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
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-between items-center gap-2">
                 <div className="flex gap-2 text-muted-foreground">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={onLike}>
                        <ThumbsUp className="h-4 w-4" /> {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={handleViewComments}>
                        <MessageCircle className="h-4 w-4" /> {post.commentsCount}
                    </Button>
                 </div>
                 <Button variant="outline" size="sm" onClick={handleViewComments}>View Comments</Button>
            </CardFooter>
        </Card>
    );
}
