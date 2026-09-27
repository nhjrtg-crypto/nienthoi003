import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mail, MapPin, Copy, Check, Github, Linkedin, Twitter, Dribbble, Figma, MessageSquare, Sparkles } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Project Inquiry',
    message: '',
    budget: '$5k - $15k',
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const directEmail = 'alex.morgan.dev@hyperion.io';

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(directEmail).catch(() => {});
    }
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    // Simulate instant dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1200);
  };

  const projectTypes = [
    'Interactive 3D / WebGL',
    'Design System & Tokens',
    'Full-Stack Web App',
    'Creative Direction',
    'Advisory / Mentorship',
  ];

  return (
    <section id="contact" className="relative py-24 sm:py-32 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-800/40 text-purple-300 text-xs font-mono mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>TRANSMISSION TERMINAL</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-tektur font-bold text-white tracking-tight"
          >
            Let's Build Something{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Extraordinary Together
            </span>
          </motion.h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            Have a bold project idea, an ambitious product vision, or want to discuss full-time possibilities? My inbox is always open.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Info & Channels */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Direct Email Card */}
            <div className="p-6 rounded-3xl bg-[#0B0D24]/90 border border-indigo-800/50 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-purple-400 font-semibold uppercase">
                  DIRECT FREQUENCY
                </span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Online
                </span>
              </div>

              <div>
                <div className="text-xs text-slate-400 mb-1">Email Address</div>
                <div className="text-base sm:text-lg font-mono font-bold text-white break-all">
                  {directEmail}
                </div>
              </div>

              <button
                onClick={handleCopyEmail}
                className="w-full py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-indigo-800/40 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Email Address</span>
                  </>
                )}
              </button>
            </div>

            {/* Location & Time */}
            <div className="p-6 rounded-3xl bg-[#0B0D24]/90 border border-indigo-800/50 backdrop-blur-xl shadow-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-950/80 border border-indigo-800/40 flex items-center justify-center text-purple-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Location & Timezone</h4>
                  <p className="text-xs text-slate-400">San Francisco, California (PST / UTC-8)</p>
                </div>
              </div>
            </div>

            {/* Social Grid */}
            <div>
              <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3">
                Digital Presence & Networks
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {[
                  { name: 'GitHub', icon: Github, href: 'https://github.com' },
                  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
                  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
                  { name: 'Dribbble', icon: Dribbble, href: 'https://dribbble.com' },
                  { name: 'Figma', icon: Figma, href: 'https://figma.com' },
                ].map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={idx}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-2xl bg-[#0B0D24]/80 hover:bg-purple-950/50 border border-indigo-900/40 hover:border-purple-500/50 text-slate-400 hover:text-white flex flex-col items-center justify-center gap-1.5 transition-all group"
                      title={s.name}
                    >
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-medium">{s.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Message Terminal Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-3xl bg-[#0A0C22]/90 border border-indigo-800/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-indigo-900/40 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono text-slate-400 ml-2">message.dispatch.sh</span>
                </div>
                <span className="text-xs font-mono text-pink-400">ENCRYPTED</span>
              </div>

              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center mx-auto shadow-lg text-white">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <h3 className="text-2xl font-bold font-tektur text-white">Transmission Received!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Thank you for reaching out. Your message has been beamed directly to Alex Morgan. Expect a response within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitSuccess(false);
                      setFormData({ name: '', email: '', subject: 'Project Inquiry', message: '', budget: '$5k - $15k' });
                    }}
                    className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-indigo-800/40 cursor-pointer"
                  >
                    Send Another Transmission
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        YOUR NAME *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Satoshi Nakamoto"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-indigo-900/60 focus:border-purple-500 focus:outline-hidden text-sm text-white placeholder-slate-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-indigo-900/60 focus:border-purple-500 focus:outline-hidden text-sm text-white placeholder-slate-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Project Interest Chips */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">
                      WHAT ARE WE CRAFTING?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {projectTypes.map((type) => {
                        const isSelected = formData.subject === type;
                        return (
                          <button
                            type="button"
                            key={type}
                            onClick={() => {
                              setFormData({ ...formData, subject: type });
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-purple-600/40 border border-pink-500/80 text-white'
                                : 'bg-slate-900/70 border border-indigo-950 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      PROJECT BRIEF & VISION *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about your product, timeline, key goals, or what makes you excited..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-indigo-900/60 focus:border-purple-500 focus:outline-hidden text-sm text-white placeholder-slate-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full font-semibold text-sm sm:text-base text-white shadow-[0_0_25px_rgba(236,72,153,0.4)] hover:shadow-[0_0_35px_rgba(236,72,153,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #A855F7 0%, #C084FC 30%, #EC4899 100%)',
                    }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Transmitting...
                      </span>
                    ) : (
                      <>
                        <span>Send Transmission</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
