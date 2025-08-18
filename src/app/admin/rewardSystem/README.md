# Reward System Module

This module allows administrators to manage a comprehensive reward system for users, including reward steps and coin-to-dollar conversion rates.

## Features

### 1. Reward Steps Management
- **Create, Edit, Delete** reward steps
- **Order Management** - Set the sequence of steps users need to complete
- **Coin Rewards** - Assign coin amounts for each completed step
- **Dollar Values** - Set the dollar equivalent for each step
- **Active/Inactive Status** - Enable or disable individual steps
- **Visual Status Indicators** - Clear visual feedback for active/inactive steps

### 2. Coin Conversion Rate Management
- **Exchange Rate Configuration** - Set coins per dollar ratio
- **Real-time Preview** - See conversion examples as you type
- **Active/Inactive Toggle** - Enable or disable the conversion system
- **Example Calculations** - Display common conversion scenarios

## API Endpoints

The module expects the following backend API endpoints:

### Reward Steps
- `GET /reward-steps` - Fetch all reward steps
- `POST /reward-steps` - Create new reward step
- `PUT /reward-steps/:id` - Update existing reward step
- `DELETE /reward-steps/:id` - Delete reward step

### Coin Conversion Rate
- `GET /coin-conversion-rate` - Fetch current conversion rate
- `PUT /coin-conversion-rate` - Update conversion rate

## Data Structure

### Reward Step Object
```javascript
{
  id: string,
  title: string,
  description: string,
  coinsReward: number,
  dollarValue: number,
  order: number,
  isActive: boolean,
  createdAt: string,
  updatedAt: string
}
```

### Conversion Rate Object
```javascript
{
  coinsPerDollar: number,
  isActive: boolean
}
```

## Usage

1. **Access the Module**: Navigate to `/admin/rewardSystem` in the admin panel
2. **Manage Reward Steps**: Use the "Reward Steps" tab to create and manage user tasks
3. **Set Conversion Rate**: Use the "Coin Conversion" tab to configure the exchange rate
4. **Monitor Status**: Check active/inactive status for both steps and conversion rate

## Business Logic

- Users complete reward steps to earn coins
- Coins can be converted to dollars based on the configured rate
- Steps are displayed in order (lowest to highest order number)
- Only active steps are available to users
- Conversion rate affects all reward calculations

## Security

- All API calls require authentication token
- Admin-only access to configuration
- Validation on all input fields
- Confirmation dialogs for destructive actions
