export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-gray-300">
      <h1 className="text-4xl font-black text-white mb-8">PRIVACY <span className="text-orange-500">POLICY</span></h1>
      <div className="space-y-6 leading-relaxed">
        <p>Last updated: June 2026</p>
        <h2 className="text-2xl font-bold text-white mt-8">1. Information We Collect</h2>
        <p>We collect information you provide directly to us when you register for an account, upload applications, or communicate with us. This may include your email address, username, and uploaded files.</p>
        <h2 className="text-2xl font-bold text-white mt-8">2. How We Use Your Information</h2>
        <p>We use the information we collect to operate and maintain the APK.hub platform, secure your data via Row Level Security, and provide you with developer console analytics.</p>
        <h2 className="text-2xl font-bold text-white mt-8">3. Data Security</h2>
        <p>We implement strict security measures, including Supabase authentication and encrypted storage buckets, to protect your personal information and uploaded applications.</p>
      </div>
    </div>
  );
}