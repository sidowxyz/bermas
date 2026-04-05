BUSINESS REQUIREMENTS SPECIFICATION - BRS 
BANADIR EXAM RESULTS MOBILE ACCESS SYSTEM – BERMAS 
MOGADISHU  
SOMALIA 
FEBRUARY, 2026 
1 
2 
 
Table of Contents 
1.0.Background 
2.0.Business Objectives 
3.0. Scope 
4.0. Stakeholders 
5.0. Roles and Access Control for Examination Result System  
6.0. SMS AND USSD Requirements 
7.0. Banadir Exam Results Mobile Access System Rules 
8.0.Process Flow for SMS and USSD 
8.1.USSD Access and Menu Display 
8.2. Student Input and Request Handling 
8.3.Validation and Request Processing 
8.4. Result Retrieval and Processing 
8.5. Result Delivery (Based on Student Selection) 
9.0.  Workflow for Exam Result Publication 
10.0. High-Level Architecture 
11.0. Data Requirements 
11.1. Core Data Elements 
11.2. Data Upload Requirements 
11.3. Data Structure (Excel Template Format) 
12.0. Integration Requirements  
12.1.  High-Level Integration Process 
13.0. Non-Functional Requirements 
14.0. Assumptions 
15.0. Constraints 
16.0. Risks 
17.0. Glossary  
 
 
 
 
 
 
1.0.Background 
Access to examination results remains a challenge for many students due to limited internet 
connectivity, high mobile data costs, financial constraints, and restricted access to smartphones. 
These barriers particularly affect students from low-income households and internally displaced 
persons (IDP) communities, where reliance on web-based result platforms is not practical or 
equitable. 
To address these challenges, the Banadir Regional Administration proposes the implementation 
of a secure, reliable, and telecom-integrated SMS and USSD-based result dissemination system. 
The system will enable students and authorized stakeholders to access examination results using 
basic mobile phones without requiring internet access. 
By leveraging existing telecom infrastructure, the solution aims to improve accessibility, 
promote inclusivity, strengthen transparency, and enhance parental engagement in monitoring 
student academic performance. 
2.0.Business Objectives 
The Banadir Exam Results Mobile Access System shall: 
1. Provide secure and reliable access to examination results via SMS and USSD, without 
internet dependency.  
2. Support high-volume usage while maintaining performance and timely response for both 
SMS and USSD channels.  
3. Ensure confidentiality, integrity, and accuracy of all transmitted results.  
4. Maintain continuous availability (24/7), especially during official result release periods.  
5. Enable students and authorized stakeholders to access, monitor, and retrieve results with 
user-friendly SMS and USSD interactions. 
3.0. Scope 
The scope of the Banadir Exam Results Mobile Access System shall include the following: 
1. Support for SMS-based examination result requests initiated by users through mobile 
networks  
2. Student identification and validation using a unique Roll Number and, where applicable, 
a Student Registration Number (Reg. No.).  
3. Generation and delivery of automated SMS and USSD responses containing examination 
results  
4. Integration with telecommunication service providers to enable reliable message 
transmission and receipt 
5. The SMS and USSD functionality shall be embedded into the existing Banadir Regional 
Administration system. 
3 
4 
 
