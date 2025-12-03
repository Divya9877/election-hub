import { create } from 'zustand';
import { Voter, Booth, Officer, Assignment, DashboardStats } from '@/types';
import { mockVoters, mockBooths, mockOfficers, mockAssignments } from '@/data/mockData';
import { v4 as uuidv4 } from 'uuid';

interface VoterStore {
  voters: Voter[];
  booths: Booth[];
  officers: Officer[];
  assignments: Assignment[];
  
  // Voter actions
  addVoter: (voter: Omit<Voter, 'vid' | 'createdAt' | 'updatedAt'>) => void;
  updateVoter: (vid: string, voter: Partial<Voter>) => void;
  deleteVoter: (vid: string) => void;
  markAsVoted: (vid: string) => void;
  
  // Booth actions
  addBooth: (booth: Omit<Booth, 'bid' | 'createdAt' | 'updatedAt' | 'assignedCount' | 'completedCount'>) => void;
  updateBooth: (bid: string, booth: Partial<Booth>) => void;
  deleteBooth: (bid: string) => void;
  
  // Officer actions
  addOfficer: (officer: Omit<Officer, 'oid' | 'createdAt' | 'updatedAt'>) => void;
  updateOfficer: (oid: string, officer: Partial<Officer>) => void;
  deleteOfficer: (oid: string) => void;
  
  // Assignment actions
  addAssignment: (assignment: Omit<Assignment, 'assignmentId' | 'timestamp'>) => void;
  deleteAssignment: (assignmentId: string) => void;
  
  // Stats
  getStats: () => DashboardStats;
  
  // Utility
  checkEligibility: (voterId: string) => { eligible: boolean; age: number; message: string };
  checkDuplicate: (aadhar: string, phone: string, excludeVid?: string) => { isDuplicate: boolean; field: string; message: string };
}

