# OneDrive Integration Setup Guide

This guide helps you set up KidVision so students can access their personal assessment files from your OneDrive.

## How It Works
1. **Teacher** creates individual JSON files for each student in their OneDrive
2. **Teacher** shares each file with the respective student ("Can edit" permission)
3. **Students** sign in with their school Microsoft account
4. **App** finds their file in "Shared with me" automatically
5. **Students** can view their scores and add new assessments

## Why This Approach?
- ✅ Data stays in teacher's OneDrive (district-controlled)
- ✅ Compliant with school data policies
- ✅ Students only see their own file
- ✅ Teacher maintains ownership and backup
- ✅ Works on any device with internet

---

## Step 1: Register an Azure AD App

You need to register an app in your school's Azure portal.

### Option A: Ask Your IT Department
Send this to your IT admin:

> "I need an Azure AD App Registration for a student progress tracking app. It needs:
> - **Application type**: Single-page application (SPA)
> - **Redirect URI**: `http://localhost:3000` (for development)
> - **API Permissions**: `Files.ReadWrite.All` and `User.Read` (Microsoft Graph, Delegated)
> - **Supported account types**: Accounts in this organizational directory only
> 
> Please provide me with the **Application (client) ID**."

### Option B: Register It Yourself (if you have access)

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **New registration**
4. Fill in:
   - **Name**: `KidVision Student App`
   - **Supported account types**: "Accounts in this organizational directory only"
   - **Redirect URI**: Select "Single-page application (SPA)" and enter `http://localhost:3000`
5. Click **Register**
6. Copy the **Application (client) ID** - you'll need this!

### Add API Permissions

1. In your app registration, go to **API permissions**
2. Click **Add a permission** → **Microsoft Graph** → **Delegated permissions**
3. Search and add:
   - `Files.ReadWrite.All` (to read/write shared OneDrive files)
   - `User.Read` (to get user info)
4. Click **Grant admin consent** (or ask IT to do this)

---

## Step 2: Configure KidVision

Open `hooks/useStudentOneDrive.ts` and update the configuration at the top:

```tsx
// ==============================================
// CONFIGURATION - Update these for your school
// ==============================================
export const AZURE_CLIENT_ID = "paste-your-client-id-here"; // From Azure AD
export const FILE_NAME_PATTERN = "kidvision";               // How you name files
// ==============================================
```

---

## Step 3: Create Student Files in Your OneDrive

### ONE file per student - contains ALL subjects! 📚

### 3a. Create a folder for organization (optional but recommended):
```
Your OneDrive/
└── Kidvision/
    ├── kidvision-Emma.json      ← Contains math, reading, AND science!
    ├── kidvision-Liam.json
    ├── kidvision-Olivia.json
    └── ...
```

### 3b. Create a JSON file for each student:

1. Open Notepad or any text editor
2. Paste this starter template:

```json
{
  "math": [],
  "reading": [],
  "science": []
}
```

3. Save as `kidvision-StudentName.json` (e.g., `kidvision-Emma.json`)
4. Upload to your OneDrive or save directly if synced

**Important**: The file name MUST contain `kidvision` so the app can find it!

### 3c. Share each file with the student:

1. In OneDrive, right-click the student's file
2. Click **Share**
3. Enter the student's school email
4. Click the pencil icon and change to **"Can edit"**
5. Click **Send**

The student will now see this file in their "Shared with me" folder!

---

## Step 4: Student Access

When students visit ANY subject page (math, reading, or science) and sign in:
1. They authenticate with their school Microsoft account
2. The app looks in their "Shared with me" folder
3. It finds the file containing "kidvision" in the name
4. They see data for that subject from their single file
5. Changes save directly to your OneDrive!

---

## Step 5: JSON Data Format

Each student's file contains ALL subjects:

```json
{
  "math": [
    {
      "id": "1706745600000-abc123",
      "assessment_type": "Quiz",
      "test_name": "Chapter 5 Quiz",
      "score": 18,
      "max_score": 20,
      "date_given": "2026-02-01"
    }
  ],
  "reading": [
    {
      "id": "1706832000000-def456",
      "assessment_type": "Unit Test",
      "test_name": "Unit 3 Test",
      "score": 85,
      "max_score": 100,
      "date_given": "2026-02-05"
    }
  ],
  "science": [
    {
      "id": "1706918400000-ghi789",
      "assessment_type": "FAST Progress Monitoring",
      "test_name": "FAST PM Winter",
      "score": 315,
      "max_score": 999,
      "date_given": "2026-01-15",
      "is_scale_score": true
    }
  ]
}
```

### Assessment Types:
- `Quiz` - Regular classroom quizzes (scored as percentage)
- `Unit Test` - End of unit tests (scored as percentage)
- `FAST Progress Monitoring` - FAST PM tests (scale score, typically 100-999)
- `STAR` - STAR assessments (scale score)

---

## Step 6: Add Production Redirect URI

When you deploy the app:
1. Go back to Azure AD App Registration
2. Go to **Authentication**
3. Add your production URL as a redirect URI (e.g., `https://kidvision.yourschool.edu`)

---

## Troubleshooting

### "Sign-in failed"
- Check that the client ID is correct
- Make sure the redirect URI matches exactly
- Ask IT if admin consent was granted

### "Could not load data from OneDrive"
- Make sure you're signed in with your school account
- Check that the `Kidvision/assessments` folder exists
- Verify the file naming: `{studentId}-math.json`

### "Could not save to OneDrive"
- Ensure `Files.ReadWrite` permission is granted
- Check OneDrive storage isn't full
- Try signing out and back in

---

## Security Notes

- Data is stored in the signed-in user's OneDrive
- Only users who sign in can access their own data
- No data is sent to external servers
- Student IDs should not contain PII (use codes/numbers)

---

## Need Help?

Contact your school IT department for:
- Azure AD App Registration assistance
- Admin consent for permissions
- OneDrive storage questions
