import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  AlertTriangle,
  Info,
  Server,
  MessageSquareHeart,
  ExternalLink,
  BookOpen,
  Copy,
  Check,
  HeartHandshake,
  Compass,
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';

interface WelcomeNoticeSectionProps {
  onNavigateToNovels?: () => void;
  onSwitchToLightModeIntro?: () => void;
}

export const WelcomeNoticeSection: React.FC<WelcomeNoticeSectionProps> = ({
  onNavigateToNovels,
  onSwitchToLightModeIntro,
}) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<'warning' | 'operation' | 'comment' | null>(null);

  const handleCopy = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(platform);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const platforms = [
    {
      id: 'wattpad',
      name: 'Wattpad',
      tag: 'Chỉ đăng truyện mới',
      tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      url: 'https://www.wattpad.com/user/Qingxiya52',
      description: 'Cập nhật nhanh các bộ truyện mới nhất cùng hệ sinh thái độc quyền.',
      borderGlow: 'hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]',
      accentColor: 'from-amber-500/20 to-orange-500/10',
      iconColor: 'text-amber-400',
    },
    {
      id: 'wordpress',
      name: 'Wordpress',
      tag: 'Thư viện đầy đủ',
      tagColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      url: 'https://nienthoi003.wordpress.com/',
      description: 'Lưu trữ trọn bộ các tác phẩm đã edit hoàn chỉnh, giao diện đọc tiện lợi.',
      borderGlow: 'hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]',
      accentColor: 'from-cyan-500/20 to-blue-500/10',
      iconColor: 'text-cyan-400',
    },
  ];

  return (
    <section id="welcome-intro" className="relative py-16 sm:py-24 z-10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-gradient-to-tr from-purple-900/15 via-indigo-900/10 to-rose-900/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mode Switcher Pill (Chế độ tối vs Chế độ sáng mới) */}
        {onSwitchToLightModeIntro && (
          <div className="flex justify-center mb-8 sm:mb-10">
            <div className="p-1 rounded-full bg-[#12142B]/90 border border-purple-800/50 flex items-center shadow-lg backdrop-blur-md">
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-900/60 text-purple-200 border border-purple-700/50 shadow-xs flex items-center gap-1.5 cursor-default"
                title="Đang xem ở Chế độ tối (Cosmic Dark)"
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Chế độ tối (Vũ trụ)</span>
              </button>
              <button
                type="button"
                onClick={onSwitchToLightModeIntro}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-100 bg-[#321257] hover:bg-[#3f166d] border border-purple-600/50 shadow-xs hover:shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                title="Chuyển sang trang Giới thiệu Chế độ sáng (Sổ tay nhật ký)"
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Chế độ sáng (Sổ tay)</span>
              </button>
            </div>
          </div>
        )}

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-tektur font-bold text-white tracking-tight leading-tight"
          >
            Chào mừng bạn đến với{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
              trang web của mình
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium"
          >
            Website được xây nhằm mục đích đăng tải những bộ truyện mình đã edit hoàn, phục vụ cho mục đích giải trí phi lợi nhuận.
          </motion.p>
        </div>

        {/* Timeline Stream: CẢNH BÁO NỘI DUNG, Lưu Ý Vận Hành, Không Gian Giao Lưu */}
        <div className="relative max-w-5xl mx-auto mb-16 sm:mb-20">
          {/* Vertical Glowing Timeline Line */}
          <div className="absolute top-4 bottom-4 left-4 sm:left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-rose-500 via-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]" />

          <div className="space-y-12 sm:space-y-16">
            {/* ITEM 1: CẢNH BÁO NỘI DUNG (18+) */}
            <div className="relative flex flex-col sm:flex-row items-start sm:flex-row-reverse gap-6 sm:gap-12">
              {/* Center Node Orbit */}
              <div 
                className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#0E0610] border-2 border-rose-500 shadow-[0_0_18px_#F43F5E] flex items-center justify-center z-20"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>

              {/* Empty Spacer on opposite side for desktop */}
              <div className="hidden sm:block sm:w-1/2" />

              {/* Content Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.015, y: -2 }}
                onMouseEnter={() => setHoveredCard('warning')}
                onMouseLeave={() => setHoveredCard(null)}
                className="w-full sm:w-1/2 pl-12 sm:pl-0"
              >
                <div 
                  className={`rounded-2xl bg-gradient-to-br from-rose-950/40 via-red-950/20 to-slate-900/60 border p-6 sm:p-7 backdrop-blur-xl relative overflow-hidden group transition-all duration-300 ${
                    hoveredCard === 'warning'
                      ? 'border-rose-400/90 shadow-[0_0_35px_rgba(244,63,94,0.4)] bg-rose-950/45'
                      : 'border-rose-600/40 hover:border-rose-500/70 shadow-[0_0_35px_rgba(244,63,94,0.15)]'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl -z-10" />

                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-rose-900/60 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                      <AlertTriangle className="w-5 h-5" />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-base sm:text-lg font-bold font-tektur tracking-wide text-white">
                          CẢNH BÁO NỘI DUNG
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-600/30 text-rose-300 border border-rose-500/40 tracking-wider uppercase">
                          18+ Mature Warning
                        </span>
                      </div>

                      <p className="text-slate-200 leading-relaxed text-xs sm:text-sm font-normal">
                        Trang web chứa các tác phẩm thuộc thể loại đam mỹ có yếu tố 18+. Các chương truyện mô tả chi tiết các cảnh nhạy cảm, ngôn từ thô tục. Tất cả tình tiết chỉ phục vụ mục đích giải trí, hoàn toàn là hư cấu và không phản ánh tiêu chuẩn đạo đức xã hội thực tế.
                      </p>

                      <div className="pt-1 flex items-center gap-2 text-rose-300/90 text-xs font-semibold italic bg-rose-950/30 px-3 py-1.5 rounded-xl border border-rose-800/30">
                        <Info className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                        <span>Nếu bạn cảm thấy không thoải mái với thể loại này, xin vui lòng rời khỏi.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ITEM 2: LƯU Ý VẬN HÀNH (Hạ tầng máy chủ phi thương mại) */}
            <div className="relative flex flex-col sm:flex-row items-start gap-6 sm:gap-12">
              {/* Center Node Orbit */}
              <div 
                className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#07091B] border-2 border-indigo-400 shadow-[0_0_18px_#818CF8] flex items-center justify-center z-20"
              >
                <Server className="w-4 h-4 text-indigo-300" />
              </div>

              {/* Empty Spacer on opposite side for desktop */}
              <div className="hidden sm:block sm:w-1/2" />

              {/* Content Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.015, y: -2 }}
                onMouseEnter={() => setHoveredCard('operation')}
                onMouseLeave={() => setHoveredCard(null)}
                className="w-full sm:w-1/2 pl-12 sm:pl-0"
              >
                <div 
                  className={`rounded-2xl bg-gradient-to-br from-[#0E1128]/90 via-[#0A0D20]/90 to-[#121634]/90 border p-6 sm:p-7 backdrop-blur-xl flex flex-col justify-between group transition-all duration-300 ${
                    hoveredCard === 'operation'
                      ? 'border-indigo-400/90 shadow-[0_0_35px_rgba(99,102,241,0.4)] bg-[#141535]/95'
                      : 'border-indigo-500/30 hover:border-indigo-400/60 shadow-xl'
                  }`}
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-950/70 border border-indigo-700/50 flex items-center justify-center text-indigo-400 shrink-0 shadow-md">
                        <Server className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-mono uppercase tracking-widest text-indigo-400">Lưu Ý Vận Hành</div>
                        <h4 className="text-base sm:text-lg font-bold text-white font-tektur">Hạ Tầng Máy Chủ Phi Thương Mại</h4>
                      </div>
                    </div>

                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                      Trang web được vận hành và duy trì hoàn toàn bằng hạ tầng máy chủ miễn phí nhằm mục đích phi thương mại. Do đó, hệ thống sẽ có một số giới hạn kỹ thuật nhất định: <strong className="text-indigo-200 font-semibold">Đôi khi có thể bị chậm hoặc tạm dừng</strong>. Nếu không vào được web, các bạn có thể ghé qua các link nền tảng phía trên để tiếp tục đọc truyện không bị gián đoạn.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ITEM 3: KHÔNG GIAN GIAO LƯU (Bình luận tự do & Văn minh) */}
            <div className="relative flex flex-col sm:flex-row items-start sm:flex-row-reverse gap-6 sm:gap-12">
              {/* Center Node Orbit */}
              <div 
                className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#0F0A1E] border-2 border-purple-400 shadow-[0_0_18px_#C084FC] flex items-center justify-center z-20"
              >
                <MessageSquareHeart className="w-4 h-4 text-purple-300" />
              </div>

              {/* Empty Spacer on opposite side for desktop */}
              <div className="hidden sm:block sm:w-1/2" />

              {/* Content Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.015, y: -2 }}
                onMouseEnter={() => setHoveredCard('comment')}
                onMouseLeave={() => setHoveredCard(null)}
                className="w-full sm:w-1/2 pl-12 sm:pl-0"
              >
                <div 
                  className={`rounded-2xl bg-gradient-to-br from-[#0E1128]/90 via-[#0A0D20]/90 to-[#121634]/90 border p-6 sm:p-7 backdrop-blur-xl flex flex-col justify-between group transition-all duration-300 ${
                    hoveredCard === 'comment'
                      ? 'border-purple-400/90 shadow-[0_0_35px_rgba(168,85,247,0.4)] bg-[#151230]/95'
                      : 'border-purple-500/30 hover:border-purple-400/60 shadow-xl'
                  }`}
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-purple-700/50 flex items-center justify-center text-purple-400 shrink-0 shadow-md">
                        <MessageSquareHeart className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-mono uppercase tracking-widest text-purple-400">Không Gian Giao Lưu</div>
                        <h4 className="text-base sm:text-lg font-bold text-white font-tektur">Bình Luận Tự Do & Văn Minh</h4>
                      </div>
                    </div>

                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                      Web mở cổng bình luận tự do (không cần đăng nhập) để các bạn thoải mái chia sẻ cảm xúc và thảo luận về tình tiết truyện. Tuy nhiên, để giữ gìn một không gian văn minh, xin vui lòng tuân thủ: <strong className="text-purple-200 font-semibold">Tôn trọng nhân vật/người đăng truyện:</strong> Không buông lời xúc phạm cực đoan đối với nhân vật, tác giả hay editor.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Alternative Platforms Section: Xem truyện tại các nền tảng khác */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="mb-10 rounded-2xl bg-[#090C1E]/80 border border-slate-800/80 p-6 sm:p-8 backdrop-blur-xl"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-purple-400 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Kênh Đọc Truyện Dự Phòng</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-tektur text-white">
                Xem truyện tại các nền tảng khác
              </h3>
            </div>

            {onNavigateToNovels && (
              <button
                onClick={() => {
                  onNavigateToNovels();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Đọc Trên Web Này</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {platforms.map((p) => (
              <div
                key={p.id}
                className={`rounded-xl bg-gradient-to-br ${p.accentColor} via-slate-900/40 to-slate-900/90 border border-slate-700/60 p-5 transition-all duration-300 flex flex-col justify-between ${p.borderGlow}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold font-tektur text-white ${p.iconColor}`}>
                        {p.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${p.tagColor}`}>
                        {p.tag}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-700/40 flex items-center justify-between text-xs font-mono text-slate-400 break-all select-all">
                    <span className="truncate mr-2 text-slate-300">{p.url}</span>
                    <button
                      onClick={() => handleCopy(p.url, p.id)}
                      className="text-slate-400 hover:text-white p-1 rounded transition-colors shrink-0 cursor-pointer"
                      title="Sao chép liên kết"
                    >
                      {copiedLink === p.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 flex items-center gap-3">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs tracking-wide transition-all shadow-sm cursor-pointer"
                  >
                    <span>Mở {p.name}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Warm Closing Farewell Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center py-6 px-4 rounded-2xl bg-gradient-to-r from-purple-950/30 via-pink-950/20 to-indigo-950/30 border border-purple-800/30 backdrop-blur-md"
        >
          <div className="inline-flex items-center gap-2 text-base sm:text-lg font-tektur font-bold bg-gradient-to-r from-pink-300 via-purple-200 to-amber-200 bg-clip-text text-transparent">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Chúc các bạn có những giây phút thư giãn!</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
        </motion.div>

      </div>
    </section>
  );
};
