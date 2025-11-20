import { AttackType } from './types';

export const DEFAULT_ATTACKER_COUNT = 8;
export const MAX_ATTACKER_COUNT = 20;
export const SERVER_RECOVERY_RATE = 0.5; // CPU load recovers by this amount per tick

export const ATTACK_DESCRIPTIONS: Record<AttackType, string> = {
  [AttackType.VOLUMETRIC]: "Consumes the bandwidth of the target network/service.",
  [AttackType.PROTOCOL]: "Consumes server resources (e.g., firewalls, load balancers) rather than bandwidth.",
  [AttackType.APPLICATION]: "Targets specific web applications to exhaust resources, appearing as normal traffic.",
};
