'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface NewPostFormProps {
    onAddPost: (content: string) => void;
}

export function NewPostForm({ onAddPost }: NewPostFormProps) {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            onAddPost(content);
            setContent('');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Community Forum</CardTitle>
                <CardDescription>Ask questions and share your knowledge with fellow farmers.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid w-full gap-2">
                    <Textarea 
                        placeholder="What's on your mind, Farmer?" 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                    <Button type="submit" disabled={!content.trim()}>Post to Community</Button>
                </form>
            </CardContent>
        </Card>
    );
}
