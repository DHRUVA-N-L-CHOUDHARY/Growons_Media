import { LoginForm } from "@/components/shared/auth/login-form";
import Footer from "@/components/shared/footer";

export const generateMetadata = () => {
  return {
    title: "Login | GrowonsMedia",
    description: "Login to GrowonsMedia",
  };
};

const LoginPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
       <main className="flex-grow flex items-center justify-center py-10">
        <LoginForm />
       </main> 
       <Footer /> 
    </div>
  );
};

export default LoginPage;
