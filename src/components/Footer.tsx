import { Twitter, Linkedin, Facebook } from "lucide-react";
import logoImage from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
          {/* Logo and copyright */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src={logoImage} 
                alt="NayandeepGPT" 
                className="h-8 w-auto"
              />
            </div>
            <p className="text-background/70 text-sm max-w-xs">
              Your intelligent AI assistant for chat, research, creation, and coding.
            </p>
            <p className="text-background/70 text-sm">
              © 2024 NayandeepGPT. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-background mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><a href="#features" className="hover:text-background transition-colors">Features</a></li>
                <li><a href="/pricing" className="hover:text-background transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-background transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-background mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><a href="#" className="hover:text-background transition-colors">About</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-background mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><a href="#" className="hover:text-background transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          {/* Social links */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-semibold text-background text-sm">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;