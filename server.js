const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const xlsx = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = new sqlite3.Database('./bermas.db');

// Initialize database tables
db.serialize(() => {
    // Users table for role-based access
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Students table
    db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        roll_number TEXT UNIQUE,
        full_name TEXT,
        mother_name TEXT,
        gender TEXT,
        district TEXT,
        school_name TEXT,
        exam_center TEXT,
        arabic INTEGER,
        social_studies INTEGER,
        math INTEGER,
        technology INTEGER,
        english INTEGER,
        science INTEGER,
        islamic_studies INTEGER,
        somali INTEGER,
        total INTEGER,
        average TEXT,
        result TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // USSD sessions table
    db.run(`CREATE TABLE IF NOT EXISTS ussd_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT UNIQUE,
        phone_number TEXT,
        current_step TEXT,
        roll_number TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert sample data
    db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES 
        ('upload_officer', 'password123', 'upload'),
        ('verify_officer', 'password123', 'verify'),
        ('director', 'password123', 'director'),
        ('admin', 'password123', 'admin')`);

    // Insert sample student data
    db.run(`INSERT OR IGNORE INTO students (
        roll_number, full_name, mother_name, gender, district, school_name, exam_center,
        arabic, social_studies, math, technology, english, science, islamic_studies, somali,
        total, average, result, status
    ) VALUES 
        ('B2650011', 'Ahmed Mohamed Hassan Ali', 'Fatima Omar Yusuf', 'M', 'Hodan', 'Geedi Ugaas Secondary', 'JUS', 
         72, 68, 75, 80, 70, 85, 78, 65, 593, 'B-', 'Pass', 'approved'),
        ('B2650012', 'Sahra Abdi Mohamud Farah', 'Halima Ali Omar', 'F', 'Wadajir', 'Al-Azhar Secondary', 'AZH',
         85, 78, 82, 88, 79, 91, 83, 76, 662, 'A-', 'Pass', 'approved'),
        ('B2650013', 'Omar Hassan Abdullahi Said', 'Amina Mohamed Ibrahim', 'M', 'Kaxda', 'Unity Secondary', 'UNT',
         45, 42, 38, 55, 48, 52, 44, 40, 364, 'D+', 'Pass', 'approved'),
        ('B2650014', 'Khadija Ali Omar Hussein', 'Mariam Hassan Ahmed', 'F', 'Daynile', 'Hope Secondary', 'HPE',
         25, 28, 22, 35, 30, 38, 32, 26, 236, 'E', 'Fail', 'approved')`);
});

