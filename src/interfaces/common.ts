// src/interfaces/common.ts
import { type LucideIcon } from 'lucide-react';

export interface TutorStat {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    textColor: string;
}
