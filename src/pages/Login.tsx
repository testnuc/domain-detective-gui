import AuthComponent from '@/components/Auth';

const Login = () => {
  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-br from-[#9b87f5] via-[#8778c7] to-[#7E69AB]">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Domain Detective</h1>
          <p className="text-white/80 mt-2">Sign in to start hunting domains</p>
        </div>
        <AuthComponent />
      </div>
    </div>
  );
};

export default Login;