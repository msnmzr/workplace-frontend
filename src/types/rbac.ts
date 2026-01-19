export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  permissions?: Permission[];
  created_at?: string;
  updated_at?: string;
}

export interface User {
  emp_id: number;
  emp_name: string;
  emp_email: string;
  emp_code: number;
  designation_id?: number;
  dept_id?: number;
  active?: number;
  // Frontend specific or potentially joined
  roles?: Role[];
  permissions?: Permission[];
  image?: string; // Keeping image just in case, though not in payload
  created_at?: string;
  updated_at?: string;
  // Backwards compatibility/Alias (optional) - if we want to avoid refactoring EVERYTHING, 
  // but better to clean up. I will assume we rely on the new fields.
}
