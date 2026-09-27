import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060713] text-slate-200 flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#0b0e24] border border-indigo-900/60 shadow-2xl text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-900/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-tektur text-white mb-2">
              Đã khôi phục trạng thái ứng dụng
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Hệ thống đã tự động bảo vệ phiên làm việc của bạn. Bạn có thể tiếp tục sử dụng ngay.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Tiếp tục sử dụng
              </button>
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors cursor-pointer"
              >
                Tải lại trang
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
