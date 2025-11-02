import { useNavigate } from 'react-router-dom';
import { Download, ChevronRight, MapPin, Phone, Mail, Shield, Award, Zap } from 'lucide-react';
import Logo from '../../../assets/logo.png';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-br from-[#0d1218] via-[#161f2b] to-[#0d1218] text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#0097A7] rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#0097A7] rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="relative max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Brand section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={Logo}
                  alt="Gamage Recruiters Logo"
                  className="w-14 h-14 object-contain rounded-lg bg-white/5 p-2 backdrop-blur-sm border border-white/10"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#0097A7] rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#0097A7] to-teal-300 bg-clip-text text-transparent">
                  Gamage Recruiters
                </h3>
                <p className="text-sm text-gray-400">(PVT) LTD.</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 xs:line-clamp-none">
              Simplifying your workforce with efficient <br /> employee management solutions.
            </p>
            
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#0097A7]" />
              <span className="text-xs text-gray-400">Certified HR Solutions</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold text-[#0097A7] mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0097A7] animate-pulse"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Services', path: '/services' },
                { name: 'Careers', path: '/careers' },
                { name: 'Contact', path: '/contact' }
              ].map((item, index) => (
                <li key={index}>
                  <button 
                    onClick={() => navigate(item.path)} 
                    className="group flex items-center gap-2 text-gray-300 hover:text-[#0097A7] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    <span className="text-sm">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-[#0097A7] mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0097A7] animate-pulse"></span>
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#0097A7] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Panadura, Western Province</p>
                  <p className="text-gray-400 text-xs">Sri Lanka</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#0097A7] flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">+94 71 479 5371</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#0097A7] flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">hr.gamagecareer@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* App Download */}
          <div>
            <h3 className="text-lg font-semibold text-[#0097A7] mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0097A7] animate-pulse"></span>
              Mobile App
            </h3>
            
            <div className="bg-gradient-to-br from-white/5 to-white/10 p-5 rounded-xl border border-white/10 backdrop-blur-sm">
              <p className="text-gray-300 text-sm mb-4">
                Get our mobile app for <br />
                seamless workforce management.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0097A7] to-teal-400 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-[#0097A7]/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download App</span>
                </a>
                
                <a href="#" className="inline-block">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Google Play"
                    className="h-10 hover:opacity-90 transition-opacity"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* Bottom section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span>© {new Date().getFullYear()} Gamage Recruiters (PVT) LTD</span>
            <span className="hidden md:block">•</span>
            <a href="#" className="hover:text-[#0097A7] transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-[#0097A7] transition-colors">Terms of Service</a>
          </div>
          
          <div className="flex items-center justify-end gap-2 text-sm text-gray-400">
            <Zap className="w-4 h-4 text-[#0097A7]" />
            <span>Powered by Gamage IT Solutions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;