// File upload setup
const upload = multer({ dest: 'uploads/' });

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// USSD Simulation Routes
app.post('/ussd', (req, res) => {
    const { sessionId, phoneNumber, text } = req.body;
    let response = '';

    if (text === '') {
        // Initial USSD menu
        response = `CON Banadir Regional Education Directorate
Welcome to Exam Results Service
1) Check Pass/Fail (On-screen display)
2) Receive Detailed Results via SMS
3) How to use this service & grading system?`;
    } else if (text === '1') {
        response = `CON Enter your Roll Number (e.g., B2650011):`;
    } else if (text === '2') {
        response = `CON Enter your Roll Number for detailed SMS results:`;
    } else if (text === '3') {
        response = `END How to use this service:
- Option 1: View Pass/Fail result on screen
- Option 2: Receive detailed results via SMS

Grading System:
A (90-100) - Exceptional
A- (80-89) - Excellent
B+ (75-79) - Very Good
B (70-74) - Good
B- (65-69) - Moderately Good
C+ (60-64) - Satisfactory
C (55-59) - Above Average
C- (50-54) - Average
D+ (45-49) - Below Average
D (40-44) - Pass
D- (35-39) - Minimum Pass
E (0-34) - Ungraded`;
    } else if (text.startsWith('1*')) {
        // Check Pass/Fail
        const rollNumber = text.split('*')[1];
        db.get(`SELECT * FROM students WHERE roll_number = ? AND status = 'approved'`, [rollNumber], (err, row) => {
            if (err || !row) {
                response = `END Invalid Roll Number entered. 
Please enter a valid Student Registration Number 
(e.g., B2650011) - Try again`;
            } else {
                response = `END Roll Number: ${row.roll_number}
Full Name: ${row.full_name}
School Name: ${row.school_name}
Examination Center: ${row.exam_center}
Average: ${row.average}
Result: ${row.result}`;
            }
            res.send(response);
        });
        return;
    } else if (text.startsWith('2*')) {
        // Detailed SMS Results
        const rollNumber = text.split('*')[1];
        db.get(`SELECT * FROM students WHERE roll_number = ? AND status = 'approved'`, [rollNumber], (err, row) => {
            if (err || !row) {
                response = `END Invalid Roll Number entered. 
Please enter a valid Student Registration Number 
(e.g., B2650011) - Try again`;
            } else {
                // Store SMS to be sent (simulated)
                const smsContent = `Banadir Regional Education Directorate
Exam Results for Academic year 2025/2026
Full name: ${row.full_name}
Roll Number: ${row.roll_number}
Mother's full name: ${row.mother_name}
School Name: ${row.school_name}
Examination Center: ${row.exam_center}
Average: ${row.average}
Decision: ${row.result}

Subject Grade  Subject Grade
Islamic Studies ${getGradeFromScore(row.islamic_studies)} Social Studies ${getGradeFromScore(row.social_studies)}
Arabic ${getGradeFromScore(row.arabic)} Science ${getGradeFromScore(row.science)}
Somalia ${getGradeFromScore(row.somali)} English ${getGradeFromScore(row.english)}
Math ${getGradeFromScore(row.math)} Technology ${getGradeFromScore(row.technology)}

Thank you for using Exam Results Service.`;
                
                // Store SMS in session for display
                db.run(`INSERT OR REPLACE INTO ussd_sessions (session_id, phone_number, current_step, roll_number) 
                       VALUES (?, ?, 'sms_sent', ?)`, [sessionId, phoneNumber, rollNumber]);
                
                response = `END SMS with detailed results has been sent to your phone number.
Check your messages for complete results.

Thank you for using Exam Results Service.`;
            }
            res.send(response);
        });
        return;
    } else {
        response = `END Invalid option. Please dial *57001# again and select a valid option (1, 2, or 3).`;
    }

    res.send(response);
});

// Admin API Routes
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/api/students', (req, res) => {
    db.all(`SELECT * FROM students ORDER BY created_at DESC`, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/students/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        let inserted = 0;
        let errors = [];

        data.forEach((row, index) => {
            const rollNumber = row['Roll Number'];
            if (!rollNumber) {
                errors.push(`Row ${index + 2}: Missing Roll Number`);
                return;
            }

            db.run(`INSERT OR REPLACE INTO students (
                roll_number, full_name, mother_name, gender, district, school_name, exam_center,
                arabic, social_studies, math, technology, english, science, islamic_studies, somali,
                total, average, result, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                rollNumber,
                row['Student Full Name'] || '',
                row["Mother's Name"] || '',
                row['Gender'] || '',
                row['District'] || '',
                row['School Name'] || '',
                row['Exam Center'] || '',
                row['Arabic'] || 0,
                row['Social Studies'] || 0,
                row['Math'] || 0,
                row['Technology'] || 0,
                row['English'] || 0,
                row['Science'] || 0,
                row['Islamic Studies'] || 0,
                row['Somali'] || 0,
                row['Total'] || 0,
                row['Average'] || '',
                row['Result'] || '',
            ], (err) => {
                if (err) {
                    errors.push(`Row ${index + 2}: ${err.message}`);
                } else {
                    inserted++;
                }
            });
        });

        setTimeout(() => {
            res.json({ 
                message: `Upload completed. ${inserted} records processed.`,
                errors: errors
            });
        }, 1000);

    } catch (error) {
        res.status(500).json({ error: 'Error processing file: ' + error.message });
    }
});

// Helper function to convert score to grade
function getGradeFromScore(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    if (score >= 55) return 'C';
    if (score >= 50) return 'C-';
    if (score >= 45) return 'D+';
    if (score >= 40) return 'D';
    if (score >= 35) return 'D-';
    return 'E';
}

app.listen(PORT, () => {
    console.log(`BERMAS USSD Prototype Server running on http://localhost:${PORT}`);
});
