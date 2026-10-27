import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode, Monitor, Sparkles } from 'lucide-react';
import { generateStandaloneHtml } from '../utils/generateStandaloneHtml';

interface ExportSingleFileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportSingleFileModal: React.FC<ExportSingleFileModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const htmlContent = generateStandaloneHtml();

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lianliankan_game.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">单文件 HTML 交付与导出</h2>
              <p className="text-xs text-slate-400 mt-0.5">完全自包含 · 双击即可在任何现代浏览器中畅玩</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                <Monitor className="w-4 h-4" />
                <span>零依赖单文件</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                无需安装任何环境或运行服务器，单个 .html 文件即可随处运行与分发。
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Web Audio 纯合成音效</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                消除、连击、提示、胜利音效均由原生算法振荡器生成，无需加载外部 mp3。
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                <FileCode className="w-4 h-4" />
                <span>12 关进阶挑战</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                内置 6x6 到 10x10、障碍物阻挡、连击倍率、星级评定与死局自动洗牌。
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-transform active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>下载 lianliankan_game.html</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors active:scale-98"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '已复制到剪贴板！' : '复制完整 HTML 源码'}</span>
            </button>
          </div>

          {/* Code Preview snippet */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>源码预览片段 (共约 500 行，零外部资源依赖):</span>
              <span className="font-mono text-[11px] text-slate-500">text/html</span>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 overflow-x-auto max-h-48 leading-relaxed">
              {htmlContent.slice(0, 1200)}
              {'\n... [完整核心算法与关卡系统已打包] ...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