export const useVoterStore = create<VoterStore>((set, get) => ({
  voters: mockVoters,
  booths: mockBooths,
  officers: mockOfficers,
  assignments: mockAssignments,

  addVoter: (voterData) => {
    const now = new Date().toISOString();
    const newVoter: Voter = {
      ...voterData,
      vid: `v-${uuidv4().slice(0, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ voters: [...state.voters, newVoter] }));
  },

  updateVoter: (vid, voterData) => {
    set((state) => ({
      voters: state.voters.map((v) =>
        v.vid === vid ? { ...v, ...voterData, updatedAt: new Date().toISOString() } : v
      ),
    }));
  },

  deleteVoter: (vid) => {
    set((state) => ({
      voters: state.voters.filter((v) => v.vid !== vid),
      assignments: state.assignments.filter((a) => a.voterId !== vid),
    }));
  },

  markAsVoted: (vid) => {
    const { voters, assignments, booths } = get();
    const voter = voters.find((v) => v.vid === vid);
    if (!voter || voter.status === 'voted') return;

    const assignment = assignments.find((a) => a.voterId === vid);
    
    set((state) => ({
      voters: state.voters.map((v) =>
        v.vid === vid ? { ...v, status: 'voted', updatedAt: new Date().toISOString() } : v
      ),
      booths: assignment
        ? state.booths.map((b) =>
            b.bid === assignment.boothId
              ? { ...b, completedCount: b.completedCount + 1, updatedAt: new Date().toISOString() }
              : b
          )
        : state.booths,
    }));
  },

  addBooth: (boothData) => {
    const now = new Date().toISOString();
    const newBooth: Booth = {
      ...boothData,
      bid: `b-${uuidv4().slice(0, 8)}`,
      assignedCount: 0,
      completedCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ booths: [...state.booths, newBooth] }));
  },

  updateBooth: (bid, boothData) => {
    set((state) => ({
      booths: state.booths.map((b) =>
        b.bid === bid ? { ...b, ...boothData, updatedAt: new Date().toISOString() } : b
      ),
    }));
  },

  deleteBooth: (bid) => {
    set((state) => ({
      booths: state.booths.filter((b) => b.bid !== bid),
      assignments: state.assignments.filter((a) => a.boothId !== bid),
    }));
  },

  addOfficer: (officerData) => {
    const now = new Date().toISOString();
    const newOfficer: Officer = {
      ...officerData,
      oid: `o-${uuidv4().slice(0, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ officers: [...state.officers, newOfficer] }));
  },

  updateOfficer: (oid, officerData) => {
    set((state) => ({
      officers: state.officers.map((o) =>
        o.oid === oid ? { ...o, ...officerData, updatedAt: new Date().toISOString() } : o
      ),
    }));
  },

  deleteOfficer: (oid) => {
    set((state) => ({
      officers: state.officers.filter((o) => o.oid !== oid),
      assignments: state.assignments.filter((a) => a.officerId !== oid),
    }));
  },

  addAssignment: (assignmentData) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      assignmentId: `a-${uuidv4().slice(0, 8)}`,
      timestamp: new Date().toISOString(),
    };
    
    set((state) => ({
      assignments: [...state.assignments, newAssignment],
      booths: state.booths.map((b) =>
        b.bid === assignmentData.boothId
          ? { ...b, assignedCount: b.assignedCount + 1, updatedAt: new Date().toISOString() }
          : b
      ),
    }));
  },

  deleteAssignment: (assignmentId) => {
    const { assignments, booths } = get();
    const assignment = assignments.find((a) => a.assignmentId === assignmentId);
    
    set((state) => ({
      assignments: state.assignments.filter((a) => a.assignmentId !== assignmentId),
      booths: assignment
        ? state.booths.map((b) =>
            b.bid === assignment.boothId
              ? { ...b, assignedCount: Math.max(0, b.assignedCount - 1), updatedAt: new Date().toISOString() }
              : b
          )
        : state.booths,
    }));
  },

  getStats: () => {
    const { voters, booths, officers, assignments } = get();
    const votedVoters = voters.filter((v) => v.status === 'voted').length;
    
    return {
      totalVoters: voters.length,
      registeredVoters: voters.filter((v) => v.status === 'registered').length,
      votedVoters,
      totalBooths: booths.length,
      totalOfficers: officers.length,
      totalAssignments: assignments.length,
      votingPercentage: voters.length > 0 ? Math.round((votedVoters / voters.length) * 100) : 0,
    };
  },

  checkEligibility: (voterId) => {
    const { voters } = get();
    const voter = voters.find((v) => v.vid === voterId);
    
    if (!voter) {
      return { eligible: false, age: 0, message: 'Voter not found' };
    }

    const today = new Date();
    const birthDate = new Date(voter.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const eligible = age >= 18;
    return {
      eligible,
      age,
      message: eligible
        ? `${voter.name} is eligible to vote (Age: ${age})`
        : `${voter.name} is not eligible to vote (Age: ${age}, minimum age: 18)`,
    };
  },

  checkDuplicate: (aadhar, phone, excludeVid) => {
    const { voters } = get();
    
    const aadharDuplicate = voters.find(
      (v) => v.aadhar === aadhar && v.vid !== excludeVid
    );
    if (aadharDuplicate) {
      return {
        isDuplicate: true,
        field: 'aadhar',
        message: `Duplicate Aadhar found: ${aadharDuplicate.name} (${aadharDuplicate.vid})`,
      };
    }

    const phoneDuplicate = voters.find(
      (v) => v.phone === phone && v.vid !== excludeVid
    );
    if (phoneDuplicate) {
      return {
        isDuplicate: true,
        field: 'phone',
        message: `Duplicate phone found: ${phoneDuplicate.name} (${phoneDuplicate.vid})`,
      };
    }

    return {
      isDuplicate: false,
      field: '',
      message: 'No duplicates found',
    };
  },
}));
