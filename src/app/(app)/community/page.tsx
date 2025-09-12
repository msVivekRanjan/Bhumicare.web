'use client';

import { useState } from 'react';
import { useTranslation } from "@/hooks/use-translation";
import { NewPostForm } from '@/components/community/new-post-form';
import { PostCard } from '@/components/community/post-card';

const initialPosts = [
    {
        id: '1',
        author: 'Ram Kumar',
        avatar: 'https://picsum.photos/seed/user2/40/40',
        timestamp: '2 hours ago',
        content: "My wheat crop is showing signs of yellowing leaves. I've already applied urea, but it's not helping. Any suggestions for what might be the cause? Could it be a nutrient deficiency other than nitrogen?",
        likes: 12,
        commentsCount: 3,
    },
    {
        id: '2',
        author: 'Sita Devi',
        avatar: 'https://picsum.photos/seed/user3/40/40',
        timestamp: '1 day ago',
        content: "Has anyone tried the new drought-resistant maize variety (Pioneer P3501)? I'm thinking of planting it this season in the Vidarbha region. Looking for feedback on its yield and water requirements.",
        likes: 25,
        commentsCount: 8,
    },
    {
        id: '3',
        author: 'Vijay Singh',
        avatar: 'https://picsum.photos/seed/user4/40/40',
        timestamp: '3 days ago',
        content: "Sharing a success story! I used the AI recommendation for drip irrigation scheduling, and it's saved me almost 30% on my water usage for my tomato crop without affecting the yield. Highly recommend trusting the AI!",
        likes: 42,
        commentsCount: 11,
    }
];

export default function CommunityForumPage() {
    const { t } = useTranslation();
    const [posts, setPosts] = useState(initialPosts);

    const handleAddPost = (content: string) => {
        const newPost = {
            id: `${Date.now()}`,
            author: 'Farmer', // Assuming the current user
            avatar: 'https://picsum.photos/seed/user1/40/40',
            timestamp: 'Just now',
            content,
            likes: 0,
            commentsCount: 0,
        };
        setPosts([newPost, ...posts]);
    };

    const handleLikePost = (postId: string) => {
        setPosts(posts.map(post => 
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
        ));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <NewPostForm onAddPost={handleAddPost} />

            <div className="space-y-4">
                {posts.map(post => (
                    <PostCard 
                        key={post.id} 
                        post={post}
                        onLike={() => handleLikePost(post.id)}
                    />
                ))}
            </div>
        </div>
    );
}
