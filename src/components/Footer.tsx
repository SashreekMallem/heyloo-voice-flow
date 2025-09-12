import { Mic2, Twitter, Linkedin, Github, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-background-secondary border-t border-border/20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent-gradient flex items-center justify-center">
                <Mic2 className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
                Heyloo AI
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Transform your business with intelligent voice agents. Deploy 24/7 AI-powered customer service that scales with your growth.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-electric-blue/20 hover:text-electric-blue transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-electric-blue/20 hover:text-electric-blue transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-electric-blue/20 hover:text-electric-blue transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-electric-blue/20 hover:text-electric-blue transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-electric-blue transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-electric-blue transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-electric-blue transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-electric-blue transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-electric-blue transition-colors">Security</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-electric-blue transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-electric-blue transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-electric-blue transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-electric-blue transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-electric-blue transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Heyloo AI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-electric-blue text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-electric-blue text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-muted-foreground hover:text-electric-blue text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};