4.0. Stakeholders 
The Banadir Exam Results Mobile Access System shall involve the following stakeholders: 
1. Ministry of Education: Provides policy direction, oversight, and regulatory governance  
2. BRA and FMS Education Ministries: Support implementation and coordination at 
regional and state levels  
3. Examination Authority: Responsible for examination management, result generation, 
and data provision  
4. Students: Primary end users who request and receive examination results via SMS and 
USSD  
5. Schools: Facilitate student registration and act as intermediaries for communication and 
support  
6. Telecom Providers: Enable SMS and USSD transmission and ensure reliable network 
connectivity 
5.0. Roles and Access Control for Examination Result System  
The examination result system shall implement role-based access control (RBAC) to ensure that 
users can only perform actions authorized under their assigned roles.  
## Role Role Description Permissions (System Access Rights) 
1 
Uploading 
Officer (Result 
Submission 
Officer) 
Responsible for uploading, 
validating, and resubmitting 
examination results in Excel format 
based on verification feedback. - Upload examination result Excel files - Preview uploaded data before submission - Filter and validate uploaded data - Submit results for verification - Re-upload and replace Excel files - View rejection comments (read-only feedback) - Correct and resubmit updated files 
2 Verification 
Officer 
Responsible for reviewing, 
validating, and ensuring accuracy 
and integrity of examination results 
before approval. - View uploaded examination results (read-only) - Filter/search by student, subject, school, center, etc. - Verify examination results - Reject examination results - Provide rejection comments (feedback) - Review corrected resubmissions 
3 Senior Officer / 
Director General 
Responsible for final approval and 
authorization of verified examination 
results for publication. - View verified examination results (read-only) - Filter and analyze results (student, school, center, gender, etc.) - Review result summaries and detailed reports - Approve publication of results - Authorize official release to students 
4 System 
Administrator 
Responsible for system 
configuration, user management, and 
technical maintenance of the system. - Manage users and role assignments - Configure system workflows and settings - Monitor system logs and audit trails - Manage system security and performance - Maintain system availability and integrity 
 
 
6.0. SMS AND USSD Requirements 
The Banadir Exam Results Mobile Access System shall satisfy the following business 
requirements: 
 BR-01: The system shall enable students to request examination results via SMS and 
USSD channels using a valid Roll Number as the primary identifier. 
 BR-02: The system shall validate all user inputs for correctness and completeness prior 
to processing any request. 
 BR-03: Upon successful validation, the system shall retrieve the corresponding 
examination result from the centralized examination database. 
 BR-04: The system shall deliver examination results to the requesting user via SMS or 
USSD based on the selected service option. 
 BR-05: The system shall ensure high availability and reliability of the service, 
particularly during official examination result release periods. 
 BR-06: The system shall support an optional security mechanism requiring a Student 
Registration Number, National Identification Number, or PIN in addition to the Roll 
Number. 
 BR-07: The system shall support both SMS and USSD as service delivery channels. 
 BR-08: The system shall provide a structured USSD menu interface to enable users to 
navigate available services, including result inquiry and usage guidance. 
 BR-09: The system shall ensure that only officially approved and published examination 
results are accessible to users. 
 BR-10: The system shall support high volumes of concurrent user requests while 
maintaining acceptable response times and performance. 
 BR-11: The system shall integrate with telecommunications service providers through 
SMS and USSD gateway services to enable reliable request handling and response 
delivery. 
 BR-12: The system shall generate standardized and user-friendly response messages for 
both successful and unsuccessful requests. 
 BR-13: The system shall generate standardized, user-friendly responses, with the option 
to split messages: summary in SMS1 and details in SMS2. 
 BR-14: The system shall maintain logs of all SMS and USSD transactions for 
monitoring, audit, and reporting purposes. 
5 
7.0. Banadir Exam Results Mobile Access System Rules 
The system shall enforce the following business rules: 
 BR-Rule-01: A valid and recognized Roll Number (e.g., B26315009) shall be required to 
initiate any examination result request. 
 BR-Rule-02: Each request shall return only one examination result corresponding to a 
single student record. 
 BR-Rule-03: All SMS responses shall not exceed 160 characters per message. 
 BR-Rule-04: Examination results shall only be accessible after official authorization and 
release by the responsible authority. 
 BR-Rule-05: Any invalid, incomplete, or incorrectly formatted input shall result in 
rejection of the request and generation of an error message. 
 BR-Rule-06: Where enhanced security is enabled, access shall require both Roll Number 
and an additional credential (e.g., Student Registration Number, National ID, or PIN). 
 BR-Rule-07: Each SMS or USSD interaction may be subject to applicable 
telecommunications service charges. 
 BR-Rule-08: Only verified and approved examination results shall be eligible for 
