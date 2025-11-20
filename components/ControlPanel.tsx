import React from 'react';
import { AttackType } from '../types';
import { Play, Square, Shield, ShieldAlert } from 'lucide-react';

interface ControlPanelProps {
  isActive: boolean;
  onToggleAttack: () => void;
  attackType: AttackType;
  onSetAttackType: (type: AttackType) => void;
  intensity: number;
  onSetIntensity: (val: number) => void;
  mitigationActive: boolean;
  onToggleMitigation: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isActive,
  onToggleAttack,
  attackType,
  onSetAttackType,
  intensity,
  onSetIntensity,
  mitigationActive,
  onToggleMitigation
}) => {
  return (
    <div className="bg-cyber-panel border border-gray-700 rounded-lg p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white font-mono mb-4 border-b border-gray-700 pb-2">ATTACK CONTROLS</h2>
        
        {/* Start/Stop */}
        <button
          onClick={onToggleAttack}
          className={`w-full flex items-center justify-center space-x-2 py-3 rounded-md font-bold transition-colors ${
            isActive 
            ? 'bg-cyber-danger hover:bg-red-600 text-white' 
            : 'bg-cyber-success hover:bg-green-500 text-black'
          }`}
        >
          {isActive ? <Square size={20} /> : <Play size={20} />}
          <span>{isActive ? 'STOP ATTACK' : 'INITIATE SIMULATION'}</span>
        </button>
      </div>

      {/* Attack Type */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400 font-mono">ATTACK VECTOR</label>
        <div className="grid grid-cols-1 gap-2">
          {Object.values(AttackType).map((type) => (
            <button
              key={type}
              onClick={() => onSetAttackType(type)}
              className={`px-3 py-2 rounded border text-left text-sm transition-all font-mono ${
                attackType === type
                ? 'bg-cyber-accent/20 border-cyber-accent text-cyber-accent'
                : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Intensity */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400 font-mono">
          <label>INTENSITY (BOTNET SIZE)</label>
          <span>{intensity}%</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={intensity}
          onChange={(e) => onSetIntensity(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyber-accent"
        />
      </div>

      {/* Mitigation */}
      <div className="pt-4 border-t border-gray-700">
        <button
          onClick={onToggleMitigation}
          className={`w-full flex items-center justify-center space-x-2 py-2 rounded-md font-bold border transition-all ${
            mitigationActive
            ? 'bg-cyber-accent text-black border-cyber-accent shadow-[0_0_15px_rgba(0,240,255,0.5)]'
            : 'bg-transparent text-gray-400 border-gray-600 hover:border-cyber-accent hover:text-cyber-accent'
          }`}
        >
          {mitigationActive ? <Shield size={18} /> : <ShieldAlert size={18} />}
          <span>{mitigationActive ? 'MITIGATION ACTIVE' : 'ACTIVATE FIREWALL'}</span>
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
