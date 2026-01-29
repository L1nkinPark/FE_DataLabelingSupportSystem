import AuthLoginForm from "./AuthLoginForm";
import AuthRegisterLink from "./AuthRegisterLink";
import "../../../assets/css/AuthRight.css";

const AuthRight = () => {
  return (
    <div className="col-lg-6 auth-right bg-white p-0 d-flex flex-column">
      {/* BANNER MOBILE - Chỉ xuất hiện khi màn hình < 992px */}
      <div className="auth-banner-mobile d-lg-none">
        <img
          alt="Banner"
          className="auth-banner-img"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeItZ62kfSUg1zYALne-800k4zTmtIU23M8RgPaZdyr_gp4E4wdis7JpuanRWAca9DRwANX3E0gQ5oblKZDDsjjqgsr05cSOHA34YvcjaKOQwGPqc9XcZ03Or--PAzU_Xh-IWxXMMkcSrQfCUutunKNN81UXhlcTJvcBS9x2uvIBX7TTf_BTfgD1MGd36BZwoKkH1JiTvvkH3sOyj7Gg3MeEHyz2W-6S3-4hU44SgehHv-mwJd7TEdf8admcV88v0FfoITPZmuPgo"
        />

        <div className="auth-banner-overlay">
          <div className="auth-logo-text" style={{ fontSize: "24px" }}>
            VELZON
          </div>
          <div className="auth-title-container">
            <h1 className="auth-main-title">
              Label data with <br />
              <span className="text-precision">precision.</span>
            </h1>
          </div>
        </div>
      </div>

      {/* FORM SECTION - Căn giữa linh hoạt */}
      <div className="auth-form-container flex-grow-1 d-flex flex-column">
        <div className="auth-form-content">
          <div className="text-start mb-3">
            <h2 className="auth-welcome-text">Chào mừng trở lại!</h2>
            <p className="text-muted small fw-medium">
              Đăng nhập để tiếp tục với
              <span className="text-primary">AILABEL</span>
            </p>
          </div>
          <AuthLoginForm />
          <div className="mt-3 text-center text-md-start">
            <AuthRegisterLink />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthRight;