publication and access. 
 BR-Rule-09: The system shall enforce the use of a standardized format for examination 
result data to ensure consistency and accuracy. 
 BR-Rule-10: The system shall prevent duplicate or conflicting examination result 
records for the same Roll Number. 
8.0.Process Flow for BERMAS (USSD/SMS) 
The system shall provide an integrated SMS and USSD-based service that enables students to 
access examination results through multiple channels based on user selection. 
8.1.USSD Access and Menu Display 
1. The student shall dial the USSD short code: *57xxx# from a mobile phone.  
2. The system shall display the following USSD menu:  
Banadir Regional Education Directorate  
Welcome to Exam Results Service  
1) Check Pass/Fail (On-screen display) 
2) Receive Detailed Results via SMS 
3) How to use this service & grading system? 
6 
8.2. Student Input and Request Handling 
3. The student shall select an option from the menu.  
4. The system shall prompt the student to enter their Roll Number (Student Examination 
Number).  
8.3.Validation and Request Processing 
5. The system shall forward the request through the telecom USSD and SMS gateway.  
6. The system shall validate the provided Roll Number:  
 If valid → proceed to result retrieval  
 If invalid → the system shall immediately display an error message on the USSD screen 
(e.g.: Invalid Roll Number entered. Please enter a valid Student Registration Number 
(e.g., B265001XX- Try again). 
8.4. Result Retrieval and Processing 
7. The system shall retrieve student examination results from the examination result 
database of Banadir Regional Education Directorate.  
8. The database shall contain for all requirements data elements mainly:  
 Roll Number 
 Student information  
 List of Subjects with Corresponding Grades 
 Overall average  
 Final decision (Pass/Fail)  
8.5. Result Delivery (Based on Student Selection) 
The system shall deliver the corresponding result output to the student based on the selected 
option as detailed below. 
 Option 1: Pass/Fail (On-Screen Display) 
If the student selects Option 1, the system shall display: 
1) Roll Number: (e.g.:  B265001XX) 
2) Full name: (e.g.: Geedi Ugaas Warfaa Sugule) 
3) School Name: (e.g.: Geedi Ugaas) 
4) Examination Center: (e.g. JUS) 
5) Average:       
( e.g.  C-) 
6) Result:         
7 
(e.g. Pass/Fail) 
8 
 
 Option 2: Detailed Results via SMS 
If the student selects Option 2, the system shall send an SMS containing full result details: 
Banadir Regional Education Directorate 
Exam Results for Academic year 2025/2026 
Full name:  Insert Four names 
Roll Number: Start with each academic year e.g. 26 
Mothers full name:  Insert three names  
School Name:  Insert school name  
Examination Center insert exam center name 
Average:  Insert the average grade letter e.g. D- 
Decision:       Insert Pass/ Fail or Gudbay/Harey 
Subject Grade  Subject Grade 
Islamic Studies D Social Studies C- 
Arabic  C+ Science  A 
Somalia  D- English  B 
Math  D+ Technology  B+ 
Thank you for using Exam Results Service. 
 Option 3: Guidelines (USSD Usage & Grading System) 
If the student selects Option 3, the system shall display: 
How to use this service: - Option 1: View Pass/Fail result on screen - Option 2: Receive detailed results via SMS - Option 3: Receive Pass/Fail summary via SMS 
Grading System: 
 
 
 
 
 
 
 
 
 
 
 
