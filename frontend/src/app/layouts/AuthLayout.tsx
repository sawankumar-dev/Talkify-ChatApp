import { Outlet } from "react-router"

const AuthLayout = () => {
  return (
    // Pure auth section ko full screen, centralized aur professional dark background dene ke liye wrapper
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 p-4 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Dynamic Background Blurs - Pure auth section ka premium look maintain karne ke liye */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse pointer-events-none" />

      {/* Main Container jo login/register cards ko support karega */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Top Branding / Logo section (Optional but looks highly professional) */}
        <div className="flex flex-col items-center justify-center mb-8 space-y-2">
          <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            {/* Chat Icon SVG */}
            <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-wider text-white">Talkify</span>
        </div>

        {/* Yahan aapke child routes (Login / Register) dynamic target lekar render honge */}
        <Outlet />

      </div>
    </div>
  )
}

export default AuthLayout