import { motion } from 'framer-motion';
import { FaSearch, FaFileAlt, FaComments, FaCogs } from "react-icons/fa";
import Footer from "../components/ui/footer/footer";
import RecruitmentImage from "../assets/recruitment-team.jpg";
import Missionimg from "../assets/mission.jpg";
import Vissionimg from "../assets/vision.jpg";
import Ourservice from "../assets/ourservice.jpg";

const services = [
  {
    icon: <FaSearch size={24} />,
    title: "Head Hunting",
    description: "We specialize in identifying and attracting top-tier talent for executive and specialized roles.",
  },
  {
    icon: <FaFileAlt size={24} />,
    title: "Professional Resume Writing",
    description: "Our expert writers create tailored, industry-specific resumes that highlight your strengths.",
  },
  {
    icon: <FaComments size={24} />,
    title: "Interview Preparation",
    description: "Personalized coaching for body language, tone, and negotiation tactics.",
  },
  {
    icon: <FaCogs size={24} />,
    title: "HR Consultancy",
    description: "Strategic HR solutions for talent acquisition and workforce planning.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#101820] text-white">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full h-[280px] sm:h-[320px] md:h-[400px] lg:h-[480px] overflow-hidden">
          <img
            src={RecruitmentImage}
            alt="Recruitment team"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-12 lg:px-24 z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 max-w-2xl"
            >
              Your Trusted Partner In <br />
              <span className="bg-gradient-to-r from-[#0097A7] to-teal-300 bg-clip-text text-transparent">
                Recruitment Solutions
              </span>
            </motion.h1>
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              href="#services"
              className="bg-[#0097A7] hover:bg-[#0097A7]/90 text-white px-6 py-3 rounded-lg text-sm sm:text-base transition-all shadow-lg hover:shadow-[#0097A7]/30"
            >
              Explore Our Services
            </motion.a>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 px-6 sm:px-12 lg:px-24">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-[#0097A7] mb-4"
            >
              Our Services
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-300 max-w-3xl mx-auto text-lg"
            >
              Our comprehensive services tap into a broad spectrum of talent from emerging countries and industries.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-b from-white/5 to-white/10 p-8 rounded-2xl border border-white/10 hover:border-[#0097A7]/30 transition-all group"
              >
                <div className="bg-[#0097A7]/10 p-3 rounded-lg w-fit mb-6 text-[#0097A7]">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA + Image */}
        <section className="py-20 px-6 sm:px-12 lg:px-24 bg-gradient-to-br from-[#0d1218] via-[#161f2b] to-[#0d1218]">
          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                FIND, CONNECT AND BUILD SUCCESS<br />
                WITH <span className="bg-gradient-to-r from-[#0097A7] to-teal-300 bg-clip-text text-transparent">GAMAGE RECRUITERS</span>
              </h2>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#services"
                className="inline-block bg-[#0097A7] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0097A7]/90 hover:shadow-lg hover:shadow-[#0097A7]/30 transition-all"
              >
                Discover Our Services
              </motion.a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <img
                src={Ourservice}
                alt="Recruitment discussion"
                className="rounded-2xl w-full max-w-xl border-2 border-white/10 shadow-xl"
              />
            </motion.div>
          </div>
        </section>

        {/* Our Beliefs */}
        <section className="py-20 px-6 sm:px-12 lg:px-24">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-[#0097A7] mb-4"
            >
              Our Core Beliefs
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-300 max-w-3xl mx-auto text-lg"
            >
              Our mission & vision encapsulate the principles that guide our purpose and direction.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-white/5 to-white/10 rounded-2xl overflow-hidden border border-white/10"
            >
              <img src={Missionimg} alt="Mission" className="h-64 w-full object-cover" />
              <div className="p-8 bg-gradient-to-br from-[#0097A7] to-teal-600">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-100">
                  To bridge the gap between exceptional talent globally and organizational needs through innovative recruitment solutions.
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-white/5 to-white/10 rounded-2xl overflow-hidden border border-white/10"
            >
              <img src={Vissionimg} alt="Vision" className="h-64 w-full object-cover" />
              <div className="p-8 bg-gradient-to-br from-[#006978] to-[#0097A7]">
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-gray-100">
                  To be the most trusted global partner for HR solutions, delivering exceptional service with integrity and innovation.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;