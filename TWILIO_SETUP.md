# 📱 Twilio SMS Setup Guide for BERMAS USSD

## 🚀 Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Get Twilio Credentials**
   - Sign up/login to [Twilio Console](https://console.twilio.com/)
   - Go to Account Dashboard
   - Copy your:
     - **Account SID**
     - **Auth Token**
     - **Phone Number** (from Phone Numbers section)

3. **Configure Credentials**

### Option A: Environment Variables
```bash
# Windows
set TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
set TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  
set TWILIO_PHONE_NUMBER=+1234567890

# Linux/Mac
export TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
export TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
export TWILIO_PHONE_NUMBER=+1234567890
```

### Option B: Netlify Environment Variables
Add these same variables in **Site configuration** > **Environment variables**.

## 📞 Phone Number Requirements

### Twilio Trial Account Limitations:
- **Verified Numbers Only**: You can only send SMS to phone numbers verified in your Twilio console
- **Twilio Number**: Must use your assigned Twilio phone number as sender
- **Credits**: Trial accounts get $15 credit (~500 SMS messages)

### To Add Verified Numbers:
1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Phone Numbers** > **Manage** > **Verified Caller IDs**
3. Click **Add a new number**
4. Enter the number you want to test with
5. Complete SMS/voice verification

## 🇸🇴 Somalia Number Format

For Somalia mobile numbers, use these formats:
- **International**: `+252612345678`
- **National**: `612345678` (automatically converted to +252)

Common Somalia mobile prefixes:
- **Hormuud**: 61, 62, 90
- **Somtel**: 63, 90, 91
- **Telesom**: 63, 90, 91

## ⚡ Testing the Integration

### Step-by-Step Test:
1. Run the app:
```bash
npm start
```

2. Open the web simulator and enter your SMS phone number in the phone field

3. Select option **2** - "Receive Detailed Results via SMS"

4. Enter a test roll number: `1234`

5. Enter a **verified phone number**

6. Check your phone for the SMS!

### Sample SMS Content:
```
Banadir Regional Education Directorate
Exam Results 2025/2026

Name: Ahmed Mohamed Hassan Ali
Roll No: 1234
School: Geedi Ugaas Secondary
Center: JUS
Average: B-
Result: Pass

GRADES:
Arabic: B
Social Studies: B-
Math: B+
Technology: A-

Thank you for using BERMAS!
```

## 🛠️ Troubleshooting

### Common Issues:

1. **"Invalid credentials"**
   - Double-check Account SID and Auth Token
   - Ensure no extra spaces in credentials

2. **"Phone number not verified"**
   - Add recipient number to Verified Caller IDs in Twilio Console
   - Wait for verification to complete

3. **"SMS not received"**
   - Check phone signal/network
   - Verify number format (+country code)
   - Check Twilio logs in console for delivery status

4. **"Insufficient balance"**
   - Trial accounts have $15 credit limit
   - Upgrade account or add credits

### Twilio Console Logs:
Monitor SMS delivery at: **Develop** > **Monitor** > **Logs** > **Messages**

## 💰 Cost Information

### Trial Account:
- **$15 credit** included
- **~500 SMS messages** (depending on destination)
- **Verification required** for all recipient numbers

### Pay-as-you-go:
- **SMS costs**: ~$0.0075 per message to Somalia
- **No verification required** for recipients
- **Global delivery** supported

## 🔧 Production Considerations

### For Real Deployment:
1. **Upgrade Twilio Account** (remove trial limitations)
2. **Webhook Integration** (for true USSD integration)
3. **Database Storage** (replace mock data with real database)
4. **Error Logging** (implement proper error handling/logging)
5. **Rate Limiting** (prevent SMS spam/abuse)
6. **Security** (validate/sanitize all inputs)

## 📱 Features Available

✅ **Real SMS Sending** via Twilio API
✅ **Phone Number Validation** (international formats)
✅ **Somalia Number Support** (+252 country code)
✅ **Interactive Configuration** (no env variables needed)
✅ **Simulation Fallback** (works without Twilio setup)
✅ **Error Handling** (invalid credentials, network issues)
✅ **Pretty Formatting** (SMS optimized for mobile display)

## 📞 Support

- **Twilio Documentation**: https://www.twilio.com/docs/sms
- **Twilio Console**: https://console.twilio.com/
- **SMS Pricing**: https://www.twilio.com/pricing/messaging
