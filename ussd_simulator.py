#!/usr/bin/env python3
"""
BERMAS USSD Simulator - Python Console Version
Banadir Exam Results Mobile Access System
"""

import re
from typing import Dict, List, Optional

class USSDSimulator:
    def __init__(self):
        self.students = {
            '1234': {
                'roll_number': '1234',
                'full_name': 'Ahmed Mohamed Hassan Ali',
                'mother_name': 'Fatima Omar Yusuf',
                'gender': 'M',
                'school_name': 'Geedi Ugaas Secondary',
                'exam_center': 'JUS',
                'subjects': {
                    'Arabic': 72,
                    'Social Studies': 68,
                    'Math': 75,
                    'Technology': 80,
                    'English': 70,
                    'Science': 85,
                    'Islamic Studies': 78,
                    'Somali': 65
                },
                'total': 593,
                'average': 'B-',
                'result': 'Pass',
                'status': 'approved'
            },
            '1235': {
                'roll_number': '1235',
                'full_name': 'Sahra Abdi Mohamud Farah',
                'mother_name': 'Halima Ali Omar',
                'gender': 'F',
                'school_name': 'Al-Azhar Secondary',
                'exam_center': 'AZH',
                'subjects': {
                    'Arabic': 85,
                    'Social Studies': 78,
                    'Math': 82,
                    'Technology': 88,
                    'English': 79,
                    'Science': 91,
                    'Islamic Studies': 83,
                    'Somali': 76
                },
                'total': 662,
                'average': 'A-',
                'result': 'Pass',
                'status': 'approved'
            },
            '1236': {
                'roll_number': '1236',
                'full_name': 'Omar Hassan Abdullahi Said',
                'mother_name': 'Amina Mohamed Ibrahim',
                'gender': 'M',
                'school_name': 'Unity Secondary',
                'exam_center': 'UNT',
                'subjects': {
                    'Arabic': 45,
                    'Social Studies': 42,
                    'Math': 38,
                    'Technology': 55,
                    'English': 48,
                    'Science': 52,
                    'Islamic Studies': 44,
                    'Somali': 40
                },
                'total': 364,
                'average': 'D+',
                'result': 'Pass',
                'status': 'approved'
            },
            '1237': {
                'roll_number': '1237',
                'full_name': 'Khadija Ali Omar Hussein',
                'mother_name': 'Mariam Hassan Ahmed',
                'gender': 'F',
                'school_name': 'Hope Secondary',
                'exam_center': 'HPE',
                'subjects': {
                    'Arabic': 25,
                    'Social Studies': 28,
                    'Math': 22,
                    'Technology': 35,
                    'English': 30,
                    'Science': 38,
                    'Islamic Studies': 32,
                    'Somali': 26
                },
                'total': 236,
                'average': 'E',
                'result': 'Fail',
                'status': 'approved'
            }
        }

    def validate_roll_number(self, roll_number: str) -> bool:
        """Validate roll number format (4 digits)"""
        pattern = r'^\d{4}$'
        return bool(re.match(pattern, roll_number))

    def get_grade_from_score(self, score: int) -> str:
        """Convert numerical score to letter grade"""
        if score >= 90:
            return 'A'
        elif score >= 80:
            return 'A-'
        elif score >= 75:
            return 'B+'
        elif score >= 70:
            return 'B'
        elif score >= 65:
            return 'B-'
        elif score >= 60:
            return 'C+'
        elif score >= 55:
            return 'C'
        elif score >= 50:
            return 'C-'
        elif score >= 45:
            return 'D+'
        elif score >= 40:
            return 'D'
        elif score >= 35:
            return 'D-'
        else:
            return 'E'

    def display_welcome_menu(self) -> str:
        """Display the main USSD menu"""
        return """
╔══════════════════════════════════════════════╗
║    Banadir Regional Education Directorate    ║
║         Welcome to Exam Results Service      ║
╠══════════════════════════════════════════════╣
║  1) Check Pass/Fail (On-screen display)     ║
║  2) Receive Detailed Results via SMS        ║
║  3) How to use this service & grading       ║
║     system?                                  ║
╚══════════════════════════════════════════════╝

Enter your choice (1, 2, or 3):"""

    def get_student_data(self, roll_number: str) -> Optional[Dict]:
        """Retrieve student data by roll number"""
        return self.students.get(roll_number.upper())

    def display_pass_fail_result(self, student: Dict) -> str:
        """Display Pass/Fail result on screen"""
        return f"""
╔══════════════════════════════════════════════╗
║                EXAM RESULT                   ║
╠══════════════════════════════════════════════╣
║  Roll Number: {student['roll_number']:<30} ║
║  Full Name: {student['full_name'][:28]:<28} ║
║  School: {student['school_name'][:33]:<33} ║
║  Exam Center: {student['exam_center']:<30} ║
║  Average: {student['average']:<34} ║
║  Result: {student['result']:<35} ║
╚══════════════════════════════════════════════╝

Thank you for using Exam Results Service."""

    def display_detailed_sms_result(self, student: Dict) -> str:
        """Display detailed SMS-style result"""
        sms_content = f"""
╔══════════════════════════════════════════════╗
║              SMS SENT TO YOUR PHONE          ║
╚══════════════════════════════════════════════╝

Banadir Regional Education Directorate
Exam Results for Academic year 2025/2026

Full name: {student['full_name']}
Roll Number: {student['roll_number']}
Mother's full name: {student['mother_name']}
School Name: {student['school_name']}
Examination Center: {student['exam_center']}
Average: {student['average']}
Decision: {student['result']}

SUBJECT GRADES:
╔════════════════════╦════════════════════╗
║ Subject            ║ Grade              ║
╠════════════════════╬════════════════════╣"""

        for subject, score in student['subjects'].items():
            grade = self.get_grade_from_score(score)
            sms_content += f"\n║ {subject:<18} ║ {grade:<18} ║"
        
        sms_content += """
╚════════════════════╩════════════════════╝

Thank you for using Exam Results Service."""
        
        return sms_content

    def display_usage_guidelines(self) -> str:
        """Display usage guidelines and grading system"""
        return """
╔══════════════════════════════════════════════╗
║              HOW TO USE SERVICE              ║
╠══════════════════════════════════════════════╣
║  Option 1: View Pass/Fail result on screen  ║
║  Option 2: Receive detailed results via SMS ║
║  Option 3: View this help & grading system  ║
║                                              ║
║              GRADING SYSTEM                  ║
╠══════════════════════════════════════════════╣
║  A (90-100)  - Exceptional                  ║
║  A- (80-89)  - Excellent                    ║
║  B+ (75-79)  - Very Good                    ║
║  B (70-74)   - Good                         ║
║  B- (65-69)  - Moderately Good              ║
║  C+ (60-64)  - Satisfactory                 ║
║  C (55-59)   - Above Average                ║
║  C- (50-54)  - Average                      ║
║  D+ (45-49)  - Below Average                ║
║  D (40-44)   - Pass                         ║
║  D- (35-39)  - Minimum Pass                 ║
║  E (0-34)    - Ungraded                     ║
╚══════════════════════════════════════════════╝"""

    def display_error_message(self, error_type: str = "invalid_roll") -> str:
        """Display error messages"""
        if error_type == "invalid_roll":
            return """
╔══════════════════════════════════════════════╗
║                   ERROR                      ║
╠══════════════════════════════════════════════╣
║  Invalid Roll Number entered.                ║
║  Please enter a valid Student Registration   ║
║  Number (e.g., 1234)                         ║
║                                              ║
║  Try again with correct format.              ║
╚══════════════════════════════════════════════╝"""
        elif error_type == "not_found":
            return """
╔══════════════════════════════════════════════╗
║                   ERROR                      ║
╠══════════════════════════════════════════════╣
║  Roll Number not found in database.          ║
║  Please verify your Roll Number or           ║
║  contact your school for assistance.         ║
╚══════════════════════════════════════════════╝"""
        else:
            return """
╔══════════════════════════════════════════════╗
║                   ERROR                      ║
╠══════════════════════════════════════════════╣
║  Invalid option. Please try again.           ║
╚══════════════════════════════════════════════╝"""

    def run_ussd_session(self):
        """Main USSD session loop"""
        print("\n" + "="*50)
        print("📱 BERMAS USSD Simulator Started")
        print("Dial: *57001# to begin")
        print("="*50)
        
        input("\nPress Enter to dial *57001#...")
        
        while True:
            # Display main menu
            print(self.display_welcome_menu())
            
            try:
                choice = input().strip()
                
                if choice == '1':
                    # Pass/Fail option
                    print("\nEnter your Roll Number (e.g., 1234):")
                    roll_number = input().strip().upper()
                    
                    if not self.validate_roll_number(roll_number):
                        print(self.display_error_message("invalid_roll"))
                        continue
                    
                    student = self.get_student_data(roll_number)
                    if not student:
                        print(self.display_error_message("not_found"))
                        continue
                    
                    print(self.display_pass_fail_result(student))
                    
                elif choice == '2':
                    # Detailed SMS option
                    print("\nEnter your Roll Number for detailed SMS results:")
                    roll_number = input().strip().upper()
                    
                    if not self.validate_roll_number(roll_number):
                        print(self.display_error_message("invalid_roll"))
                        continue
                    
                    student = self.get_student_data(roll_number)
                    if not student:
                        print(self.display_error_message("not_found"))
                        continue
                    
                    print("\n⏳ Sending SMS...")
                    import time
                    time.sleep(2)
                    print(self.display_detailed_sms_result(student))
                    
                elif choice == '3':
                    # Usage guidelines
                    print(self.display_usage_guidelines())
                    
                elif choice.lower() in ['exit', 'quit', '0']:
                    print("\n📱 USSD Session Ended")
                    print("Thank you for using BERMAS!")
                    break
                    
                else:
                    print(self.display_error_message("invalid_option"))
                
                # Ask if user wants to continue
                print("\n" + "-"*50)
                print("Options: Continue (Enter) | Exit (type 'exit')")
                continue_choice = input().strip().lower()
                if continue_choice in ['exit', 'quit']:
                    print("\n📱 USSD Session Ended")
                    print("Thank you for using BERMAS!")
                    break
                    
            except KeyboardInterrupt:
                print("\n\n📱 USSD Session Interrupted")
                print("Thank you for using BERMAS!")
                break
            except Exception as e:
                print(f"\nSystem Error: {e}")
                print("Please try again.")

def main():
    """Main function to start the USSD simulator"""
    print("🇸🇴 BERMAS - Banadir Exam Results Mobile Access System")
    print("Python USSD Simulator")
    print("\nSample Roll Numbers to Test:")
    print("• 1234 - Ahmed (Pass, Good)")
    print("• 1235 - Sahra (Pass, Excellent)")
    print("• 1236 - Omar (Pass, Below Average)")
    print("• 1237 - Khadija (Fail)")
    
    simulator = USSDSimulator()
    simulator.run_ussd_session()

if __name__ == "__main__":
    main()
