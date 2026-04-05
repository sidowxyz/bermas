const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const xlsx = require('xlsx');
const twilio = require('twilio');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Data storage files
const DATA_DIR = './data';
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

// Initialize data directory and files
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Initialize data files with sample data
function initializeDataFiles() {
    // Sample users
    const sampleUsers = [
        { id: 1, username: 'upload_officer', password: 'password123', role: 'upload' },
        { id: 2, username: 'verify_officer', password: 'password123', role: 'verify' },
        { id: 3, username: 'director', password: 'password123', role: 'director' },
        { id: 4, username: 'admin', password: 'password123', role: 'admin' }
    ];

    // Sample students with simplified roll numbers
    const sampleStudents = [
        {
            id: 1,
            roll_number: '1234',
            full_name: 'Ahmed Mohamed Hassan Ali',
            mother_name: 'Fatima Omar Yusuf',
            gender: 'M',
            district: 'Hodan',
            school_name: 'Geedi Ugaas Secondary',
            exam_center: 'JUS',
            phone_number: '+252617223174',
            arabic: 72,
            social_studies: 68,
            math: 75,
            technology: 80,
            english: 70,
            science: 85,
            islamic_studies: 78,
            somali: 65,
            total: 593,
            average: 'B-',
            result: 'Pass',
            status: 'approved',
            created_at: new Date().toISOString()
        },
        {
            id: 2,
            roll_number: '1235',
            full_name: 'Sahra Abdi Mohamud Farah',
            mother_name: 'Halima Ali Omar',
            gender: 'F',
            district: 'Wadajir',
            school_name: 'Al-Azhar Secondary',
            exam_center: 'AZH',
            phone_number: '+252617223174',
            arabic: 85,
            social_studies: 78,
            math: 82,
            technology: 88,
            english: 79,
            science: 91,
            islamic_studies: 83,
            somali: 76,
            total: 662,
            average: 'A-',
            result: 'Pass',
            status: 'approved',
            created_at: new Date().toISOString()
        },
        {
            id: 3,
            roll_number: '1236',
            full_name: 'Omar Hassan Abdullahi Said',
            mother_name: 'Amina Mohamed Ibrahim',
            gender: 'M',
            district: 'Kaxda',
            school_name: 'Unity Secondary',
            exam_center: 'UNT',
            phone_number: '+252617223174',
            arabic: 45,
            social_studies: 42,
            math: 38,
            technology: 55,
            english: 48,
            science: 52,
            islamic_studies: 44,
            somali: 40,
            total: 364,
            average: 'D+',
            result: 'Pass',
            status: 'approved',
            created_at: new Date().toISOString()
        },
        {
            id: 4,
            roll_number: '1237',
            full_name: 'Khadija Ali Omar Hussein',
            mother_name: 'Mariam Hassan Ahmed',
            gender: 'F',
            district: 'Daynile',
            school_name: 'Hope Secondary',
            exam_center: 'HPE',
            phone_number: '+252617223174',
            arabic: 25,
            social_studies: 28,
            math: 22,
            technology: 35,
            english: 30,
            science: 38,
            islamic_studies: 32,
            somali: 26,
            total: 236,
            average: 'E',
            result: 'Fail',
            status: 'approved',
            created_at: new Date().toISOString()
        }
    ];

    // Initialize files if they don't exist
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify(sampleUsers, null, 2));
    }
    
    if (!fs.existsSync(STUDENTS_FILE)) {
        fs.writeFileSync(STUDENTS_FILE, JSON.stringify(sampleStudents, null, 2));
    }
    
    if (!fs.existsSync(SESSIONS_FILE)) {
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify([], null, 2));
    }
}

// Helper functions for data management
function readJSONFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
}

function writeJSONFile(filename, data) {
    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        return false;
    }
}

function getTwilioClient() {
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
        return null;
    }
    return twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

