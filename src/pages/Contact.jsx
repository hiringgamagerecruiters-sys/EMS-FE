import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import img from '../assets/contactUs.jpg';
import Footer from '../components/ui/footer/footer';
import { useState } from 'react';


function Contact() {


   const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("http://localhost:5000/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("Email sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus(" Failed to send email.");
      }
    } catch (err) {
      console.error(err);
      setStatus(" Error sending email.");
    }
  };

  



  return (
    <div className="flex flex-col min-h-screen bg-[#101820] text-white">
      {/* Hero Banner */}
      <section className="relative overflow-hidden h-[50vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: `url(${img})`,
            backgroundBlendMode: 'overlay',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-80 h-80 bg-[#0097A7] rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#0097A7] rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>
          </div>
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#0097A7] to-teal-300 bg-clip-text text-transparent mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl"
          >
            Get in touch with our team for any inquiries or support
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 py-16">
        {/* Inquiry Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0097A7] mb-4">Have Inquiries?</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Send us a message and we will get back to you as soon as possible
          </p>
        </motion.section>

        {/* Contact Form and Info */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-white/5 to-white/10 p-8 rounded-2xl border border-white/10 backdrop-blur-sm"
          >
            <h3 className="text-2xl font-bold text-[#0097A7] mb-8 text-center">Send Us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-300 font-medium mb-2">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-gray-300 font-medium mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-gray-300 font-medium mb-2">Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          placeholder="Type your message..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
          required
        ></textarea>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        className="w-full bg-[#0097A7] text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
      >
        <Send className="w-5 h-5" />
        <span>Submit Message</span>
      </motion.button>

      {status && <p className="text-center mt-4">{status}</p>}
    </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-b from-white/5 to-white/10 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-[#0097A7] mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#0097A7]/10 p-3 rounded-lg flex-shrink-0">
                    <Phone className="h-6 w-6 text-[#0097A7]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">Phone</h4>
                    <p className="text-gray-300">+94 71 479 5371</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#0097A7]/10 p-3 rounded-lg flex-shrink-0">
                    <Mail className="h-6 w-6 text-[#0097A7]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">Email</h4>
                    <p className="text-gray-300">hr.gamagecareer@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#0097A7]/10 p-3 rounded-lg flex-shrink-0">
                    <MapPin className="h-6 w-6 text-[#0097A7]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">Address</h4>
                    <p className="text-gray-300">Panadura, Western Province</p>
                    <p className="text-gray-400 text-sm">Sri Lanka</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-gradient-to-b from-white/5 to-white/10 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-[#0097A7] mb-6">Business Hours</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 5:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span>9:00 AM - 1:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0097A7] mb-8">Our Headquarters</h2>
          <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-white/10">
            <iframe
              title="Company Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.8791227410555!2d-122.08424968469022!3d37.42199977982545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb0b5f2412d19%3A0x5d5f3f3b98fbc799!2sGoogleplex!5e0!3m2!1sen!2sus!4v1629876543210!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.section>
      </div>
      <Footer />
    </div>
    
  );
}

export default Contact;