Primary Education Certificate Grading Framework 
Range of Scores Corresponding Grades Description 
90 - 100 A Exceptional 
80-89.99 A-  Excellent 
75-79.99 B+ Very good 
70-74.99 B Good 
65-69.99 B- Moderately Good 
60-64.99 C+ Satisfactory 
55-59.99 C Above Average 
50-54.99 C- Average  
45-49.99 D+ Below  Average 
40-44.99 D Pass 
35-39.99 D- Minimum pass 
0-34.99 E Ungraded  
Thank you for using Exam Results Service. 
9.0.  Workflow for Exam Result Publication 
The examination result preparation process shall be conducted manually by the Education 
Directorate in accordance with established policies, procedures, and operational guidelines. This 
process includes examination administration, coding, marking, data entry, validation, analysis, 
and interpretation. 
The final examination results shall be compiled and stored in a standardized Excel format, which 
shall serve as the official input file for the system. 
Following approval of the final Excel result file, the system shall support the examination result 
publication workflow as defined below. 
1.  Uploading of Examination Results 
The system shall allow a designated and authorized officer to upload the approved Excel file 
containing examination results and shall require the officer to review the data prior to final 
submission to ensure accuracy, completeness, and correctness. 
The system shall provide data preview, filtering, and validation functionalities to support 
verification of uploaded examination results, shall allow re-uploading of the Excel file with 
automatic replacement of any previously uploaded file to prevent duplication, and shall not 
permit final submission unless the designated officer has explicitly reviewed and validated the 
data. 
Upon rejection of submitted examination results, the system shall provide the uploading officer 
with access to the verification officer’s feedback comments to support correction. 
The system shall allow the uploading officer, upon rejection, to correct the submitted data and 
resubmit an updated Excel file. The resubmitted file shall be forwarded to the verification officer 
for review and validation. 
2.  Result Verification 
The system shall provide a designated verification officer with access to review submitted 
examination results. The officer shall have the ability to either verify the uploaded results or 
reject them, in which case mandatory comments explaining the reason for rejection must be 
provided. 
The system shall enforce that all rejected submissions include mandatory comments before 
completion and shall provide advanced filtering and search capabilities, including by 
examination center, student, subject, and other relevant data attributes, to facilitate 
comprehensive verification 
9 
The system shall permit only one resubmission cycle per rejected submission. Any subsequent 
processing shall require a newly corrected file, which shall be re-evaluated by the verification 
officer before proceeding to the next stage. 
3.  Result Publication 
The system shall provide access to a designated senior officer or Director General to review 
verified examination results prior to publication and shall only allow publication of results that 
have been successfully verified by the verification officer. 
The senior officer shall be able to review, filter, and validate examination results using multiple 
criteria, including student, school, examination center, gender, and other relevant attributes. 
Upon approval, the system shall publish the results and make them available to students through 
the designated result dissemination channels. 
10.0. High-Level Architecture 
The system shall implement a telecom-integrated architecture to enable examination result 
access via SMS and USSD without internet dependency. 
The architecture shall consist of student mobile device, telecom network, SMS AND USSD 
gateway, application server, and examination database, which shall interact to process requests 
and deliver responses securely and efficiently. 
The system shall receive requests from users, process them through the application server, 
retrieve results from the examination database, and return responses via the SMS AND USSD 
gateway and telecom network. 
The diagram below illustrates the high-level architecture and interaction flow of the system 
components: 
10 
11.0. Data Requirements 
The system shall capture, process, and store examination result data for students. The required 
data elements shall support student identification, examination details, subject-wise marks, and 
overall result status. 
11.1. Core Data Elements 
The system shall, at a minimum, support the following core data elements: 
1. The system shall capture the Student Roll Number (e.g., B2650011XX) as a unique 
identifier.  
2. The system shall capture Examination Details, including exam session and level.  
3. The system shall capture Subject Marks for each registered subject.  
4. The system shall capture and compute the Result Status (Grade / Pass / Fail).  
11.2.  Data Upload Requirements 
The Banadir Exam Results Mobile Access System shall provide functionality to upload 
examination results using a standardized Excel template as follows: 
1. The system shall accept only predefined Excel formats for bulk upload.  
2. The system shall validate the structure and content of the uploaded file prior to 
processing.  
3. The system shall reject any file that does not conform to the required format and provide 
appropriate error messages.  
11.3.  Data Structure (Excel Template Format) 
The uploaded Excel template shall contain a total of thirty (30) mandatory columns, structured as 
follows:  
Full List of Columns (Excel Template Format) 
Column 
No 
No 
Column 
No 
1 Serial Number 
2 Roll Number 
Column 
4 Mother’s Name 
3 Student Full Name 
5 Gender 
7 School Name 
6 District 
8 Exam Center 
10 Social Studies  
9 Arabic  
11 Math  
13 English  
12 Technology  
14 Science  
16 Somali  
15 Islamic Studies  
17 Total  
19 Result  
18 Average  
20 Arabic  
22 Math  
21 Social Studies  
23 Technology  
25 Science  
24 English  
26 Islamic Studies  
28 Total  
27 Somali  
29 Average  
30 Result  
11 
12.0. Integration Requirements  
The system shall integrate with authorized telecom service providers to support SMS and USSD
based service delivery for examination result inquiry. The purpose of this integration is to enable 
students to access examination information through mobile communication channels in a secure, 
reliable, and controlled manner. 
The system shall establish connectivity with the SMS Gateway to facilitate sending and 
receiving of text messages, and with the USSD Gateway to enable structured, session-based 
menu interactions. 
The integration shall ensure: 
 Reliable transmission of student requests and system responses.  
 Secure handling of user sessions and data exchanges.  
 Accurate routing of messages between telecom infrastructure and the core system.  
 Consistent synchronization between the Application Server and the Examination 