function normalizePhoneNumber(phoneNumber) {
    if (!phoneNumber) {
        return '';
    }

    const trimmed = String(phoneNumber).trim();
    if (trimmed.startsWith('+')) {
        return trimmed;
    }

    const digits = trimmed.replace(/\D/g, '');
    if (digits.startsWith('252')) {
        return `+${digits}`;
    }
    if (digits.startsWith('0')) {
        return `+252${digits.slice(1)}`;
    }
    if (digits.length === 9) {
        return `+252${digits}`;
    }

    return `+${digits}`;
}

function getGradeFromScore(score) {
    if (score >= 90) return 'A';
    if (score >= 85) return 'A-';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'B-';
    if (score >= 65) return 'C+';
    if (score >= 60) return 'C';
    if (score >= 55) return 'C-';
    if (score >= 50) return 'D+';
    if (score >= 40) return 'D';
    if (score >= 35) return 'D-';
    return 'E';
}

function buildDetailedSms(student, isSomali) {
    if (isSomali) {
        return [
            'Maamulka Waxbarashada Gobalka Banaadir',
            'Natiijooyinka Imtixaanka Sanadka Waxbarasho 2025/2026',
            '',
            `Magaca Buuxa: ${student.full_name}`,
            `Lambarka Diiwaangelinta: ${student.roll_number}`,
            `Magaca Hooyadeed: ${student.mother_name}`,
            `Magaca Dugsiga: ${student.school_name}`,
            `Xarunta Imtixaanka: ${student.exam_center}`,
            `Celceliska: ${student.average}`,
            `Go'aanka: ${student.result === 'Pass' ? 'Guul' : 'Dhicis'}`,
            '',
            'DARAJOOYINKA MAADOOYINKA:',
            `Diinta Islaamka ${getGradeFromScore(student.islamic_studies)} Taariikhda/Bulshada ${getGradeFromScore(student.social_studies)}`,
            `Carabi ${getGradeFromScore(student.arabic)} Sayniska ${getGradeFromScore(student.science)}`,
            `Soomaali ${getGradeFromScore(student.somali)} Ingiriisi ${getGradeFromScore(student.english)}`,
            `Xisaabta ${getGradeFromScore(student.math)} Tignoolajiyada ${getGradeFromScore(student.technology)}`,
            '',
            'Waad ku mahadsantahay Adeegga Natiijooyinka Imtixaanka.'
        ].join('\n');
    }

    return [
        'Banadir Regional Education Directorate',
        'Exam Results for Academic year 2025/2026',
        '',
        `Full name: ${student.full_name}`,
        `Roll Number: ${student.roll_number}`,
        `Mother's full name: ${student.mother_name}`,
        `School Name: ${student.school_name}`,
        `Examination Center: ${student.exam_center}`,
        `Average: ${student.average}`,
        `Decision: ${student.result}`,
        '',
        'SUBJECT GRADES:',
        `Islamic Studies ${getGradeFromScore(student.islamic_studies)} Social Studies ${getGradeFromScore(student.social_studies)}`,
        `Arabic ${getGradeFromScore(student.arabic)} Science ${getGradeFromScore(student.science)}`,
        `Somali ${getGradeFromScore(student.somali)} English ${getGradeFromScore(student.english)}`,
        `Math ${getGradeFromScore(student.math)} Technology ${getGradeFromScore(student.technology)}`,
        '',
        'Thank you for using Exam Results Service.'
    ].join('\n');
}

async function sendResultSms(student, phoneNumber, isSomali) {
    const client = getTwilioClient();
    const from = process.env.TWILIO_PHONE_NUMBER;

    if (!client || !from) {
        throw new Error('Twilio is not configured');
    }

    const to = normalizePhoneNumber(phoneNumber);
    if (!to || to === '+') {
        throw new Error('A valid phone number is required');
    }

    await client.messages.create({
        from,
        to,
        body: buildDetailedSms(student, isSomali)
    });

    return to;
}

// Initialize data on startup
initializeDataFiles();

