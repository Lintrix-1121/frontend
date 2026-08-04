export default function TopBar() {
  return (
    <div className="bg-light border-bottom small">
      <div className="container py-2">
        <div className="row align-items-center gy-2">

          {/* Contact */}
          <div className="col-12 col-lg-8">
            <div className="d-flex flex-column flex-sm-row flex-wrap justify-content-center justify-content-lg-start align-items-center gap-2 gap-sm-3">

              <a
                href="mailto:synerphixtechnologies@gmail.com"
                className="text-decoration-none text-break"
              >
                <i className="bi bi-envelope me-1"></i>
                synerphixtechnologies@gmail.com
              </a>

              <a
                href="tel:+256708849489"
                className="text-decoration-none"
              >
                <i className="bi bi-telephone me-1"></i>
                +256 708 849 489
              </a>

              <a
                href="tel:+256786687764"
                className="text-decoration-none"
              >
                <i className="bi bi-telephone me-1"></i>
                +256 786 687 764
              </a>

            </div>
          </div>

          {/* Social */}
          <div className="col-12 col-lg-4">
            <div className="d-flex justify-content-center justify-content-lg-end align-items-center gap-3">

              <a
                href="https://wa.me/256786687764"
                target="_blank"
                rel="noopener noreferrer"
                className="text-success"
              >
                <i className="bi bi-whatsapp fs-5"></i>
              </a>

              <a
                href="https://www.tiktok.com/@synerphix"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark"
              >
                <i className="bi bi-tiktok fs-5"></i>
              </a>

              <a
                href="https://www.facebook.com/natgasuganda"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                <i className="bi bi-facebook fs-5"></i>
              </a>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}