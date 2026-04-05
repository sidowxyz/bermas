#!/usr/bin/env python3
"""
BERMAS USSD Simulator with Twilio SMS - Python Console Version
Banadir Exam Results Mobile Access System
"""

import re
import os
from typing import Dict, List, Optional
from twilio.rest import Client
from twilio.base.exceptions import TwilioException

class USSDSimulator:
    def __init__(self):
        # Twilio configuration
        self.twilio_account_sid = os.getenv('TWILIO_ACCOUNT_SID', '')
        self.twilio_auth_token = os.getenv('TWILIO_AUTH_TOKEN', '')
        self.twilio_phone_number = os.getenv('TWILIO_PHONE_NUMBER', '')
        
        # Initialize Twilio client if credentials are provided
        self.twilio_client = None
        if self.twilio_account_sid and self.twilio_auth_token:
            self.twilio_client = Client(self.twilio_account_sid, self.twilio_auth_token)
        
        # Mock student data
        self.students = {
            'B2650011': {
                'roll_number': 'B2650011',
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
            'B2650012': {
                'roll_number': 'B2650012',
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
            'B2650013': {
                'roll_number': 'B2650013',
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
            'B2650014': {
                'roll_number': 'B2650014',
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

    def setup_twilio_credentials(self):
        """Interactive setup for Twilio credentials"""
        print("\n" + "="*50)
        print("📱 TWILIO SMS CONFIGURATION")
        print("="*50)
        print("To send real SMS, please provide your Twilio credentials:")
        print("(You can skip this and use simulation mode)\n")
        
        if not self.twilio_account_sid:
            account_sid = input("Enter Twilio Account SID (or press Enter to skip): ").strip()
            if account_sid:
                self.twilio_account_sid = account_sid
        
        if not self.twilio_auth_token:
            auth_token = input("Enter Twilio Auth Token (or press Enter to skip): ").strip()
            if auth_token:
                self.twilio_auth_token = auth_token
        
        if not self.twilio_phone_number:
            phone_number = input("Enter Twilio Phone Number (e.g., +1234567890): ").strip()
            if phone_number:
                self.twilio_phone_number = phone_number
        
        # Initialize Twilio client
        if self.twilio_account_sid and self.twilio_auth_token:
            try:
                self.twilio_client = Client(self.twilio_account_sid, self.twilio_auth_token)
                print("✅ Twilio configured successfully!")
                return True
            except Exception as e:
                print(f"❌ Error configuring Twilio: {e}")
                return False
        else:
            print("⚠️ Twilio not configured - using simulation mode")
            return False

    def validate_phone_number(self, phone: str) -> bool:
        """Validate phone number format"""
        # Remove spaces and common separators
        phone = re.sub(r'[\s\-\(\)]', '', phone)
        
        # Check if it starts with + and has 10-15 digits
        if phone.startswith('+'):
            return len(phone) >= 11 and len(phone) <= 16 and phone[1:].isdigit()
        
        # Check if it's just digits (assume local number)
        return len(phone) >= 10 and phone.isdigit()

    def format_phone_number(self, phone: str) -> str:
        """Format phone number for Twilio"""
        # Remove spaces and separators
        phone = re.sub(r'[\s\-\(\)]', '', phone)
        
        # Add + if not present
        if not phone.startswith('+'):
            # For Somalia, add country code +252
            if len(phone) == 9:  # Somali mobile numbers are 9 digits
                phone = '+252' + phone
            elif len(phone) == 10:  # US format
                phone = '+1' + phone
            else:
                phone = '+' + phone
        
        return phone

    def validate_roll_number(self, roll_number: str) -> bool:
        """Validate roll number format (B26XXXXX)"""
        pattern = r'^B26\d{5,6}$'
        return bool(re.match(pattern, roll_number.upper()))

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

    def create_sms_message(self, student: Dict) -> str:
        """Create SMS message content"""
        message = f"""Banadir Regional Education Directorate
Exam Results 2025/2026

Name: {student['full_name']}
Roll No: {student['roll_number']}
School: {student['school_name']}
Center: {student['exam_center']}
Average: {student['average']}
Result: {student['result']}

GRADES:
"""
        
        # Add subject grades (keeping it short for SMS)
        for subject, score in list(student['subjects'].items())[:4]:  # First 4 subjects
            grade = self.get_grade_from_score(score)
            message += f"{subject}: {grade}\n"
        
        if len(student['subjects']) > 4:
            message += f"+ {len(student['subjects']) - 4} more subjects\n"
        
        message += "\nThank you for using BERMAS!"
        
        return message

    def send_sms_via_twilio(self, phone_number: str, message: str) -> bool:
        """Send SMS using Twilio"""
        if not self.twilio_client or not self.twilio_phone_number:
            return False
        
        try:
            message = self.twilio_client.messages.create(
                body=message,
                from_=self.twilio_phone_number,
                to=phone_number
            )
            print(f"✅ SMS sent successfully! Message SID: {message.sid}")
            return True
            
        except TwilioException as e:
            print(f"❌ Twilio error: {e}")
            return False
        except Exception as e:
            print(f"❌ Error sending SMS: {e}")
            return False

    def display_welcome_menu(self) -> str:
        """Display the main USSD menu"""
        sms_status = "📱 Real SMS" if self.twilio_client else "🔄 Simulated"
        
        return f"""
╔══════════════════════════════════════════════╗
║    Banadir Regional Education Directorate    ║
║         Welcome to Exam Results Service      ║
╠══════════════════════════════════════════════╣
║  1) Check Pass/Fail (On-screen display)     ║
║  2) Receive Detailed Results via SMS        ║
║     {sms_status:<36} ║
║  3) How to use this service & grading       ║
║     system?                                  ║
║  4) Configure Twilio SMS                     ║
╚══════════════════════════════════════════════╝

Enter your choice (1, 2, 3, or 4):"""

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
║              SMS CONTENT PREVIEW             ║
╚══════════════════════════════════════════════╝

{self.create_sms_message(student)}

╔══════════════════════════════════════════════╗
║              END OF SMS PREVIEW              ║
╚══════════════════════════════════════════════╝"""
        
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
║  Option 4: Configure Twilio for real SMS    ║
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
║  Number (e.g., B2650011)                     ║
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
        elif error_type == "invalid_phone":
            return """
╔══════════════════════════════════════════════╗
║                   ERROR                      ║
╠══════════════════════════════════════════════╣
║  Invalid phone number format.                ║
║  Please enter a valid phone number           ║
║  (e.g., +252612345678 or 0612345678)         ║
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
        print("📱 BERMAS USSD Simulator with Twilio SMS")
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
                    print("\nEnter your Roll Number (e.g., B2650011):")
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
                    
                    # Get phone number for SMS
                    print("\nEnter phone number to receive SMS:")
                    print("Examples: +252612345678, 0612345678, +1234567890")
                    phone = input().strip()
                    
                    if not self.validate_phone_number(phone):
                        print(self.display_error_message("invalid_phone"))
                        continue
                    
                    formatted_phone = self.format_phone_number(phone)
                    print(f"\nFormatted number: {formatted_phone}")
                    
                    # Create SMS message
                    sms_message = self.create_sms_message(student)
                    
                    if self.twilio_client:
                        # Send real SMS via Twilio
                        print("\n⏳ Sending SMS via Twilio...")
                        if self.send_sms_via_twilio(formatted_phone, sms_message):
                            print("\n✅ SMS sent successfully to your phone!")
                        else:
                            print("\n❌ Failed to send SMS. Showing preview instead:")
                            print(self.display_detailed_sms_result(student))
                    else:
                        # Simulation mode
                        print("\n🔄 SMS Simulation Mode (Twilio not configured)")
                        import time
                        time.sleep(2)
                        print(self.display_detailed_sms_result(student))
                    
                elif choice == '3':
                    # Usage guidelines
                    print(self.display_usage_guidelines())
                    
                elif choice == '4':
                    # Configure Twilio
                    self.setup_twilio_credentials()
                    
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
    print("Python USSD Simulator with Twilio SMS Integration")
    print("\nSample Roll Numbers to Test:")
    print("• B2650011 - Ahmed (Pass, Good)")
    print("• B2650012 - Sahra (Pass, Excellent)")
    print("• B2650013 - Omar (Pass, Below Average)")
    print("• B2650014 - Khadija (Fail)")
    
    print("\n📱 TWILIO SETUP:")
    print("Set environment variables or configure interactively:")
    print("• TWILIO_ACCOUNT_SID")
    print("• TWILIO_AUTH_TOKEN") 
    print("• TWILIO_PHONE_NUMBER")
    
    simulator = USSDSimulator()
    
    # Optional: Setup Twilio on startup
    if not simulator.twilio_client:
        setup = input("\nSetup Twilio now? (y/n): ").strip().lower()
        if setup in ['y', 'yes']:
            simulator.setup_twilio_credentials()
    
    simulator.run_ussd_session()

if __name__ == "__main__":
    main()
