# BERMAS USSD Prototype
**Banadir Exam Results Mobile Access System**

A web-based prototype simulating the USSD system for accessing exam results in Somalia.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation
1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to:
- **USSD Simulator**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin

## 📱 How to Use

### USSD Simulator
1. Dial `*57001#` in the phone simulator
2. Select from 3 menu options:
   - **1** - Check Pass/Fail (On-screen display)
   - **2** - Receive Detailed Results via SMS
   - **3** - How to use & grading system

### Test Roll Numbers
- `B2650011` - Ahmed Mohamed (Pass - Good)
- `B2650012` - Sahra Abdi (Pass - Excellent) 
- `B2650013` - Omar Hassan (Pass - Below Average)
- `B2650014` - Khadija Ali (Fail)

### Admin Dashboard
- Upload Excel files with student results
- View all student records
- Manage verification workflow
- Monitor system statistics

## 🏗️ Architecture

### Backend (Node.js + Express)
- `/ussd` - USSD request handling
- `/api/students` - Student data management
- `/api/students/upload` - Excel file upload

### Database (SQLite)
- `users` - Admin user accounts
- `students` - Student exam results
- `ussd_sessions` - USSD session tracking

### Frontend
- USSD Simulator (Mobile phone interface)
- Admin Dashboard (Result management)

## 📋 Features Implemented

✅ **Core USSD Features**
- 3-option menu system (`*57001#`)
- Roll number validation
- Pass/Fail on-screen display
- SMS simulation for detailed results
- Usage guidelines display

✅ **Admin Features**
- Excel file upload (.xlsx, .xls)
- Student record management
- Dashboard statistics
- Role-based access structure

✅ **Data Management**
- SQLite database with sample data
- 30-column Excel template support
- Result status workflow (pending/approved)
- Grade calculation system

## 📊 Excel Template Format

Required columns (30 total):
1. Serial Number
2. Roll Number
3. Student Full Name
4. Mother's Name
5. Gender
6. District
7. School Name
8. Exam Center
9-16. Subject scores (Arabic, Social Studies, Math, Technology, English, Science, Islamic Studies, Somali)
17. Total
18. Average
19. Result
20-27. Subject grades
28. Total
29. Average
30. Result

## 🔐 Security Features

- Role-based access control (RBAC)
- Input validation for roll numbers
- File upload restrictions
- Session management for USSD

## 🎯 PRD Requirements Addressed

### Business Requirements
- ✅ BR-01: SMS and USSD result requests via Roll Number
- ✅ BR-02: Input validation and completeness checks
- ✅ BR-03: Examination result retrieval from database
- ✅ BR-04: Result delivery via SMS/USSD based on selection
- ✅ BR-08: Structured USSD menu interface
- ✅ BR-09: Only approved results accessible
- ✅ BR-12: Standardized response messages

### System Rules
- ✅ BR-Rule-01: Valid Roll Number requirement (B26XXXXX format)
- ✅ BR-Rule-02: One result per Roll Number
- ✅ BR-Rule-03: SMS character limit consideration
- ✅ BR-Rule-04: Official authorization required
- ✅ BR-Rule-05: Error handling for invalid inputs

## 🚦 System Status

**Development Complete**: Core USSD functionality with admin interface
**Testing**: Ready for user acceptance testing
**Deployment**: Local development server ready

## 📞 Contact & Support

For questions about the BERMAS system:
- Technical: System Administrator
- Business: Banadir Regional Education Directorate

## 📝 Next Steps for Production

1. **Real USSD Integration**: Connect to actual telecom USSD gateways
2. **SMS Gateway**: Implement real SMS sending capability  
3. **Production Database**: Replace SQLite with PostgreSQL/MySQL
4. **Authentication**: Implement secure login system
5. **Load Balancing**: Handle high concurrent users
6. **Monitoring**: Add logging and performance monitoring
7. **Backup**: Implement automated database backups
