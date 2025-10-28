# Profile Management Feature Documentation

## Overview
This document describes the implementation of profile and family member management features in the MediLab React application.

## Features Implemented

### 1. Update Profile Information
- **Location**: Profile Page → Account Tab → "Chỉnh sửa" button
- **API**: `PUT /api/patients`
- **Functionality**: 
  - Users can update their personal information including:
    - Full name, phone, email
    - CCCD/CMND, date of birth, gender
    - Blood type, weight, height
    - Address and profile image URL
  - Changes are saved to the backend immediately
  - Profile data is refreshed after successful update

### 2. Add Family Member
- **Location**: Profile Page → Family Tab → "Thêm thành viên" button
- **API**: `POST /api/patients/relationships`
- **Functionality**:
  - Simple one-step process:
    1. Fill family member information form and submit
  - Required fields: Full name, phone, date of birth, gender
  - Optional fields: Email, CCCD, blood type, weight, height, address
  - Automatic reload of family members list after success

### 3. Update Family Member Information
- **Location**: Profile Page → Family Tab → Family Member Card → "EDIT" button
- **API**: `PUT /api/patients` (same as profile update)
- **Functionality**:
  - Same fields as profile update
  - Uses the same API endpoint for updating patient information
  - Automatically refreshes family member list after update

## Components Created

### 1. EditProfileModal.jsx
- **Path**: `/src/components/Profile/EditProfileModal.jsx`
- **Props**:
  - `isOpen`: boolean - controls modal visibility
  - `onClose`: function - callback to close modal
  - `profile`: object - current profile data
  - `onSuccess`: function - callback after successful update
- **Features**:
  - Pre-filled form with current profile data
  - Form validation for required fields
  - Number conversion for phone, weight, height
  - Loading state during API call

### 2. AddFamilyMemberModal.jsx
- **Path**: `/src/components/Profile/AddFamilyMemberModal.jsx`
- **Props**:
  - `isOpen`: boolean
  - `onClose`: function
  - `onSuccess`: function
- **Features**:
  - Simple one-step form
  - Form validation for required fields
  - Form reset on modal close
  - Direct submission without OTP verification

### 3. EditFamilyMemberModal.jsx
- **Path**: `/src/components/Profile/EditFamilyMemberModal.jsx`
- **Props**:
  - `isOpen`: boolean
  - `onClose`: function
  - `member`: object - family member data to edit
  - `onSuccess`: function
- **Features**:
  - Same structure as EditProfileModal
  - Pre-filled with family member data
  - Updates using patient update API

### 4. ProfileModals.css
- **Path**: `/src/components/Profile/ProfileModals.css`
- **Features**:
  - Responsive modal design (max-width: 800px)
  - Form styling with focus states
  - Mobile-responsive adjustments

## API Service Methods Added

### appointmentService.js
```javascript
// Update patient information
updatePatient: async (patientData) => {
    return apiRequest('/patients', 'PUT', patientData);
}

// Add family member relationship
addFamilyMember: async (memberData) => {
    return apiRequest('/patients/relationships', 'POST', memberData);
}

// Delete family member relationship
deleteFamilyMember: async (patientId) => {
    return apiRequest(`/patients/relationships/${patientId}`, 'DELETE');
}
```

## UI Updates

### ProfilePage.jsx Changes
1. **New State Variables**:
   - `isEditProfileModalOpen`
   - `isAddFamilyMemberModalOpen`
   - `isEditFamilyMemberModalOpen`
   - `selectedFamilyMember`

2. **New Handler Functions**:
   - `handleEditProfile()`
   - `handleEditProfileSuccess()`
   - `handleAddFamilyMember()`
   - `handleAddFamilyMemberSuccess()`
   - `handleEditFamilyMember(member)`
   - `handleEditFamilyMemberSuccess()`

3. **UI Enhancements**:
   - "Chỉnh sửa" button in Account tab header
   - "Thêm thành viên" button in Family tab header
   - Updated "EDIT" button functionality on family member cards
   - Modal components integrated at bottom of component

## Data Flow

### Update Profile Flow
1. User clicks "Chỉnh sửa" button → Opens EditProfileModal
2. Form pre-filled with current profile data
3. User modifies fields and submits
4. API call to `PUT /api/patients`
5. On success: Profile reloaded, modal closed, toast notification
6. On error: Error toast displayed

### Add Family Member Flow
1. User clicks "Thêm thành viên" → Opens AddFamilyMemberModal
2. User fills member information form
3. Form submitted → API call to `POST /api/patients/relationships`
4. On success: Family list reloaded, modal closed, toast notification
5. On error: Error toast displayed, user can retry

