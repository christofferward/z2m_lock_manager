export interface LockSlot {
  name: string;
  code: string;
  enabled: boolean;
  user_type: string;
  has_fingerprint?: boolean;
  has_rfid?: boolean;
  auto_rotate?: boolean;
  rotate_interval_hours?: number;
  last_rotated?: string;
  valid_from?: string;
  valid_to?: string;
  recurring_days?: number[];
  recurring_start_time?: string;
  recurring_end_time?: string;
  pin_synced_to_lock?: boolean;
}

export interface LockData {
  entity_id: string;
  name: string;
  slots: Record<string, LockSlot>;
  max_slots?: number;
}
