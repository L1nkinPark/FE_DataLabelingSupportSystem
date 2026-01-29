import AuthRightHeader from "./AuthRightHeader";
import AuthLoginForm from "./AuthLoginForm";
import AuthRegisterLink from "./AuthRegisterLink";

const AuthRight = () => {
  return (
    <div className="col-lg-6 auth-right bg-white">
      <div className="p-lg-5 p-4 h-100 d-flex flex-column justify-content-center">
        <div className="text-start">
          <h2 className="fw-bold text-dark mb-1">Chào mừng trở lại!</h2>
          <p className="text-muted">Đăng nhập để tiếp tục với AILABEL</p>
        </div>
        <AuthLoginForm />
        <AuthRegisterLink />
      </div>
    </div>
  );
};

export default AuthRight;
