import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import messageSentImage from "@/assets/message-sent.svg";
import { useLazyActivateAccountQuery, useLazySendActivateEmailQuery } from "@/app/api/auth/auth-api-slice";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { useTopBarLoader } from "@/hooks/use-top-loader";
import { logOut } from "@/app/api/auth/auth-slice";
import { delay } from "@/lib/helpers/delay";

export const ActivateAccountPage = () => {
  const dispatch = useDispatch();
  const { complete: completeSideBarLoader } = useTopBarLoader();
  const [ searchParams ] = useSearchParams();
  const token = searchParams.get('token');
  const [ activateAccount, { isSuccess: isActivateSuccess, isError: isActivateError }] = useLazyActivateAccountQuery();
  const [ resendActivateEmail, { isSuccess: isResendSuccess, isError: isResendError }] = useLazySendActivateEmailQuery();

  const onConfirmClick = () => {
    activateAccount({token: token || ''});
  }

  const onResendClick = () => {
    resendActivateEmail({});
  }

  const onLogoutClick = async () => {
    dispatch(logOut());
    await delay(200);
    completeSideBarLoader();
    window.location.assign('/');
  };

  useEffect(() => {
    if(!isActivateError) {
      return;
    }
    
    toast({
      variant: 'destructive',
      title: 'Error ⚠️⚠️⚠️',
      description: 'Something went wrong with your verification!'
    })
  })

  useEffect(() => {
    if(!isActivateSuccess) {
      return;
    }
    
    window.location.href = '/';

    toast({
      variant: 'default',
      title: 'Success ✅✅✅',
      description: 'Your account has been activated! Please login again!'
    });
  }, [isActivateSuccess]);

  useEffect(() => {
    if(!isResendSuccess) {
      return;
    }

    toast({
      variant: 'default',
      title: 'Success ✅✅✅',
      description: 'We have sent you an email to activate your account!'
    });
  }, [isResendSuccess]);

  useEffect(() => {
    if(!isResendError) {
      return;
    }

    toast({
      variant: 'destructive',
      title: 'Error ⚠️⚠️⚠️',
      description: 'Something went wrong with sending email!'
    });
  }, [isResendError]);

  return (
    <div className="w-full min-h-screen">
        {
          !token
          ? (
              <div className="w-full flex flex-col justify-center items-center gap-6 py-12">
                  <img src={messageSentImage} className="max-w-60"/>
                  <div>We sent you an activation account email. Please check your email inbox!</div>
                  <Button className="font-semibold" onClick={onResendClick}>
                      Send new email
                  </Button>
                  <Button className="font-semibold" onClick={onLogoutClick}>
                      Log out
                  </Button>
              </div>
          )
          : (
              <div className="w-full flex flex-col items-center justify-center mt-16">
                  <h3 className="font-semibold text-3xl">TMDB 2</h3>
                  <p className="font-semibold text-2xl">Account Confirmation</p>
                  <p className="my-4">
                  By clicking below button, your account will be activated with registered email.
                  </p>
                  <Button className="bg-red-600 text-white font-semibold hover:bg-red-400" onClick={onConfirmClick}>
                      Confirm your account
                  </Button>
              </div>
          )
        }
    </div>
  );
};