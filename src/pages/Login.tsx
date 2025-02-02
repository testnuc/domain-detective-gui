import AuthComponent from '@/components/Auth';

const Login = () => {
  return (
    <div className="min-h-screen py-16 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Welcome to Email Hunter</h1>
          <p className="text-white/80 mt-2">Please sign in to continue</p>
        </div>
        <AuthComponent />
      </div>
    </div>
  );
};

export default Login;