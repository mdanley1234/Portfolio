import { Code, Palette, Wrench, Globe, Database, Cpu, /* add more icons */ } from 'lucide-react';

// Tag configuration dictionary
const TAG_CONFIG = {
  'React': {
    icon: Code,
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-300',
    borderColor: 'border-blue-500/30'
  },
  'TypeScript': {
    icon: Code,
    bgColor: 'bg-blue-600/20',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-600/30'
  },
  'Design': {
    icon: Palette,
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-300',
    borderColor: 'border-purple-500/30'
  },
  'API': {
    icon: Globe,
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-300',
    borderColor: 'border-green-500/30'
  },
  'Database': {
    icon: Database,
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-300',
    borderColor: 'border-orange-500/30'
  },
  // Add more tags as needed
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