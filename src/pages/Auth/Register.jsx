// component register

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../hooks/use-toast";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    if (!checkConfirmPassword()) {
      console.error("Passwords do not match");
      toast({
        title: "Password do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/user/register?email=${email}&password=${password}&name=${name}`
      );

      console.log(response);
      toast({
        title: "Account registered!",
        description: "Login with your account now!",
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.response.data.message,
      });
    }
  };

  const checkConfirmPassword = () => {
    return password === confirm;
  };

  return (
    <div className=" bg-background h-screen w-screen overflow-hidden">
      <div className="flex flex-col w-screen h-screen justify-center items-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Register</CardTitle>
            <CardDescription>
              Enter your email below to register your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                onKeyDown={handleKeyDown}
                id="email"
                type="text"
                placeholder="berakmantap@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                onKeyDown={handleKeyDown}
                id="username"
                type="text"
                placeholder="berakmantap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                onKeyDown={handleKeyDown}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Confirmpassword">Confirm Password</Label>
              <Input
                onKeyDown={handleKeyDown}
                id="Confirmpassword"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="block text-center">
            <Button onClick={handleLogin} className="w-full mb-2">
              Register
            </Button>
            Already have an account?
            <a href="/login" className="underline">
              Login
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
