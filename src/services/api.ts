const API_BASE = 'http://localhost:5000/api';

// ==================== VOTERS ====================

export const fetchVoters = async () => {
  try {
    const response = await fetch(`${API_BASE}/voters`);
    if (!response.ok) throw new Error('Failed to fetch voters');
    return await response.json();
  } catch (error) {
    console.error('Error fetching voters:', error);
    throw error;
  }
};

export const fetchVoter = async (vid: string) => {
  try {
    const response = await fetch(`${API_BASE}/voters/${vid}`);
    if (!response.ok) throw new Error('Failed to fetch voter');
    return await response.json();
  } catch (error) {
    console.error('Error fetching voter:', error);
    throw error;
  }
};

export const addVoter = async (voter: {
  vid: string;
  aadhar: string;
  name: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
}) => {
  try {
    const response = await fetch(`${API_BASE}/voters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(voter),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add voter');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding voter:', error);
    throw error;
  }
};

export const updateVoter = async (
  vid: string,
  voter: {
    name: string;
    phone: string;
    address: string;
    status: 'registered' | 'voted';
  }
) => {
  try {
    const response = await fetch(`${API_BASE}/voters/${vid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(voter),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update voter');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating voter:', error);
    throw error;
  }
};

export const deleteVoter = async (vid: string) => {
  try {
    const response = await fetch(`${API_BASE}/voters/${vid}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete voter');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting voter:', error);
    throw error;
  }
};

// ==================== BOOTHS ====================

export const fetchBooths = async () => {
  try {
    const response = await fetch(`${API_BASE}/booths`);
    if (!response.ok) throw new Error('Failed to fetch booths');
    return await response.json();
  } catch (error) {
    console.error('Error fetching booths:', error);
    throw error;
  }
};

export const fetchBooth = async (bid: string) => {
  try {
    const response = await fetch(`${API_BASE}/booths/${bid}`);
    if (!response.ok) throw new Error('Failed to fetch booth');
    return await response.json();
  } catch (error) {
    console.error('Error fetching booth:', error);
    throw error;
  }
};

export const addBooth = async (booth: {
  bid: string;
  location: string;
  time: string;
}) => {
  try {
    const response = await fetch(`${API_BASE}/booths`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booth),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add booth');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding booth:', error);
    throw error;
  }
};

export const updateBooth = async (
  bid: string,
  booth: {
    location: string;
    time: string;
  }
) => {
  try {
    const response = await fetch(`${API_BASE}/booths/${bid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booth),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update booth');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating booth:', error);
    throw error;
  }
};

export const deleteBooth = async (bid: string) => {
  try {
    const response = await fetch(`${API_BASE}/booths/${bid}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete booth');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting booth:', error);
    throw error;
  }
};

// ==================== OFFICERS ====================

export const fetchOfficers = async () => {
  try {
    const response = await fetch(`${API_BASE}/officers`);
    if (!response.ok) throw new Error('Failed to fetch officers');
    return await response.json();
  } catch (error) {
    console.error('Error fetching officers:', error);
    throw error;
  }
};

export const fetchOfficer = async (oid: string) => {
  try {
    const response = await fetch(`${API_BASE}/officers/${oid}`);
    if (!response.ok) throw new Error('Failed to fetch officer');
    return await response.json();
  } catch (error) {
    console.error('Error fetching officer:', error);
    throw error;
  }
};

export const addOfficer = async (officer: {
  oid: string;
  name: string;
  phone: string;
}) => {
  try {
    const response = await fetch(`${API_BASE}/officers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(officer),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add officer');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding officer:', error);
    throw error;
  }
};

export const updateOfficer = async (
  oid: string,
  officer: {
    name: string;
    phone: string;
  }
) => {
  try {
    const response = await fetch(`${API_BASE}/officers/${oid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(officer),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update officer');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating officer:', error);
    throw error;
  }
};

export const deleteOfficer = async (oid: string) => {
  try {
    const response = await fetch(`${API_BASE}/officers/${oid}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete officer');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting officer:', error);
    throw error;
  }
};

// ==================== ASSIGNMENTS ====================

export const fetchAssignments = async () => {
  try {
    const response = await fetch(`${API_BASE}/assignments`);
    if (!response.ok) throw new Error('Failed to fetch assignments');
    return await response.json();
  } catch (error) {
    console.error('Error fetching assignments:', error);
    throw error;
  }
};

export const fetchAssignmentsByVoter = async (voterId: string) => {
  try {
    const response = await fetch(`${API_BASE}/assignments/voter/${voterId}`);
    if (!response.ok) throw new Error('Failed to fetch assignments');
    return await response.json();
  } catch (error) {
    console.error('Error fetching assignments:', error);
    throw error;
  }
};

export const fetchAssignmentsByBooth = async (boothId: string) => {
  try {
    const response = await fetch(`${API_BASE}/assignments/booth/${boothId}`);
    if (!response.ok) throw new Error('Failed to fetch assignments');
    return await response.json();
  } catch (error) {
    console.error('Error fetching assignments:', error);
    throw error;
  }
};

export const addAssignment = async (assignment: {
  assignmentId: string;
  voterId: string;
  boothId: string;
  officerId: string;
}) => {
  try {
    const response = await fetch(`${API_BASE}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignment),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add assignment');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding assignment:', error);
    throw error;
  }
};

export const deleteAssignment = async (assignmentId: string) => {
  try {
    const response = await fetch(`${API_BASE}/assignments/${assignmentId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete assignment');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting assignment:', error);
    throw error;
  }
};

// ==================== STATS ====================

export const fetchStats = async () => {
  try {
    const response = await fetch(`${API_BASE}/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};
