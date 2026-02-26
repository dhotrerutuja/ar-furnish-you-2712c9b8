import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="ikea-container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <div className="bg-secondary rounded px-3 py-1 inline-block mb-4">
              <span className="text-lg font-black tracking-tighter text-primary">
                VIRTUAL<span className="text-foreground">HOME</span>
              </span>
            </div>
            <p className="text-sm text-primary-foreground/70 mb-4">
              Making beautiful, functional furniture accessible to everyone in India.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="h-8 w-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">Shop</h3>
            <div className="space-y-2">
              {["Sofas & Armchairs", "Beds & Mattresses", "Tables & Desks", "Storage", "Kitchen", "Home Office"].map((item) => (
                <Link key={item} to="/products" className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">Help</h3>
            <div className="space-y-2">
              {["Track Your Order", "Returns & Refunds", "Delivery Information", "FAQs", "Contact Us"].map((item) => (
                <Link key={item} to="/track-order" className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">Contact</h3>
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                123 Furniture Street, MG Road, Bangalore 560001
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                +91 1800-123-4567
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                support@virtualhome.in
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/50">
          <p>© 2026 VirtualHome. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
            <span>Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
