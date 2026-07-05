# KidVision Student Dashboard

KidVision is a student-facing progress dashboard built for district review with student data remaining in district-controlled storage through OneDrive or local review files.

## Current Storage Model

- Student data lives in district-controlled OneDrive files or local review bundles.
- The district review flow does not rely on third-party hosted student data storage.
- Local environment files are excluded from git.
- Developer-only tooling is disabled in the review-ready repository.
- Teacher-facing workflows are intentionally excluded from the current review branch and will be developed in a later phase.

## What Reviewers Should Read First

- ONEDRIVE_SETUP.md
- DEPLOYMENT.md
- VERIFICATION_CHECKLIST.md
- COUNTY_SUBMISSION_CHECKLIST.md

## Quick Start

1. Install dependencies with `npm install`.
2. Run the app with `npm run dev` for the Next.js experience.
3. Use the local review bundle in `public/KidVision_Local_App_Windows_v13_vocab/` for district-style static review.
4. Follow `ONEDRIVE_SETUP.md` if you are connecting students to Microsoft 365 storage.

## District Review Notes

- Student data must remain within district-controlled storage.
- Review branches should contain the exact student-facing build being demonstrated.
- Do not include local secrets or unreviewed developer tooling in the branch you share.
