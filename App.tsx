import React, { useState, useEffect, useRef } from 'react';
import { AttackType, ServerStatus } from './types';
import { getEducationalContent, analyzeAttackPattern } from './services/geminiService';
import AttackVisualizer from './components/AttackVisualizer';
import MetricsPanel from './components/MetricsPanel';
import ControlPanel from './components/ControlPanel';
import EducationPanel from './components/EducationPanel';
import { Activity } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [isAttackActive, setIsAttackActive] = useState(false);
  const [attackType, setAttackType] = useState<AttackType>(AttackType.VOLUMETRIC);
  const [intensity, setIntensity] = useState(30);
  const [mitigationActive, setMitigationActive] = useState(false);
  
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    cpuLoad: 5,
    memoryUsage: 10,
    requestsPerSecond: 20,
    isDown: false,
    mitigationActive: false
  });

  const [metricsHistory, setMetricsHistory] = useState<{ time: string; load: number; rps: number }[]>([]);
  
  // AI Content State
  const [eduContent, setEduContent] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("System Nominal.");

  // Refs for simulation loop
  const historyRef = useRef(metricsHistory);
  
  // Initial Load AI Content
  useEffect(() => {
    const fetchContent = async () => {
      setAiLoading(true);
      const content = await getEducationalContent(attackType);
      setEduContent(content);
      setAiLoading(false);
    };
    fetchContent();
  }, [attackType]);

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
        setServerStatus(prev => {
            let targetLoad = 5; // Idle load
            let targetRps = 20; // Idle RPS

            if (isAttackActive) {
                // Calculate Impact
                const attackMultiplier = intensity / 10;
                
                // Mitigation factor reduces impact by 90%
                const mitigationFactor = mitigationActive ? 0.1 : 1.0;
                
                targetRps = 20 + (intensity * 50); // Simulate RPS
                
                // Load calculation varies by attack type
                if (attackType === AttackType.VOLUMETRIC) {
                    targetLoad += (intensity * 1.2) * mitigationFactor;
                } else if (attackType === AttackType.PROTOCOL) {
                    targetLoad += (intensity * 1.5) * mitigationFactor; // Heavier
                } else {
                    targetLoad += (intensity * 0.8) * mitigationFactor; // Stealthier but resource intensive
                }
            } else {
                // Recover
                targetLoad = Math.max(5, prev.cpuLoad - 5);
            }

            // Smooth transitions
            const newLoad = prev.cpuLoad + (targetLoad - prev.cpuLoad) * 0.1;
            const newRps = prev.requestsPerSecond + (targetRps - prev.requestsPerSecond) * 0.1;
            const isDown = newLoad >= 99;

            return {
                ...prev,
                cpuLoad: Math.min(100, newLoad),
                requestsPerSecond: Math.floor(newRps),
                isDown,
                mitigationActive
            };
        });
    }, 100); // 10 ticks per second

    return () => clearInterval(interval);
  }, [isAttackActive, intensity, attackType, mitigationActive]);

  // Metrics History Updater (1s interval)
  useEffect(() => {
    const historyInterval = setInterval(async () => {
        const now = new Date();
        const timeString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        
        setMetricsHistory(prev => {
            const newHistory = [...prev, { 
                time: timeString, 
                load: Math.round(serverStatus.cpuLoad), 
                rps: Math.round(serverStatus.requestsPerSecond / 10) // Scale down for chart
            }];
            if (newHistory.length > 20) newHistory.shift();
            return newHistory;
        });

        // Trigger AI Analysis occasionally
        if (isAttackActive || serverStatus.cpuLoad > 50) {
             const analysis = await analyzeAttackPattern(
                 serverStatus.requestsPerSecond, 
                 serverStatus.cpuLoad, 
                 attackType
             );
             setAiAnalysis(analysis);
        } else {
            setAiAnalysis("Monitoring system traffic. Normal levels.");
        }

    }, 2000);

    return () => clearInterval(historyInterval);
  }, [serverStatus.cpuLoad, serverStatus.requestsPerSecond, isAttackActive, attackType]);


  return (
    <div className="min-h-screen bg-cyber-black text-white p-4 md:p-6 font-sans overflow-hidden flex flex-col">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between border-b border-gray-800 pb-4">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyber-panel rounded border border-gray-700 text-cyber-accent">
                <Activity size={24} />
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight font-mono">NetGuard <span className="text-cyber-danger text-sm">SIMULATOR</span></h1>
                <p className="text-xs text-gray-500">Educational DDoS Visualization Environment</p>
            </div>
        </div>
        <div className="hidden md:block text-right">
            <p className="text-xs font-mono text-gray-600">v1.0.4-stable</p>
            <p className="text-xs font-mono text-gray-600">SECURE CONNECTION</p>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Column: Controls & Education (3/12) */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto">
          <ControlPanel 
            isActive={isAttackActive}
            onToggleAttack={() => setIsAttackActive(!isAttackActive)}
            attackType={attackType}
            onSetAttackType={setAttackType}
            intensity={intensity}
            onSetIntensity={setIntensity}
            mitigationActive={mitigationActive}
            onToggleMitigation={() => setMitigationActive(!mitigationActive)}
          />
          <EducationPanel 
            content={eduContent}
            loading={aiLoading}
            analysis={aiAnalysis}
          />
        </div>

        {/* Center Column: Visualization (6/12) */}
        <div className="lg:col-span-6 flex flex-col gap-6 min-h-[400px]">
          <AttackVisualizer 
            isActive={isAttackActive}
            attackType={attackType}
            intensity={intensity}
            attackerCount={Math.max(3, Math.floor(intensity / 5))}
            serverHealth={serverStatus.cpuLoad}
            mitigationActive={mitigationActive}
          />
        </div>

        {/* Right Column: Metrics (3/12) - Actually put this bottom or right? 
            Let's put metrics at bottom spanning full width, or keep right. 
            Given the complexity, let's do Right Column (3/12) for simple metrics stats, 
            but I only have 12 cols. Let's do:
            Left (3), Center (6), Right (3) doesn't leave much room for chart.
            Let's try: Top Row (Visualizer + Controls), Bottom Row (Metrics).
         */}
      </main>
        
      {/* Bottom Section: Metrics */}
      <div className="mt-6 h-64">
        <MetricsPanel history={metricsHistory} status={serverStatus} />
      </div>

    </div>
  );
};

export default App;
