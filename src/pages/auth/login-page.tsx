import authBgImage from '../../assets/auth-background.svg';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLoginMutation, useLazySendResetPasswordQuery, useLoginMutation} from "@/app/api/auth/auth-api-slice";
import { LoginReq } from "@/app/api/types/auth.type";
import { getErrorResponseData } from "@/lib/helpers/get-error-response-data";
import { useToast } from "@/hooks/use-toast";
import { MouseEvent, MouseEventHandler, useEffect, useState } from "react";
import { TokenResponse } from "@react-oauth/google";
import LoginForm from "./login-form";
import loginFormSchema from '@/lib/validation/login-form-schema';
import { useDispatch } from 'react-redux';
import { useLazyGetAuthenticationQuery } from '@/app/api/user/user.api.slice';
import { setAuthenticatedUser } from '@/app/api/auth/auth-slice';
import { useRedirectToHomePage } from '@/hooks/use-redirect-to-hompage';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import Logo from '@/components/custom/logo';

const LoginPage = () => {

    const [loginUser,  {isLoading, isSuccess, isError, error, data}] = useLoginMutation();
    const [openForgotPwDialog, setOpenForgotPwDialog] = useState(false);
    const [forgotPwEmail, setForgotPwEmail] = useState('');
    const [forgotPwEmailErr, setForgotPwEmailErr] = useState('');

    const { toast } = useToast();

    const [ googleLoginMutation, { isLoading: isGgLoading, isSuccess: isGgSuccess, data: ggData } ] = useGoogleLoginMutation();

    const [ getAuth, { isSuccess : isAuthSuccess, data : authData }] = useLazyGetAuthenticationQuery();
    const [sendResetPassword, {isSuccess: isSendResetPwSuccess}] = useLazySendResetPasswordQuery();

    useRedirectToHomePage();

    const dispatch = useDispatch();

    const onGoogleAuthSuccess = (tokenRes: Omit<TokenResponse, "error" | "error_description" | "error_uri">) => {
        googleLoginMutation({token: tokenRes.access_token});
    }

    const onGoogleAuthError = () => {
        console.log("Login failed");
    }

    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            password: '',
            email: ''
        }
    });


    const onSubmit = async (values: z.infer<typeof loginFormSchema>
    ) => {
        await loginUser(values as LoginReq);
    };

    const onForgotPasswordClick: MouseEventHandler = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      setOpenForgotPwDialog(true);
    };

    useEffect(() => {
        if(isSuccess || isGgSuccess) {
            const tokens = (data?.data || ggData?.data)!;
            localStorage.setItem('access_token', tokens.accessToken);
            localStorage.setItem('refresh_token', tokens.refreshToken);

            getAuth();
        }
    }, [isSuccess, isGgSuccess]);

    useEffect(() => {
        if(isError) {
            const errorData = getErrorResponseData(error);
            if(!errorData) {
                return;
            }

            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: errorData.message,
                duration: 2000
            })
        }
    }, [isError]);

    useEffect(() => {
      if(isAuthSuccess) {
          dispatch(setAuthenticatedUser(authData.data!));
      }
    }, [isAuthSuccess, authData]);

    useEffect(() => {
      if(!isSendResetPwSuccess) {
        return;
      }
      setOpenForgotPwDialog(false);
      toast({
        title: 'Success',
        description: '✅✅✅Send email success, please check your email💌💌💌',
      });
    }, [isSendResetPwSuccess]);
    
    const onResetPasswordClick = () => {
      setForgotPwEmailErr('');
      if(forgotPwEmail.trim().length == 0 || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(forgotPwEmail)) {
        setForgotPwEmailErr('Email is required');
        return;
      }
      sendResetPassword({email: forgotPwEmail});
    }

    return (
        <div className="flex w-full justify-center h-full min-h-screen items-center gap-10">
            <Helmet>
              <title>Login</title>
            </Helmet>
            <div className="max-w-[480px] w-full flex justify-center flex-col items-center max-md:hidden">
                <Logo className='text-5xl hover:scale-125 mb-4'/>
                <img src={authBgImage}/>
            </div>
            <LoginForm 
                form={form} 
                onSubmit={onSubmit}
                isLoading={isLoading || isGgLoading}
                onGoogleAuthError={onGoogleAuthError}
                onGoogleAuthSuccess={onGoogleAuthSuccess}
                onForgotPasswordClick={onForgotPasswordClick}
            />
            
            <Dialog open={openForgotPwDialog} onOpenChange={setOpenForgotPwDialog}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Forgot password</DialogTitle>
                    <DialogDescription>
                      Please enter your account email to receive a edit password mail from us.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Email
                      </Label>
                      <Input id="name" value={forgotPwEmail}className="col-span-3" type='email' onChange={(e) => {setForgotPwEmail(e.target.value)}} />
                      <div className='col-span-1'></div>
                      <span className='text-sm text-red-500 col-span-3'>{forgotPwEmailErr}</span>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={onResetPasswordClick}>Send email</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
        </div>
    )
};

export default LoginPage;