# Payment Methods API Documentation

## Overview
This document provides comprehensive API documentation for the Payment Methods module in the Reward System. The Payment Methods module allows administrators to manage different payment methods with threshold limits and status control.

## Database Schema

### Payment Methods Table
```sql
CREATE TABLE payment_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    threshold_limit DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Field Descriptions
- **id**: Unique identifier for the payment method
- **name**: Payment method name (e.g., "PayPal", "Stripe", "Credit Card")
- **description**: Detailed description of the payment method
- **threshold_limit**: Minimum dollar amount required to checkout using this method
- **is_active**: Status flag (TRUE = Active, FALSE = Banned)
- **created_at**: Timestamp when the record was created
- **updated_at**: Timestamp when the record was last updated

## API Endpoints

### Base URL
```
/api/reward-system/payment-methods
```

### 1. Get All Payment Methods
**GET** `/api/reward-system/payment-methods`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "PayPal",
            "description": "PayPal payment gateway for secure online transactions",
            "threshold_limit": "25.00",
            "is_active": true,
            "created_at": "2024-01-15T10:30:00Z",
            "updated_at": "2024-01-15T10:30:00Z"
        },
        {
            "id": 2,
            "name": "Stripe",
            "description": "Stripe payment processor for credit card transactions",
            "threshold_limit": "10.00",
            "is_active": false,
            "created_at": "2024-01-15T11:00:00Z",
            "updated_at": "2024-01-15T11:00:00Z"
        }
    ]
}
```

### 2. Create Payment Method
**POST** `/api/reward-system/payment-methods`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "name": "PayPal",
    "description": "PayPal payment gateway for secure online transactions",
    "threshold_limit": "25.00",
    "is_active": true
}
```

**Validation Rules:**
- `name`: Required, string, max 255 characters
- `description`: Required, string, max 1000 characters
- `threshold_limit`: Required, decimal, minimum 0.01
- `is_active`: Optional, boolean, default true

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "PayPal",
        "description": "PayPal payment gateway for secure online transactions",
        "threshold_limit": "25.00",
        "is_active": true,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
    },
    "message": "Payment method created successfully"
}
```

### 3. Update Payment Method
**PUT** `/api/reward-system/payment-methods/{id}`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "name": "PayPal Updated",
    "description": "Updated PayPal payment gateway description",
    "threshold_limit": "30.00",
    "is_active": false
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "PayPal Updated",
        "description": "Updated PayPal payment gateway description",
        "threshold_limit": "30.00",
        "is_active": false,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T12:00:00Z"
    },
    "message": "Payment method updated successfully"
}
```

### 4. Delete Payment Method
**DELETE** `/api/reward-system/payment-methods/{id}`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response:**
```json
{
    "success": true,
    "message": "Payment method deleted successfully"
}
```

## Business Rules

### 1. Threshold Limit Validation
- Threshold limit must be a positive decimal number
- Minimum threshold limit: $0.01
- No maximum limit (unlimited)
- Used to determine minimum checkout amount for each payment method

### 2. Status Management
- **Active (is_active: true)**: Payment method is available for users to select during checkout
- **Banned (is_active: false)**: Payment method is unavailable and won't appear in user checkout options
- Status can be changed at any time without affecting existing data

### 3. Data Integrity
- Payment method names should be unique (case-insensitive)
- Cannot delete payment methods that are currently being used in active transactions
- Soft delete option recommended for audit trails

## Error Responses

### 1. Validation Error (400)
```json
{
    "success": false,
    "error": "Validation failed",
    "details": {
        "name": ["Name is required"],
        "threshold_limit": ["Threshold limit must be at least 0.01"]
    }
}
```

### 2. Not Found Error (404)
```json
{
    "success": false,
    "error": "Payment method not found"
}
```

### 3. Duplicate Name Error (409)
```json
{
    "success": false,
    "error": "Payment method with this name already exists"
}
```

### 4. Server Error (500)
```json
{
    "success": false,
    "error": "Internal server error"
}
```

## Frontend Integration Notes

### 1. State Management
The frontend expects the following Redux state structure:
```javascript
{
    paymentMethods: [],
    isLoading: false,
    error: null
}
```

### 2. API Calls
The frontend uses these thunks:
- `fetchPaymentMethods()` - Get all payment methods
- `savePaymentMethod(data)` - Create new payment method
- `updatePaymentMethod({id, data})` - Update existing payment method
- `deletePaymentMethod(id)` - Delete payment method

### 3. Expected Response Format
All API responses should follow this structure:
```javascript
{
    success: boolean,
    data: object | array,
    message?: string,
    error?: string
}
```

## Testing Scenarios

### 1. Create Payment Method
- ✅ Valid data creates payment method successfully
- ✅ Invalid data returns validation errors
- ✅ Duplicate name returns conflict error

### 2. Update Payment Method
- ✅ Valid update modifies payment method
- ✅ Invalid ID returns not found error
- ✅ Status change affects availability

### 3. Delete Payment Method
- ✅ Valid ID deletes payment method
- ✅ Invalid ID returns not found error
- ✅ Used payment methods should not be deletable

### 4. List Payment Methods
- ✅ Returns all payment methods
- ✅ Includes active and banned methods
- ✅ Proper sorting by name

## Sample Data

### Initial Payment Methods
```sql
INSERT INTO payment_methods (name, description, threshold_limit, is_active) VALUES
('PayPal', 'PayPal payment gateway for secure online transactions', 25.00, true),
('Stripe', 'Stripe payment processor for credit card transactions', 10.00, true),
('Bank Transfer', 'Direct bank transfer for large amounts', 100.00, true),
('Crypto', 'Cryptocurrency payments (Bitcoin, Ethereum)', 50.00, false);
```

## Security Considerations

### 1. Authentication
- All endpoints require valid JWT token
- Token should be included in Authorization header

### 2. Authorization
- Only admin users should access payment method management
- Regular users should only see active payment methods

### 3. Input Validation
- Sanitize all input data
- Validate threshold limits to prevent negative values
- Check for SQL injection vulnerabilities

### 4. Rate Limiting
- Implement rate limiting for API endpoints
- Prevent abuse of create/update/delete operations

## Implementation Checklist

### Backend Tasks
- [ ] Create payment_methods table in database
- [ ] Implement CRUD API endpoints
- [ ] Add input validation and error handling
- [ ] Implement authentication middleware
- [ ] Add business logic for status management
- [ ] Create database indexes for performance
- [ ] Add audit logging for changes

### Frontend Tasks
- [ ] PaymentMethodsTab component is ready
- [ ] Redux slice includes payment methods state
- [ ] API configuration includes payment method endpoints
- [ ] Content.jsx includes payment methods tab
- [ ] Error handling and loading states implemented

### Testing Tasks
- [ ] Unit tests for API endpoints
- [ ] Integration tests for database operations
- [ ] Frontend component testing
- [ ] End-to-end testing of complete flow

## Notes
- Payment methods are sorted alphabetically by name in the frontend
- Threshold limits are displayed in USD format
- Status changes are immediate and affect user checkout options
- Consider implementing payment method icons for better UX
- Future enhancement: Add payment method categories and fees
