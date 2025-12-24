import { NotepadText, Code, Drill, LaptopMinimal, Cpu /* add more icons */ } from 'lucide-react';

// Tag configuration dictionary
const TAG_CONFIG = {
  // Programming Languages (Braces icon)
  'Java': {
    icon: Code,
    bgColor: 'bg-red-600/20',
    textColor: 'text-red-400',
    borderColor: 'border-red-600/30'
  },
  'C++': {
    icon: Code,
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-300',
    borderColor: 'border-purple-500/30'
  },
  'Python': {
    icon: Code,
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-300',
    borderColor: 'border-green-500/30'
  },
  
  // Engineering Skills (Laptop icon)
  'CAD': {
    icon: NotepadText,
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-300',
    borderColor: 'border-blue-500/30'
  },
  'CAM': {
    icon: NotepadText,
    bgColor: 'bg-cyan-500/20',
    textColor: 'text-cyan-300',
    borderColor: 'border-cyan-500/30'
  },
  'Circuit Analysis': {
    icon: NotepadText,
    bgColor: 'bg-yellow-500/20',
    textColor: 'text-yellow-300',
    borderColor: 'border-yellow-500/30'
  },
  'PCB Design': {
    icon: NotepadText,
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-300',
    borderColor: 'border-orange-500/30'
  },
  
  // Software Tools (Database icon)
  'Fusion 360': {
    icon: LaptopMinimal,
    bgColor: 'bg-indigo-500/20',
    textColor: 'text-indigo-300',
    borderColor: 'border-indigo-500/30'
  },
  'KiCAD': {
    icon: LaptopMinimal,
    bgColor: 'bg-rose-500/20',
    textColor: 'text-rose-300',
    borderColor: 'border-rose-500/30'
  },
  'VS Code': {
    icon: LaptopMinimal,
    bgColor: 'bg-sky-500/20',
    textColor: 'text-sky-300',
    borderColor: 'border-sky-500/30'
  },
  'Github': {
    icon: LaptopMinimal,
    bgColor: 'bg-slate-500/20',
    textColor: 'text-slate-300',
    borderColor: 'border-slate-500/30'
  },
  
  // Manufacturing/Hands-on (Wrench icon)
  'Soldering': {
    icon: Drill,
    bgColor: 'bg-amber-500/20',
    textColor: 'text-amber-300',
    borderColor: 'border-amber-500/30'
  },
  '3D Printing': {
    icon: Drill,
    bgColor: 'bg-emerald-500/20',
    textColor: 'text-emerald-300',
    borderColor: 'border-emerald-500/30'
  },
  'Laser Cutting': {
    icon: Drill,
    bgColor: 'bg-fuchsia-500/20',
    textColor: 'text-fuchsia-300',
    borderColor: 'border-fuchsia-500/30'
  },
  'CNC Manufacturing': {
    icon: Drill,
    bgColor: 'bg-teal-500/20',
    textColor: 'text-teal-300',
    borderColor: 'border-teal-500/30'
  },
};

// Default styling for unknown tags
const DEFAULT_TAG = {
    icon: Cpu,
    bgColor: 'bg-white/10',
    textColor: 'text-gray-300',
    borderColor: 'border-white/20'
};

// Tag component
export default function Tag({ name }) {
    const config = TAG_CONFIG[name] || DEFAULT_TAG;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
            <Icon size={14} />
            {name}
        </span>
    );
}