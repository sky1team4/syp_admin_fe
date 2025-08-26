// Test file to verify status transition logic
import { canUpdateStatus, getAllowedTransitions, isValidTransition } from './cashFlowUtils';

// Test cases for status transitions
const testCases = [
    {
        currentStatus: 'PENDING',
        allowedTransitions: ['ACCEPTED', 'REJECTED', 'PROCESSING'],
        canUpdate: true
    },
    {
        currentStatus: 'PROCESSING',
        allowedTransitions: ['ACCEPTED', 'REJECTED'],
        canUpdate: true
    },
    {
        currentStatus: 'ACCEPTED',
        allowedTransitions: ['COMPLETED'],
        canUpdate: true
    },
    {
        currentStatus: 'REJECTED',
        allowedTransitions: [],
        canUpdate: false
    },
    {
        currentStatus: 'COMPLETED',
        allowedTransitions: [],
        canUpdate: false
    }
];

// Run tests
console.log('Testing Status Transition Logic:');
console.log('================================');

testCases.forEach((testCase, index) => {
    const { currentStatus, allowedTransitions, canUpdate } = testCase;
    
    console.log(`\nTest ${index + 1}: ${currentStatus}`);
    console.log(`Expected allowed transitions: [${allowedTransitions.join(', ')}]`);
    console.log(`Expected can update: ${canUpdate}`);
    
    const actualTransitions = getAllowedTransitions(currentStatus);
    const actualCanUpdate = canUpdateStatus(currentStatus);
    
    console.log(`Actual allowed transitions: [${actualTransitions.join(', ')}]`);
    console.log(`Actual can update: ${actualCanUpdate}`);
    
    const transitionsMatch = JSON.stringify(actualTransitions) === JSON.stringify(allowedTransitions);
    const canUpdateMatch = actualCanUpdate === canUpdate;
    
    console.log(`Transitions match: ${transitionsMatch ? '✅' : '❌'}`);
    console.log(`Can update match: ${canUpdateMatch ? '✅' : '❌'}`);
    
    // Test individual transitions
    allowedTransitions.forEach(targetStatus => {
        const isValid = isValidTransition(currentStatus, targetStatus);
        console.log(`  ${currentStatus} → ${targetStatus}: ${isValid ? '✅' : '❌'}`);
    });
    
    // Test invalid transitions
    const allStatuses = ['PENDING', 'PROCESSING', 'ACCEPTED', 'REJECTED', 'COMPLETED'];
    const invalidTransitions = allStatuses.filter(status => !allowedTransitions.includes(status));
    invalidTransitions.forEach(targetStatus => {
        const isValid = isValidTransition(currentStatus, targetStatus);
        console.log(`  ${currentStatus} → ${targetStatus}: ${!isValid ? '✅ (correctly invalid)' : '❌ (should be invalid)'}`);
    });
});

console.log('\n================================');
console.log('Status Transition Tests Complete!');