// File upload setup
const upload = multer({ dest: 'uploads/' });

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// USSD Simulation Routes
app.post('/ussd', async (req, res) => {
    const { sessionId, phoneNumber, text } = req.body;
    let response = '';

    // Check if user pressed 0 to go back
    const parts = text.split('*');
    const lastInput = parts[parts.length - 1];
    const goHome = lastInput === '0' && text !== '';

    // Detect language: first choice is 1=Somali, 2=English
    const lang = parts[0]; // '1' = Somali, '2' = English
    const isSomali = lang === '1';
    // After language, the menu path starts from parts[1]
    const menuPath = parts.slice(1);

    if (text === '' || goHome) {
        // Language selection
        response = `CON Soo dhawoow / Welcome
Maamulka Waxbarashada Gobalka Banaadir
Banadir Regional Education

1) Soomaali
2) English`;
    } else if (text === '1' || text === '2') {
        // Main menu after language
        if (isSomali) {
            response = `CON Adeegga Hubinta Natiijooyinka Imtixaanka
1) Hubi Guul/Dhicis (Shaashadda)
2) Hel Natiijo Faahfaahsan (SMS)
3) Sida loo isticmaalo & Nidaamka

0) Dib u noqo`;
        } else {
            response = `CON Exam Results Service
1) Check Pass/Fail (On-screen)
2) Get Detailed Results via SMS
3) How to use & Grading system

0) Back`;
        }
    } else if (menuPath.length === 1 && menuPath[0] === '1') {
        // Option 1: Enter roll number
        if (isSomali) {
            response = `CON Geli Lambarka Diiwaangelintaada
(tusaale: 1234):

0) Dib u noqo`;
        } else {
            response = `CON Enter your Roll Number
(e.g., 1234):

0) Back`;
        }
    } else if (menuPath.length === 1 && menuPath[0] === '2') {
        // Option 2: Enter roll number for SMS
        if (isSomali) {
            response = `CON Geli Lambarka Diiwaangelintaada
si aad u hesho natiijo SMS:

0) Dib u noqo`;
        } else {
            response = `CON Enter your Roll Number
for detailed SMS results:

0) Back`;
        }
    } else if (menuPath.length === 1 && menuPath[0] === '3') {
        // Option 3: Guidelines
        if (isSomali) {
            response = `CON Nidaamka Darajada:
A (90-100) - Aad u fiican
B+ (75-89) - Fiican
C+ (60-74) - Dhexdhexaad
D (40-59) - Guul yar
E (0-39) - Guul darro

0) Dib u noqo`;
        } else {
            response = `CON Grading System:
A (90-100) - Exceptional
B+ (75-89) - Very Good
C+ (60-74) - Satisfactory
D (40-59) - Pass
E (0-39) - Ungraded

0) Back`;
        }
    } else if (menuPath.length === 2 && menuPath[0] === '1') {
        // Pass/Fail result
        const rollNumber = menuPath[1];
        const students = readJSONFile(STUDENTS_FILE);
        const student = students.find(s => s.roll_number === rollNumber && s.status === 'approved');

        if (!student) {
            if (isSomali) {
                response = `CON Lambarka waa khalad.
Fadlan geli lambar sax ah
(tusaale: 1234)

0) Dib u noqo`;
            } else {
                response = `CON Invalid Roll Number.
Please enter a valid number
(e.g., 1234)

0) Back`;
            }
        } else {
            if (isSomali) {
                response = `CON Lambarka: ${student.roll_number}
Magaca: ${student.full_name}
Dugsi: ${student.school_name}
Xarun: ${student.exam_center}
Celceliska: ${student.average}
Natiijo: ${student.result === 'Pass' ? 'Guul' : 'Dhicis'}

0) Dib u noqo`;
            } else {
                response = `CON Roll No: ${student.roll_number}
Name: ${student.full_name}
School: ${student.school_name}
Center: ${student.exam_center}
Average: ${student.average}
Result: ${student.result}

0) Back`;
            }
        }
    } else if (menuPath.length === 2 && menuPath[0] === '2') {
        // SMS results
        const rollNumber = menuPath[1];
        const students = readJSONFile(STUDENTS_FILE);
        const student = students.find(s => s.roll_number === rollNumber && s.status === 'approved');

        if (!student) {
            if (isSomali) {
                response = `CON Lambarka waa khalad.
Fadlan geli lambar sax ah
(tusaale: 1234)

0) Dib u noqo`;
            } else {
                response = `CON Invalid Roll Number.
Please enter a valid number
(e.g., 1234)

0) Back`;
            }
        } else {
            try {
                const recipient = await sendResultSms(student, student.phone_number, isSomali);
                const sessions = readJSONFile(SESSIONS_FILE);
                sessions.push({ sessionId, phoneNumber: recipient, rollNumber, step: 'sms_sent', timestamp: new Date().toISOString() });
                writeJSONFile(SESSIONS_FILE, sessions);

                if (isSomali) {
                    response = `CON SMS waa loo diray ${recipient}.
Hubi fariimaha natiijadaada.

Waad ku mahadsantahay.

0) Dib u noqo`;
                } else {
                    response = `CON SMS sent to ${recipient}.
Check messages for results.

Thank you for using BERMAS.

0) Back`;
                }
            } catch (error) {
                if (isSomali) {
                    response = `CON SMS lama diri karin.
Hubi lambarkaaga ama dejinta Twilio.

0) Dib u noqo`;
                } else {
                    response = `CON SMS could not be sent.
Check your phone number or Twilio setup.

0) Back`;
                }
            }
        }
    } else {
        if (isSomali) {
            response = `CON Ikhtiyaar khalad ah.
Fadlan dooro 1, 2, ama 3.

0) Dib u noqo`;
        } else {
            response = `CON Invalid option.
Please select 1, 2, or 3.

0) Back`;
        }
    }

    res.send(response);
});