### Edit Family Member Flow
1. User clicks "EDIT" on family member card → Opens EditFamilyMemberModal
2. Form pre-filled with member data
3. User modifies fields and submits
4. API call to `PUT /api/patients`
5. On success: Family list reloaded, modal closed, toast notification
6. On error: Error toast displayed

## Request/Response Examples

### Update Patient
**Request:**
```json
{
  "id": 49,
  "phone": 1111111111,
  "email": "user@gmail.com",
  "fullName": "Nguyen Van A",
  "address": "123 Street, City",
  "cccd": "001204020080",
  "birth": "2000-08-15",
  "gender": "NAM",
  "bloodType": "O",
  "weight": 60.5,
  "height": 176.2,
  "profileImage": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "data": {
    "id": 49,
    "code": "BN1758267777182",
    "bloodType": "O",
    "weight": 60.5,
    "height": 176.2,
    "fullName": "Nguyen Van A",
    "phone": "1111111111",
    "address": "123 Street, City",
    "cccd": "001204020080",
    "birth": "2000-08-15",
    "gender": "NAM"
  },
  "message": "Update patient successfully"
}
```

### Add Family Member
**Request:**
```json
{
  "phone": 1234567890,
  "email": "member@gmail.com",
  "fullName": "Nguyen Van B",
  "address": "456 Avenue",
  "birth": "1995-05-20",
  "gender": "NU"
}
```

**Response:**
```json
{
  "data": {
    "id": 50,
    "code": "BN1758267777183",
    "fullName": "Nguyen Van B"
  },
  "message": "add relationship successfully"
}
```


## Form Validation

### Required Fields
- Full name (*)
- Date of birth (*)
- Gender (*)
- Phone (*) - for adding family member

### Optional Fields
- Email
- CCCD/CMND
- Blood type (A, B, AB, O)
- Weight (kg) - decimal allowed
- Height (cm) - decimal allowed
- Address
- Profile image URL

### Data Type Conversions
- Phone: String → Number (parseInt)
- Weight: String → Number (parseFloat)
- Height: String → Number (parseFloat)
- Birth: Date input → YYYY-MM-DD string

## Styling Notes

### Modal Dimensions
- Max width: 800px
- Max height: 90vh
- Overflow-y: auto (for scrolling)

### Responsive Behavior
- Desktop: Full modal with side-by-side fields (col-md-6)
- Mobile: Stacked fields (col-md-12 behavior)
- Modal width: 95% on mobile

### Visual Feedback
- Required fields marked with red asterisk (*)
- Form controls have blue focus border (#1e88e5)
- Loading states disable buttons and show "Đang xử lý..." text
- Success/error toasts for user feedback

## Testing Checklist

- [x] Build passes without errors
- [ ] Edit profile modal opens and closes correctly
- [ ] Profile update saves and refreshes data
- [ ] Add family member modal opens and submits correctly
- [ ] Family member list refreshes after adding
- [ ] Edit family member modal pre-fills data correctly
- [ ] Family member update saves correctly
- [ ] All form validations work
- [ ] Error handling displays appropriate messages
- [ ] Mobile responsive layout works

## Future Enhancements

1. **Image Upload**: Implement file upload instead of URL input for profile images
2. **Relationship Type**: Add relationship field (BAN_THAN, BO, ME, CON, VO, CHONG) to add family member form
3. **Delete Family Member**: Implement delete functionality using the DELETE endpoint
4. **Form Validation**: Add more robust validation (phone format, CCCD format, etc.)
5. **Image Preview**: Show profile image preview in modals
6. **Auto-save**: Implement auto-save for form fields
7. **Undo Changes**: Add confirmation before closing modal with unsaved changes

## Dependencies

- React (hooks: useState, useEffect)
- react-router-dom (useNavigate)
- sonner (toast notifications)
- bootstrap (grid system, form controls)
- bootstrap-icons (icons)

## Files Modified/Created

### Created:
- `/src/components/Profile/EditProfileModal.jsx`
- `/src/components/Profile/AddFamilyMemberModal.jsx`
- `/src/components/Profile/EditFamilyMemberModal.jsx`
- `/src/components/Profile/ProfileModals.css`
- `/src/components/Profile/index.js`
- `/docs/PROFILE_MANAGEMENT_FEATURE.md`

### Modified:
- `/src/services/appointmentService.js` - Added 4 new API methods
- `/src/pages/ProfilePage.jsx` - Integrated modals and handlers

## Troubleshooting

### Common Issues

1. **Modal not opening**: Check if state variables are properly initialized
2. **Form not submitting**: Verify required fields are filled
3. **Update not reflecting**: Ensure onSuccess callback is refreshing data
4. **API errors**: Check network tab for detailed error messages

### Debug Tips

1. Check console for error messages
2. Verify API responses in Network tab
3. Ensure authentication token is valid
4. Check that all required fields have values
5. Verify data type conversions are working correctly

