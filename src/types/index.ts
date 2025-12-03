export interface Voter {
  vid: string;
  aadhar: string;
  name: string;
  phone: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  status: 'registered' | 'voted';
  createdAt: string;
  updatedAt: string;
}

export interface Booth {
  bid: string;
  location: string;
  time: string;
  assignedCount: number;
  completedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Officer {
  oid: string;
  name: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  assignmentId: string;
  voterId: string;
  boothId: string;
  officerId: string;
  timestamp: string;
  voter?: Voter;
  booth?: Booth;
  officer?: Officer;
}

export interface DashboardStats {
  totalVoters: number;
  registeredVoters: number;
  votedVoters: number;
  totalBooths: number;
  totalOfficers: number;
  totalAssignments: number;
  votingPercentage: number;
}

export interface EligibilityResult {
  eligible: boolean;
  age: number;
  message: string;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  field: string;
  existingVoter?: Voter;
  message: string;
}