Database.  
12.1.  High-Level Integration Process 
The system shall support the following high-level interaction flow: 
1. The student shall initiate a request by sending an SMS or dialing the designated USSD 
code.  
2. The Telecom Network shall transmit the request to the appropriate SMS or USSD 
Gateway.  
3. The Gateway shall forward the request to the Application Server within the Banadir 
Regional Administration system.  
4. The Application Server shall process the request by retrieving the required data from the 
Examination Database through the Examination Module.  
5. The system shall generate a response and transmit it back through the Gateway to the 
student via the respective SMS or USSD channel. 
13.0.   Non-Functional Requirements 
The following are the main quality non-functional requirements for the system: 
1. Performance: System responses shall be delivered within 10 seconds.  
2. Scalability: System shall handle high volumes of concurrent users.  
3. Availability: System shall maintain ≥ 99% uptime.  
4. Security: System shall protect student data from unauthorized access or 
tampering. 
12 
14.0. Assumptions 
The system is designed based on the following assumptions: 
1. All students possess a valid and unique Roll Number.  
2. Telecom networks (SMS AND USSD) are available and operational.  
3. Examination results are accurate and approved before upload.  
4. Users have basic knowledge of mobile phone usage.  
5. Telecom providers support short codes and gateway integration.  
6. The system will be used primarily during official result release periods.  
7. If security verification is required, students will have a National Identification Card 
(NIRA ID).  
15.0. Constraints 
The system shall operate under the following constraints: 
1. SMS responses must not exceed 160 characters  
2. USSD sessions are limited by telecom session timeout (typically 90–180 seconds)  
3. System performance depends on telecom network reliability  
4. Only predefined Excel templates shall be accepted for uploads  
5. System must comply with government data protection policies  
6. Limited to SMS and USSD channels only (no internet/web access). 
16.0. Risks 
The SMS AND USSD system may face network failures and high traffic during result release, 
mitigated by multiple providers and load balancing. Incorrect data uploads are addressed through 
validation and verification. Unauthorized access is controlled via PINs or registration numbers, 
and SMS delivery delays are reduced by optimizing gateway routing. 
17.0. 
Glossary  
The following glossary defines key terms and concepts used in the SMS AND USSD result 
system to ensure a common understanding among stakeholders. These terms cover messaging 
technologies, system components, student identifiers, access controls, and data storage relevant 
to the system’s operation. 
S/No. 
Term 
Definition 
1 SMS 
Short Message Service (text messaging) 
2 USSD 
Unstructured Supplementary Service Data 
3 Roll Number 
Unique student exam identification number 
4 RBAC 
Role-Based Access Control 
5 Telecom Gateway 
Interface between telecom network and system 
6 Exam Database 
Repository storing student results 
13 