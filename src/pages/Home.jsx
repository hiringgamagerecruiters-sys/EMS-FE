import { BriefcaseBusiness, Users, LineChart, ShieldCheck, ArrowRight, ChevronRight, Zap, BarChart2, Clock, Globe, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../components/ui/footer/footer";
import { Link } from "react-router-dom";

const Home = () => {

  const features = [
    {
      icon: <Users className="h-10 w-10 text-[#0097A7]" />,
      title: "Employee Directory",
      description: "Search, view and manage all employee profiles with advanced filters."
    },
    {
      icon: <BriefcaseBusiness className="h-10 w-10 text-[#0097A7]" />,
      title: "Department Management",
      description: "Organize departments and assign roles with external functions."
    },
    {
      icon: <LineChart className="h-10 w-10 text-[#0097A7]" />,
      title: "Performance Insights",
      description: "Track KPIs with health zone-based access controls."
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-[#0097A7]" />,
      title: "Secure Access",
      description: "Enterprise-grade security with audit logging."
    }
  ];

  const stats = [
    { value: "95%", label: "User Satisfaction" },
    { value: "1K+", label: "Employees Managed" },
    { value: "24/7", label: "Employee Monitoring" },
    { value: "99.9%", label: "Uptime Guarantee" }
  ];

  return (
    <>
      <main className="bg-[#101820] text-white min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-80 h-80 bg-[#0097A7] rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#0097A7] rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-28 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#0097A7] to-teal-300 bg-clip-text text-transparent mb-6">
                Smart Workforce Solutions
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 text-center px-4 sm:px-0">
                Transform your HR operations with our all-in-one platform that<br className="hidden sm:block" /> 
                combines powerful analytics, seamless management, and enterprise security.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#0097A7] text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-[#0097A7]/30 transition-all flex items-center gap-2"
                >
                  <Link to="/login" className="flex items-center gap-2">
                    Get Started <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Employee Guidelines Section */}
        <section className="py-20 bg-[#101820]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-[#0097A7] mb-4"
              >
                Employee Guidelines & Resources
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg text-gray-300 max-w-3xl mx-auto px-4"
              >
                Essential policies, procedures, and resources to help you succeed in our organization.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Policy Guidelines */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-b from-white/5 to-white/10 p-8 rounded-2xl border border-white/10 hover:border-[#0097A7]/30 transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#0097A7]/10 p-3 rounded-lg">
                    <ShieldCheck className="h-8 w-8 text-[#0097A7]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Company Policies</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-[#0097A7] mt-1 flex-shrink-0" />
                    <span>Code of Conduct & Ethics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-[#0097A7] mt-1 flex-shrink-0" />
                    <span>Attendance & PTO Policies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-[#0097A7] mt-1 flex-shrink-0" />
                    <span>Dress Code Standards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-[#0097A7] mt-1 flex-shrink-0" />
                    <span>Workplace Safety</span>
                  </li>
                </ul>
                <button className="mt-6 text-[#0097A7] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  View All Policies <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>

              {/* Onboarding Resources */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-gradient-to-b from-white/5 to-white/10 p-8 rounded-2xl border border-white/10 hover:border-[#0097A7]/30 transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#0097A7]/10 p-3 rounded-lg">
                    <Users className="h-8 w-8 text-[#0097A7]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Onboarding Resources</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-[#0097A7] mt-1 flex-shrink-0" />
                    <span>New Hire Checklist</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-[#0097A7] mt-1 flex-shrink-0" />
                    <span>Training Materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-[#0097A7] mt-1 flex-shrink-0" />
                    <span>Team Introductions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-[#0097A7] mt-1 flex-shrink-0" />
                    <span>First 90 Days Plan</span>
                  </li>
                </ul>
                <button className="mt-6 text-[#0097A7] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  Access Resources <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>

              {/* Career Development */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-gradient-to-b from-white/5 to-white/10 p-8 rounded-2xl border border-white/10 hover:border-[#0097A7]/30 transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#0097A7]/10 p-3 rounded-lg">
                    <LineChart className="h-8 w-8 text-[#0097A7]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Career Development</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-[#0097A7] mt-1 flex-shrink-0" />
                    <span>Training Programs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-[#0097A7] mt-1 flex-shrink-0" />
                    <span>Promotion Guidelines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-[#0097A7] mt-1 flex-shrink-0" />
                    <span>Mentorship Opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-[#0097A7] mt-1 flex-shrink-0" />
                    <span>Skill Development</span>
                  </li>
                </ul>
                <button className="mt-6 text-[#0097A7] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  Explore Growth Path <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-20 bg-[#101820]">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
            <blockquote className="text-xl md:text-2xl text-gray-300 mb-6 text-center px-4 sm:px-0">
              "With a vision to empower businesses with the best talent,<br className="hidden md:inline" /> 
              Mr. Harshana Gamage brings a wealth of industry expertise to Gamage Recruiters.<br className="hidden md:inline" /> 
              As the Chairman and Director, he drives the strategic direction of the company,<br className="hidden md:inline" /> 
              ensuring growth and innovation at every level."
            </blockquote>
            <div className="text-[#0097A7] font-semibold">Harshana Gamage</div>
            <div className="text-gray-400 text-sm">Chairman & Director</div>
          </div>
        </section>

        {/* Mobile App Section */}
        <section className="py-20 bg-gradient-to-br from-[#0d1218] via-[#161f2b] to-[#0d1218]">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#161f2b] to-[#0d1218] p-8 rounded-3xl border border-white/10 mx-auto"
            >
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-32 h-32 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                  <Smartphone className="h-16 w-16 text-[#0097A7]" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-[#0097A7] mb-3">Get Our Mobile App</h3>
                  <p className="text-gray-300 mb-5 max-w-md mx-auto">
                    Manage your workforce on the go with our powerful mobile application.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="#" className="inline-block">
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                        alt="App Store" 
                        className="h-10 hover:opacity-90 transition-opacity" 
                      />
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
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-[#101820]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-[#0097A7] mb-2">{stat.value}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonial Section */}
        <section className="py-20 bg-gradient-to-br from-[#161f2b] to-[#0d1218]">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
            <blockquote className="text-xl md:text-2xl text-gray-300 mb-6 text-center px-4 sm:px-0">
              "As CEO, Mrs. Jayani Bandara leads Gamage Recruiters with a focus on operational excellence<br className="hidden md:inline" /> 
              and strategic partnerships. She is passionate about creating a high-performance culture<br className="hidden md:inline" /> 
              and advancing recruitment solutions that support client success<br className="hidden md:inline" /> 
              and long-term growth."
            </blockquote>
            <div className="text-[#0097A7] font-semibold">Jayani Bandara</div>
            <div className="text-gray-400 text-sm">Chief Executive Officer</div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;