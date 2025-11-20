export enum AttackType {
  VOLUMETRIC = 'Volumetric (UDP Flood)',
  PROTOCOL = 'Protocol (SYN Flood)',
  APPLICATION = 'Application (HTTP Flood)',
}

export interface ServerStatus {
  cpuLoad: number;
  memoryUsage: number;
  requestsPerSecond: number;
  isDown: boolean;
  mitigationActive: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  sourceIp: string;
  type: string;
  severity: 'info' | 'warning' | 'danger';
  message: string;
}

export interface SimulationConfig {
  attackerCount: number;
  packetSpeed: number;
  attackIntensity: number; // 1-100
}
