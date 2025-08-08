import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth } from "@/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup
} from "firebase/auth";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// A simple Google Icon component
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,36.62,44,31.1,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message.replace('Firebase: ', ''));
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email-login">Email</Label>
              <Input id="email-login" type="email" placeholder="m@example.com" required className="bg-gray-50" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-login">Password</Label>
              <Input id="password-login" type="password" placeholder="Enter your password" required className="bg-gray-50" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="flex items-center justify-end text-sm">
              <Link to="#" className="font-medium text-orange-500 hover:text-orange-600">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white text-base py-3 rounded-xl shadow-md hover:shadow-lg transition-all">
              Log In
            </Button>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </form>
    );
};

const SignUpForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!email || !password || !name) {
            setError("Please fill out all fields.");
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Here you would typically also save the user's name to a database like Firestore
            navigate('/');
        } catch (err: any) {
            setError(err.message.replace('Firebase: ', ''));
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSignUp}>
             <div className="space-y-2">
              <Label htmlFor="name-signup">Name</Label>
              <Input id="name-signup" type="text" placeholder="John Doe" required className="bg-gray-50" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-signup">Email</Label>
              <Input id="email-signup" type="email" placeholder="m@example.com" required className="bg-gray-50" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-signup">Password</Label>
              <Input id="password-signup" type="password" placeholder="Create a password" required className="bg-gray-50" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white text-base py-3 rounded-xl shadow-md hover:shadow-lg transition-all">
              Create Account
            </Button>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </form>
    );
};


export function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        setError(null);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate('/');
        } catch (err: any) {
            setError(err.message.replace('Firebase: ', ''));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <motion.div 
                className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl flex overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Left Side: Form */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12">
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login"><LoginForm /></TabsContent>
                        <TabsContent value="signup"><SignUpForm /></TabsContent>
                    </Tabs>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">or</span>
                        </div>
                    </div>
                    
                    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                        <GoogleIcon />
                        <span className="ml-2">Continue with Google</span>
                    </Button>
                    {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                </div>
                
                {/* Right Side: Image */}
                <div className="hidden lg:flex w-1/2 items-center justify-center p-8 bg-gray-100">
                    <motion.img 
                        src="/logos/Logo_1.svg" 
                        alt="I Am Locked Logo" 
                        className="w-3/4 h-3/4 object-contain"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    />
                </div>
            </motion.div>
        </div>
    );
}
