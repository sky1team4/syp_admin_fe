// Status transition logic - matches backend validation
// 
// Status Transition Flow:
// ✅ PENDING → ACCEPTED, REJECTED, or PROCESSING
// ✅ PROCESSING → ACCEPTED or REJECTED  
// ✅ ACCEPTED → COMPLETED
// ✅ REJECTED → (no further transitions)
// ✅ COMPLETED → (no further transitions)

const canUpdateStatus = (currentStatus) => {
    const status = currentStatus.toUpperCase();
    return ['PENDING', 'PROCESSING', 'ACCEPTED'].includes(status);
};

// Get allowed transitions for a status
const getAllowedTransitions = (currentStatus) => {
    const status = currentStatus.toUpperCase();
    const transitions = {
        'PENDING': ['ACCEPTED', 'REJECTED'],
        'PROCESSING': ['ACCEPTED', 'REJECTED'],
        'ACCEPTED': ['COMPLETED'],
        'REJECTED': [],
        'COMPLETED': []
    };
    return transitions[status] || [];
};

// Check if transition is valid
const isValidTransition = (currentStatus, newStatus) => {
    const allowed = getAllowedTransitions(currentStatus);
    return allowed.includes(newStatus.toUpperCase());
};

export { canUpdateStatus, getAllowedTransitions, isValidTransition };
