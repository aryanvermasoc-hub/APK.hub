import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full pt-12 pb-8" style={{ backgroundColor: 'var(--bg)' }}>
      {/* bg-gray-950 matches the ultra-dark look of APK.hub */}
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 tracking-wide">
          READY TO COLLABORATE?
        </h2>

        {/* APK.hub Orange Neon Button */}
        <a 
          href="mailto:aryanvermasoc@email.com" 
          className="block w-full max-w-lg mx-auto py-3 px-6 rounded-full border-2 border-orange-500 text-orange-500 font-bold text-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:text-white hover:border-transparent hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
        >
          GET IN TOUCH
        </a>

        {/* Contact Info */}
        <div className="mt-8 space-y-2 text-gray-400 text-sm md:text-base">
          <p>📧 Email: aryanvermasoc@email.com</p>
          <p>📱 Phone: +91 9798743302</p>
        </div>

        {/* Social Icons (Hover turns Orange) */}
        <div className="flex justify-center items-center gap-6 mt-8">
          <a href="https://github.com/aryanvermasoc-hub" target="_blank" rel="noreferrer" className="text-2xl text-gray-400 transition-all duration-300 hover:text-orange-500 hover:scale-110">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://www.facebook.com/aryanvermaxx" target="_blank" rel="noreferrer" className="text-2xl text-gray-400 transition-all duration-300 hover:text-orange-500 hover:scale-110">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://www.instagram.com/aryan_verma_1_0" target="_blank" rel="noreferrer" className="text-2xl text-gray-400 transition-all duration-300 hover:text-orange-500 hover:scale-110">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noreferrer" className="text-2xl text-gray-400 transition-all duration-300 hover:text-orange-500 hover:scale-110">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="https://wa.me/919798743302" target="_blank" rel="noreferrer" className="text-2xl text-gray-400 transition-all duration-300 hover:text-orange-500 hover:scale-110">
            <i className="fab fa-whatsapp"></i>
          </a>
        </div>

        {/* Divider */}
        <div className="mt-12 mb-8 border-t border-gray-800"></div>

        {/* Merged APK.hub Branding & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xl font-bold text-white tracking-wider" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
            APK<span className="text-orange-500">.hub</span>
          </div>
          
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} APK.hub by Aryan Verma. All rights reserved.
          </p>
        </div>
        
      </div>
    </footer>
  );
}