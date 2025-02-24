import registerFormSchema from "@/lib/validation/register-form-schema"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/custom/spinner"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { CustomGoogleLogin, CustomGoogleLoginProps } from "@/components/custom/google-login-button"
import { Link } from "react-router-dom"
import { EnvVariable } from "@/configuration/env-variable"

export type  RegisterFormProps = {
    form: UseFormReturn<z.infer<typeof registerFormSchema>, unknown, undefined >,
    onSubmit: (values: z.infer<typeof registerFormSchema>) => void,
    isLoading: boolean,
} & CustomGoogleLoginProps;

const RegisterForm = (props: RegisterFormProps) => {
    const { form, onSubmit, isLoading, onGoogleAuthSuccess, onGoogleAuthError } = props;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={`relative max-w-[450px] w-full rounded-xl px-8 py-4 border-secondary border shadow-xl ${isLoading ? 'pointer-events-none' : ''}`}>
            <p className="text-3xl font-semibold mb-4">Create an account</p>
            <Spinner className="absolute inset-1/2" isOpening={isLoading} />
            <div className={`${isLoading ? 'invisible' : ''}`}>
                <div>
                    <div className="w-full flex justify-center">
                        <GoogleOAuthProvider clientId={EnvVariable.GOOGLE_OAUTH_CLIENT_ID}>
                            <CustomGoogleLogin onGoogleAuthSuccess={onGoogleAuthSuccess} onGoogleAuthError={onGoogleAuthError} />
                        </GoogleOAuthProvider>
                    </div>
                </div>
                <div className="flex items-center my-4">
                    <hr className="flex-grow border-t border-white" />
                    <p className="px-4">OR CONTINUE WITH</p>
                    <hr className="flex-grow border-t border-white" />
                </div>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fullname</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter your fullname" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter your email" {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter your password" {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                    <FormItem className="mb-4">
                        <FormLabel>Confirm your password</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter your password again!" {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Link className=" text-blue-500 hover:underline mt-8" to={'/login'}>Already have an account?</Link>
                <Button type="submit" className="mt-6 w-full" disabled={Object.keys(form.formState.errors).length > 0}>Create account</Button>
            </div>
            </form>
        </Form>
    )
};

export default RegisterForm;