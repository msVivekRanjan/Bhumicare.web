'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";

interface Comment {
    author: string;
    text: string;
}
interface Post {
    id: string;
    author: string;
    avatar: string;
    timestamp: string;
    content: string;
    likes: number;
    comments: Comment[];
    likedByMe: boolean;
}

interface PostCardProps {
    post: Post;
    onLike: () => void;
    onAddComment: (commentText: string) => void;
}

export function PostCard({ post, onLike, onAddComment }: PostCardProps) {
    const [newComment, setNewComment] = useState('');

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(newComment);
            setNewComment('');
        }
    };

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
            <CardFooter className="flex-col items-start">
                 <div className="flex justify-between items-center w-full">
                    <div className="flex gap-2 text-muted-foreground">
                        <Button variant="ghost" size="sm" className={cn("flex items-center gap-2", post.likedByMe && "text-primary")} onClick={onLike}>
                            <ThumbsUp className={cn("h-4 w-4", post.likedByMe && "fill-current")} /> {post.likes}
                        </Button>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                <MessageCircle className="h-4 w-4" /> {post.comments.length}
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" size="sm">View Comments</Button>
                    </CollapsibleTrigger>
                 </div>
                 <CollapsibleContent className="w-full mt-4 space-y-4">
                    <Separator />
                    <div className="space-y-4 pt-4">
                        {post.comments.map((comment, index) => (
                             <div key={index} className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={`https://picsum.photos/seed/${comment.author}/32/32`} alt={comment.author} />
                                    <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="bg-muted p-3 rounded-lg w-full">
                                    <p className="font-semibold text-xs">{comment.author}</p>
                                    <p className="text-sm">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                         {post.comments.length === 0 && (
                            <p className="text-xs text-center text-muted-foreground">No comments yet. Be the first to reply!</p>
                        )}
                    </div>
                    <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-4">
                        <Textarea 
                            placeholder="Write a comment..." 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="min-h-[40px] text-sm"
                        />
                        <Button type="submit" size="sm" disabled={!newComment.trim()}>Reply</Button>
                    </form>
                </CollapsibleContent>
            </CardFooter>
        </Card>
    );
}
