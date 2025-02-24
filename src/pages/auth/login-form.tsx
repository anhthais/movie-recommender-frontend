import { UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/custom/spinner"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { CustomGoogleLogin, CustomGoogleLoginProps } from "@/components/custom/google-login-button"
import loginFormSchema from "@/lib/validation/login-form-schema"
import { Link } from "react-router-dom"
import { MouseEventHandler } from "react"
import { EnvVariable } from "@/configuration/env-variable"

export type  RegisterFormProps = {
    form: UseFormReturn<z.infer<typeof loginFormSchema>, unknown, undefined >,
    onSubmit: (values: z.infer<typeof loginFormSchema>) => void,
    isLoading: boolean,
    onForgotPasswordClick: MouseEventHandler;
} & CustomGoogleLoginProps;

const LoginForm = (props: RegisterFormProps) => {
    const { form, onSubmit, isLoading, onGoogleAuthSuccess, onGoogleAuthError, onForgotPasswordClick } = props;

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`relative max-w-[450px] w-full rounded-xl px-8 py-4 border-secondary border shadow-xl ${
            isLoading ? "pointer-events-none" : ""
          }`}
        >
          <p className="text-3xl font-semibold mb-4">Welcome back!</p>
          <Spinner className="absolute inset-1/2" isOpening={isLoading} />
          <div className={`${isLoading ? "invisible" : ""}`}>
            <div>
              <p>Login with</p>
              <div className="w-full flex justify-center">
                <GoogleOAuthProvider
                  clientId={EnvVariable.GOOGLE_OAUTH_CLIENT_ID}
                >
                  <CustomGoogleLogin
                    onGoogleAuthSuccess={onGoogleAuthSuccess}
                    onGoogleAuthError={onGoogleAuthError}
                  />
                </GoogleOAuthProvider>
              </div>
            </div>
            <div className="flex items-center my-4">
              <hr className="flex-grow border-t border-primary" />
              <p className="px-4">OR CONTINUE WITH</p>
              <hr className="flex-grow border-t border-primary" />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <Link className="text-blue-500 hover:underline" to={"/register"}>
                Register an account?
              </Link>
              <Button
                onClick={onForgotPasswordClick}
                variant="link"
                type="submit"
                className="p-0 m-0 text-blue-500"
              >
                Forgot your password?
              </Button>
            </div>
            <Button
              type="submit"
              className="mt-6 w-full"
              disabled={Object.keys(form.formState.errors).length > 0}
            >
              Login
            </Button>
          </div>
        </form>
      </Form>
    );
};

export default LoginForm;