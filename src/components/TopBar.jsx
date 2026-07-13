import { Baseline } from "lucide-react"

export default function TopBar() {
  return (
    <div className="bg-light border-bottom small">
      <div className="container d-flex justify-content-between align-items-center py-1">

        {/* LEFT: CONTACT */}
        <div className="d-flex gap-3 align-items-center">
          <a href="mailto:info@synerphix.com" className="text-decoration-none" >
            info@synerphix.com
          </a>
          {/* <span>|</span> */}
          <a href="tel:+256786687764" className="text-decoration-none">
            +256786687764
          </a>
        </div>

        {/* RIGHT: SOCIAL & WHATSAPP */}
        <div className="d-flex gap-3 align-items-center">

          {/* WhatsApp */}
          <a
            href="https://wa.me/256786687764"
            target="_blank"
            rel="noopener noreferrer"
            className="text-success"
            title="Chat on WhatsApp"
          >
            <i className="bi bi-whatsapp fs-5"></i>
          </a>

          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@synerphix"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark"
            title="Follow us on TikTok"
          >
            <i className="bi bi-tiktok fs-5"></i>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/natgasuganda"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary"
            title="Follow us on Facebook"
          >
            <i className="bi bi-facebook fs-5"></i>
          </a>

        </div>
      </div>
    </div>
  )
}