// Admin API Routes
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/api/students', (req, res) => {
    try {
        const students = readJSONFile(STUDENTS_FILE);
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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

        const students = readJSONFile(STUDENTS_FILE);
        let maxId = students.length > 0 ? Math.max(...students.map(s => s.id)) : 0;
        let inserted = 0;
        let errors = [];

        data.forEach((row, index) => {
            const rollNumber = row['Roll Number'];
            if (!rollNumber) {
                errors.push(`Row ${index + 2}: Missing Roll Number`);
                return;
            }

            // Check if student already exists
            const existingIndex = students.findIndex(s => s.roll_number === rollNumber);
            
            const studentData = {
                id: existingIndex >= 0 ? students[existingIndex].id : ++maxId,
                roll_number: rollNumber,
                full_name: row['Student Full Name'] || '',
                mother_name: row["Mother's Name"] || '',
                gender: row['Gender'] || '',
                district: row['District'] || '',
                school_name: row['School Name'] || '',
                exam_center: row['Exam Center'] || '',
                arabic: parseInt(row['Arabic']) || 0,
                social_studies: parseInt(row['Social Studies']) || 0,
                math: parseInt(row['Math']) || 0,
                technology: parseInt(row['Technology']) || 0,
                english: parseInt(row['English']) || 0,
                science: parseInt(row['Science']) || 0,
                islamic_studies: parseInt(row['Islamic Studies']) || 0,
                somali: parseInt(row['Somali']) || 0,
                total: parseInt(row['Total']) || 0,
                average: row['Average'] || '',
                result: row['Result'] || '',
                status: 'pending',
                created_at: existingIndex >= 0 ? students[existingIndex].created_at : new Date().toISOString()
            };

            if (existingIndex >= 0) {
                students[existingIndex] = studentData;
            } else {
                students.push(studentData);
            }
            inserted++;
        });

        // Save updated students data
        writeJSONFile(STUDENTS_FILE, students);

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        res.json({ 
            message: `Upload completed. ${inserted} records processed.`,
            errors: errors
        });

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
    console.log(`🚀 BERMAS USSD Prototype Server running on http://localhost:${PORT}`);
    console.log(`📱 USSD Simulator: http://localhost:${PORT}`);
    console.log(`🔧 Admin Dashboard: http://localhost:${PORT}/admin`);
});
