import AuthLeft from "../../../components/auth/auth-left/AuthLeft";
import AuthRight from "../../../components/auth/auth-right/AuthRight";
import AuthFooter from "../../../components/auth/AuthFooter";

const LoginPage = () => {
  return (
    <div className="auth-page-wrapper d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-9 col-lg-10 col-md-11">
            <div className="auth-card auth-wrapper d-flex overflow-hidden border-0">
              <AuthLeft />
              <AuthRight />
            </div>
          </div>
        </div>
      </div>

      <AuthFooter />
    </div>
  );
};

export default LoginPage;
