import { Suspense } from "react";
import ResetPasswordComponent from "@/components/resetPassword";
import Loading from "@/components/Loading";

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPasswordComponent />
    </Suspense>
  );
};

export default ResetPasswordPage;
