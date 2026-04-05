const twilio = require('twilio');

const students = [
    { id: 1, roll_number: '1234', full_name: 'Ahmed Mohamed Hassan Ali', mother_name: 'Fatima Omar Yusuf', school_name: 'Geedi Ugaas Secondary', exam_center: 'JUS', phone_number: '+252617223174', average: 'B-', result: 'Pass', status: 'approved' },
    { id: 2, roll_number: '1235', full_name: 'Sahra Abdi Mohamud Farah', mother_name: 'Halima Ali Omar', school_name: 'Al-Azhar Secondary', exam_center: 'AZH', phone_number: '+252617223174', average: 'A-', result: 'Pass', status: 'approved' },
    { id: 3, roll_number: '1236', full_name: 'Omar Hassan Abdullahi Said', mother_name: 'Amina Mohamed Ibrahim', school_name: 'Unity Secondary', exam_center: 'UNT', phone_number: '+252617223174', average: 'D+', result: 'Pass', status: 'approved' },
    { id: 4, roll_number: '1237', full_name: 'Khadija Ali Omar Hussein', mother_name: 'Mariam Hassan Ahmed', school_name: 'Hope Secondary', exam_center: 'HPE', phone_number: '+252617223174', average: 'E', result: 'Fail', status: 'approved' }
];

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
    // Add subject scores for detailed SMS (using sample data for Netlify function)
    const studentWithSubjects = {
        ...student,
        islamic_studies: 78,
        social_studies: 68,
        arabic: 72,
        science: 85,
        somali: 65,
        english: 70,
        math: 75,
        technology: 80
    };

    if (isSomali) {
        return [
            'Maamulka Waxbarashada Gobalka Banaadir',
            'Natiijooyinka Imtixaanka Sanadka Waxbarasho 2025/2026',
            '',
            `Magaca Buuxa: ${studentWithSubjects.full_name}`,
            `Lambarka Diiwaangelinta: ${studentWithSubjects.roll_number}`,
            `Magaca Hooyadeed: ${studentWithSubjects.mother_name}`,
            `Magaca Dugsiga: ${studentWithSubjects.school_name}`,
            `Xarunta Imtixaanka: ${studentWithSubjects.exam_center}`,
            `Celceliska: ${studentWithSubjects.average}`,
            `Go'aanka: ${studentWithSubjects.result === 'Pass' ? 'Guul' : 'Dhicis'}`,
            '',
            'DARAJOOYINKA MAADOOYINKA:',
            `Diinta Islaamka ${getGradeFromScore(studentWithSubjects.islamic_studies)} Taariikhda/Bulshada ${getGradeFromScore(studentWithSubjects.social_studies)}`,
            `Carabi ${getGradeFromScore(studentWithSubjects.arabic)} Sayniska ${getGradeFromScore(studentWithSubjects.science)}`,
            `Soomaali ${getGradeFromScore(studentWithSubjects.somali)} Ingiriisi ${getGradeFromScore(studentWithSubjects.english)}`,
            `Xisaabta ${getGradeFromScore(studentWithSubjects.math)} Tignoolajiyada ${getGradeFromScore(studentWithSubjects.technology)}`,
            '',
            'Waad ku mahadsantahay Adeegga Natiijooyinka Imtixaanka.'
        ].join('\n');
    }

    return [
        'Banadir Regional Education Directorate',
        'Exam Results for Academic year 2025/2026',
        '',
        `Full name: ${studentWithSubjects.full_name}`,
        `Roll Number: ${studentWithSubjects.roll_number}`,
        `Mother's full name: ${studentWithSubjects.mother_name}`,
        `School Name: ${studentWithSubjects.school_name}`,
        `Examination Center: ${studentWithSubjects.exam_center}`,
        `Average: ${studentWithSubjects.average}`,
        `Decision: ${studentWithSubjects.result}`,
        '',
        'SUBJECT GRADES:',
        `Islamic Studies ${getGradeFromScore(studentWithSubjects.islamic_studies)} Social Studies ${getGradeFromScore(studentWithSubjects.social_studies)}`,
        `Arabic ${getGradeFromScore(studentWithSubjects.arabic)} Science ${getGradeFromScore(studentWithSubjects.science)}`,
        `Somali ${getGradeFromScore(studentWithSubjects.somali)} English ${getGradeFromScore(studentWithSubjects.english)}`,
        `Math ${getGradeFromScore(studentWithSubjects.math)} Technology ${getGradeFromScore(studentWithSubjects.technology)}`,
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

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { text, phoneNumber } = JSON.parse(event.body);
    let response = '';

    const parts = text.split('*');
    const lastInput = parts[parts.length - 1];
    const goHome = lastInput === '0' && text !== '';

    const lang = parts[0];
    const isSomali = lang === '1';
    const menuPath = parts.slice(1);

    if (text === '' || goHome) {
        response = `CON Soo dhawoow / Welcome
Maamulka Waxbarashada Gobalka Banaadir
Banadir Regional Education

1) Soomaali
2) English`;
    } else if (text === '1' || text === '2') {
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
        const rollNumber = menuPath[1];
        const student = students.find(s => s.roll_number === rollNumber && s.status === 'approved');

        if (!student) {
            response = isSomali
                ? `CON Lambarka waa khalad.\nFadlan geli lambar sax ah\n(tusaale: 1234)\n\n0) Dib u noqo`
                : `CON Invalid Roll Number.\nPlease enter a valid number\n(e.g., 1234)\n\n0) Back`;
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
        const rollNumber = menuPath[1];
        const student = students.find(s => s.roll_number === rollNumber && s.status === 'approved');

        if (!student) {
            response = isSomali
                ? `CON Lambarka waa khalad.\nFadlan geli lambar sax ah\n(tusaale: 1234)\n\n0) Dib u noqo`
                : `CON Invalid Roll Number.\nPlease enter a valid number\n(e.g., 1234)\n\n0) Back`;
        } else {
            try {
                const recipient = await sendResultSms(student, student.phone_number, isSomali);
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
        response = isSomali
            ? `CON Ikhtiyaar khalad ah.\nFadlan dooro 1, 2, ama 3.\n\n0) Dib u noqo`
            : `CON Invalid option.\nPlease select 1, 2, or 3.\n\n0) Back`;
    }

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/plain' },
        body: response
    };
};
