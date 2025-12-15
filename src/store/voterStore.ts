import { create } from 'zustand';
import { Voter, Booth, Officer, Assignment, DashboardStats } from '@/types';
import { mockVoters, mockBooths, mockOfficers, mockAssignments } from '@/data/mockData';
import * as api from '@/services/api';
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
  voters: [],
  booths: [],
  officers: [],
  assignments: [],

  addVoter: (voterData) => {
    // generate client-side vid then persist to backend
    const now = new Date().toISOString();
    const generatedVid = `v-${uuidv4().slice(0, 8)}`;
    const newVoter: Voter = {
      ...voterData,
      vid: generatedVid,
      createdAt: now,
      updatedAt: now,
    };

    // Optimistically update UI
    set((state) => ({ voters: [...state.voters, newVoter] }));

    // Persist to backend
    (async () => {
      try {
        await api.addVoter({
          vid: newVoter.vid,
          aadhar: newVoter.aadhar,
          name: newVoter.name,
          phone: newVoter.phone,
          dob: newVoter.dob,
          gender: newVoter.gender,
          address: newVoter.address,
        });
      } catch (err) {
        // rollback optimistic update on error
        console.error('Failed to persist voter to backend:', err);
        set((state) => ({ voters: state.voters.filter((v) => v.vid !== generatedVid) }));
      }
    })();
  },

  updateVoter: (vid, voterData) => {
    // Optimistically update UI
    set((state) => ({
      voters: state.voters.map((v) =>
        v.vid === vid ? { ...v, ...voterData, updatedAt: new Date().toISOString() } : v
      ),
    }));

    // Persist update to backend
    (async () => {
      try {
        await api.updateVoter(vid, {
          name: voterData.name as string,
          phone: voterData.phone as string,
          address: voterData.address as string,
          status: (voterData.status as 'registered' | 'voted') || 'registered',
        });
      } catch (err) {
        console.error('Failed to update voter on backend:', err);
        // In case of error, a full refresh from server may be needed; keep UI state simple.
      }
    })();
  },

  deleteVoter: (vid) => {
    // Optimistically remove
    const prev = get();
    set((state) => ({
      voters: state.voters.filter((v) => v.vid !== vid),
      assignments: state.assignments.filter((a) => a.voterId !== vid),
    }));

    (async () => {
      try {
        await api.deleteVoter(vid);
      } catch (err) {
        console.error('Failed to delete voter on backend:', err);
        // rollback
        set(() => ({ voters: prev.voters, assignments: prev.assignments }));
      }
    })();
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
    const generatedBid = `b-${uuidv4().slice(0, 8)}`;
    const newBooth: Booth = {
      ...boothData,
      bid: generatedBid,
      assignedCount: 0,
      completedCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    // Optimistic UI update
    set((state) => ({ booths: [...state.booths, newBooth] }));

    // Persist to backend
    (async () => {
      try {
        await api.addBooth({ bid: newBooth.bid, location: newBooth.location, time: newBooth.time });
      } catch (err) {
        console.error('Failed to persist booth to backend:', err);
        set((state) => ({ booths: state.booths.filter((b) => b.bid !== generatedBid) }));
      }
    })();
  },

  updateBooth: (bid, boothData) => {
    // Optimistic update
    set((state) => ({
      booths: state.booths.map((b) =>
        b.bid === bid ? { ...b, ...boothData, updatedAt: new Date().toISOString() } : b
      ),
    }));

    (async () => {
      try {
        await api.updateBooth(bid, { location: boothData.location as string, time: boothData.time as string });
      } catch (err) {
        console.error('Failed to update booth on backend:', err);
      }
    })();
  },

  deleteBooth: (bid) => {
    const prev = get();
    set((state) => ({
      booths: state.booths.filter((b) => b.bid !== bid),
      assignments: state.assignments.filter((a) => a.boothId !== bid),
    }));

    (async () => {
      try {
        await api.deleteBooth(bid);
      } catch (err) {
        console.error('Failed to delete booth on backend:', err);
        set(() => ({ booths: prev.booths, assignments: prev.assignments }));
      }
    })();
  },

  addOfficer: (officerData) => {
    const now = new Date().toISOString();
    const generatedOid = `o-${uuidv4().slice(0, 8)}`;
    const newOfficer: Officer = {
      ...officerData,
      oid: generatedOid,
      createdAt: now,
      updatedAt: now,
    };

    // Optimistic update
    set((state) => ({ officers: [...state.officers, newOfficer] }));

    (async () => {
      try {
        await api.addOfficer({ oid: newOfficer.oid, name: newOfficer.name, phone: newOfficer.phone });
      } catch (err) {
        console.error('Failed to persist officer to backend:', err);
        set((state) => ({ officers: state.officers.filter((o) => o.oid !== generatedOid) }));
      }
    })();
  },

  updateOfficer: (oid, officerData) => {
    // Optimistic update
    set((state) => ({
      officers: state.officers.map((o) =>
        o.oid === oid ? { ...o, ...officerData, updatedAt: new Date().toISOString() } : o
      ),
    }));

    (async () => {
      try {
        await api.updateOfficer(oid, { name: officerData.name as string, phone: officerData.phone as string });
      } catch (err) {
        console.error('Failed to update officer on backend:', err);
      }
    })();
  },

  deleteOfficer: (oid) => {
    const prev = get();
    set((state) => ({
      officers: state.officers.filter((o) => o.oid !== oid),
      assignments: state.assignments.filter((a) => a.officerId !== oid),
    }));

    (async () => {
      try {
        await api.deleteOfficer(oid);
      } catch (err) {
        console.error('Failed to delete officer on backend:', err);
        set(() => ({ officers: prev.officers, assignments: prev.assignments }));
      }
    })();
  },

  addAssignment: (assignmentData) => {
    const generatedAssignmentId = `a-${uuidv4().slice(0, 8)}`;
    const newAssignment: Assignment = {
      ...assignmentData,
      assignmentId: generatedAssignmentId,
      timestamp: new Date().toISOString(),
    };

    const prev = get();

    // Optimistic update
    set((state) => ({
      assignments: [...state.assignments, newAssignment],
      booths: state.booths.map((b) =>
        b.bid === assignmentData.boothId
          ? { ...b, assignedCount: b.assignedCount + 1, updatedAt: new Date().toISOString() }
          : b
      ),
    }));

    (async () => {
      try {
        await api.addAssignment({
          assignmentId: newAssignment.assignmentId,
          voterId: newAssignment.voterId,
          boothId: newAssignment.boothId,
          officerId: newAssignment.officerId,
        });
      } catch (err) {
        console.error('Failed to persist assignment to backend:', err);
        // rollback
        set(() => ({ assignments: prev.assignments, booths: prev.booths }));
      }
    })();
  },

  deleteAssignment: (assignmentId) => {
    const prev = get();
    const { assignments, booths } = prev;
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

    (async () => {
      try {
        await api.deleteAssignment(assignmentId);
      } catch (err) {
        console.error('Failed to delete assignment on backend:', err);
        set(() => ({ assignments: prev.assignments, booths: prev.booths }));
      }
    })();
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
