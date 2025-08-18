# Reward System API Documentation

## Base URL
```
/api/reward-system
```

## Authentication
All endpoints require authentication via Bearer token in headers:
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 1. Reward Steps Management

### 1.1 Get All Reward Steps
**GET** `/api/reward-system/steps`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Complete Profile",
      "description": "Fill out your complete profile information including bio, skills, and experience",
      "coinsReward": 100,
      "dollarValue": 10.00,
      "order": 1,
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    },
    {
      "id": "2",
      "title": "Upload Profile Picture",
      "description": "Add a professional profile picture to your account",
      "coinsReward": 50,
      "dollarValue": 5.00,
      "order": 2,
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    },
    {
      "id": "3",
      "title": "Connect Social Media",
      "description": "Link your LinkedIn, Twitter, or other professional social media accounts",
      "coinsReward": 75,
      "dollarValue": 7.50,
      "order": 3,
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    },
    {
      "id": "4",
      "title": "Complete Skills Assessment",
      "description": "Take the skills assessment test to showcase your expertise",
      "coinsReward": 200,
      "dollarValue": 20.00,
      "order": 4,
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    },
    {
      "id": "5",
      "title": "Refer a Friend",
      "description": "Invite a friend to join the platform and earn bonus rewards",
      "coinsReward": 75,
      "dollarValue": 7.50,
      "order": 5,
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### 1.2 Create New Reward Step
**POST** `/api/reward-system/steps`

**Request Body:**
```json
{
  "title": "New Step Title",
  "description": "Step description here",
  "coinsReward": 100,
  "dollarValue": 10.00,
  "order": 6,
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "6",
    "title": "New Step Title",
    "description": "Step description here",
    "coinsReward": 100,
    "dollarValue": 10.00,
    "order": 6,
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 1.3 Update Reward Step (with Auto-Redistribution)
**PUT** `/api/reward-system/steps/{id}`

**Request Body:**
```json
{
  "title": "Updated Step Title",
  "description": "Updated description",
  "coinsReward": 150,
  "dollarValue": 15.00,
  "order": 1,
  "isActive": true
}
```

**Response (with redistributed steps):**
```json
{
  "success": true,
  "message": "Reward step updated successfully - other steps redistributed automatically",
  "data": {
    "updatedStep": {
      "id": "1",
      "title": "Updated Step Title",
      "description": "Updated description",
      "coinsReward": 150,
      "dollarValue": 15.00,
      "order": 1,
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    },
    "allSteps": [
      {
        "id": "1",
        "title": "Updated Step Title",
        "description": "Updated description",
        "coinsReward": 150,
        "dollarValue": 15.00,
        "order": 1,
        "isActive": true,
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z"
      },
      {
        "id": "2",
        "title": "Upload Profile Picture",
        "description": "Add a professional profile picture to your account",
        "coinsReward": 43,
        "dollarValue": 4.30,
        "order": 2,
        "isActive": true,
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z"
      },
      {
        "id": "3",
        "title": "Connect Social Media",
        "description": "Link your LinkedIn, Twitter, or other professional social media accounts",
        "coinsReward": 65,
        "dollarValue": 6.50,
        "order": 3,
        "isActive": true,
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z"
      },
      {
        "id": "4",
        "title": "Complete Skills Assessment",
        "description": "Take the skills assessment test to showcase your expertise",
        "coinsReward": 173,
        "dollarValue": 17.30,
        "order": 4,
        "isActive": true,
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z"
      },
      {
        "id": "5",
        "title": "Refer a Friend",
        "description": "Invite a friend to join the platform and earn bonus rewards",
        "coinsReward": 69,
        "dollarValue": 6.90,
        "order": 5,
        "isActive": true,
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

### 1.4 Delete Reward Step
**DELETE** `/api/reward-system/steps/{id}`

**Response:**
```json
{
  "success": true,
  "message": "Reward step deleted successfully"
}
```

---

## 2. Coin Conversion Rate Management

### 2.1 Get Coin Conversion Rate
**GET** `/api/reward-system/conversion-rate`

**Response:**
```json
{
  "success": true,
  "data": {
    "coinsPerDollar": 10,
    "isActive": true
  }
}
```

### 2.2 Update Coin Conversion Rate
**PUT** `/api/reward-system/conversion-rate`

**Request Body:**
```json
{
  "coinsPerDollar": 10,
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "coinsPerDollar": 10,
    "isActive": true
  }
}
```

---

## 3. Business Rules & Constraints

### 3.1 Fixed Totals
- **Total Coins**: Must always equal exactly **500 coins**
- **Total Dollars**: Must always equal exactly **$50.00**
- **Auto-redistribution**: When any step is updated, other steps must be redistributed proportionally

### 3.2 Validation Rules
```javascript
// Validation for creating/updating steps
{
  "title": "required, string, max 100 characters",
  "description": "required, string, max 500 characters", 
  "coinsReward": "required, integer, min 1, max 500",
  "dollarValue": "required, decimal, min 0.01, max 50.00",
  "order": "required, integer, min 1",
  "isActive": "required, boolean"
}

// Validation for conversion rate
{
  "coinsPerDollar": "required, decimal, min 0.01",
  "isActive": "required, boolean"
}
```

### 3.3 Redistribution Algorithm
When updating a step, the backend should:

1. **Validate** the new values don't exceed totals
2. **Calculate** remaining coins/dollars for other steps
3. **Redistribute** proportionally based on current ratios
4. **Round** coin values to integers
5. **Format** dollar values to 2 decimal places
6. **Return** all updated steps in response

### 3.4 Error Responses
```json
{
  "success": false,
  "error": "Error message here",
  "code": "ERROR_CODE"
}
```

**Common Error Codes:**
- `VALIDATION_ERROR`: Invalid input data
- `TOTAL_EXCEEDED`: Value exceeds fixed totals
- `STEP_NOT_FOUND`: Step ID doesn't exist
- `REDISTRIBUTION_FAILED`: Cannot maintain totals
- `UNAUTHORIZED`: Authentication required
- `SERVER_ERROR`: Internal server error

---

## 4. Database Schema

### 4.1 Reward Steps Table
```sql
CREATE TABLE reward_steps (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    coins_reward INT NOT NULL CHECK (coins_reward >= 1),
    dollar_value DECIMAL(10,2) NOT NULL CHECK (dollar_value >= 0.01),
    step_order INT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Constraint to ensure total coins = 500
ALTER TABLE reward_steps 
ADD CONSTRAINT check_total_coins 
CHECK ((SELECT SUM(coins_reward) FROM reward_steps) = 500);

-- Constraint to ensure total dollars = 50
ALTER TABLE reward_steps 
ADD CONSTRAINT check_total_dollars 
CHECK ((SELECT SUM(dollar_value) FROM reward_steps) = 50.00);
```

### 4.2 Coin Conversion Rate Table
```sql
CREATE TABLE coin_conversion_rate (
    id INT PRIMARY KEY AUTO_INCREMENT,
    coins_per_dollar DECIMAL(10,2) NOT NULL CHECK (coins_per_dollar > 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 5. Frontend Integration Notes

### 5.1 Redux Actions Used
```javascript
// Actions that need backend implementation
fetchRewardSteps()           // GET /api/reward-system/steps
saveRewardStep(data)         // POST /api/reward-system/steps  
updateRewardStep({id, data}) // PUT /api/reward-system/steps/{id}
deleteRewardStep(id)         // DELETE /api/reward-system/steps/{id}
fetchCoinConversionRate()    // GET /api/reward-system/conversion-rate
updateCoinConversionRate(data) // PUT /api/reward-system/conversion-rate
```

### 5.2 Expected Response Format
All API responses should follow this structure:
```javascript
{
  success: boolean,
  data?: any,
  message?: string,
  error?: string,
  code?: string
}
```

### 5.3 Loading States
Frontend expects these loading states:
- `isLoading: true` during API calls
- `isLoading: false` when complete
- `error: string` for error messages

---

## 6. Testing Scenarios

### 6.1 Redistribution Testing
1. **Increase a step's coins** → Verify other steps decrease proportionally
2. **Decrease a step's dollars** → Verify other steps increase proportionally  
3. **Exceed totals** → Verify validation error
4. **Delete a step** → Verify redistribution of remaining values

### 6.2 Edge Cases
1. **Single step** → Cannot exceed totals
2. **Zero values** → Should be prevented
3. **Negative values** → Should be prevented
4. **Decimal coins** → Should be rounded to integers
5. **Concurrent updates** → Handle race conditions

---

## 7. Implementation Priority

### High Priority (Core Functionality)
1. ✅ GET /api/reward-system/steps
2. ✅ PUT /api/reward-system/steps/{id} (with redistribution)
3. ✅ GET /api/reward-system/conversion-rate
4. ✅ PUT /api/reward-system/conversion-rate

### Medium Priority (Additional Features)
1. POST /api/reward-system/steps (create new)
2. DELETE /api/reward-system/steps/{id}
3. Bulk operations
4. Audit logging

### Low Priority (Enhancements)
1. Step reordering
2. Bulk import/export
3. Analytics endpoints
4. User progress tracking
