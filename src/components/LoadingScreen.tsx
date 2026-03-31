interface LoadingScreenProps {
  visible: boolean;
}

const LoadingScreen = ({ visible }: LoadingScreenProps) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#f8f4ea] flex items-center justify-center">
      <div className="relative w-[320px] text-center">
        <div className="absolute -top-24 -left-16 w-40 h-40 rounded-full bg-primary-200/60 blur-3xl animate-float-soft" />
        <div className="absolute -bottom-16 -right-12 w-40 h-40 rounded-full bg-accent-200/60 blur-3xl animate-float-soft" />

        <div className="relative bg-white/80 backdrop-blur-sm border border-[#e7dbc4] rounded-3xl p-8 shadow-card-hover">
          <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center font-display text-2xl">
            F
          </div>
          <p className="font-display text-xl text-slate-900">FarmHith</p>
          <p className="text-sm text-slate-600 mt-1">Preparing your farm dashboard...</p>

          <div className="mt-6 h-2 w-full bg-[#efe5d3] rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-primary-500 to-accent-500 animate-pulse-slow" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

