import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "firebase/auth";

export function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                // If no user is signed in, redirect to login
                navigate('/login');
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Avatar className="w-24 h-24">
                            <AvatarImage src={user?.photoURL ?? undefined} />
                            <AvatarFallback className="text-4xl">
                                {user?.displayName?.charAt(0) ?? user?.email?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <CardTitle className="text-2xl">{user?.displayName ?? 'Welcome!'}</CardTitle>
                    <CardDescription>{user?.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* You can add more profile details or settings here in the future */}
                    <Button onClick={handleLogout} className="w-full" variant="destructive">
                        Log Out
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
