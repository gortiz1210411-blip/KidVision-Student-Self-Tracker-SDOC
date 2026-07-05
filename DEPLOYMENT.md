# Deployment Guide

KidVision should be deployed with district-controlled storage in mind.

## Storage Architecture

- Primary review path: OneDrive-backed student files.
- Static review path: local HTML bundle served locally.
- Student data should remain in district-controlled Microsoft 365 or local district-managed storage.

## Pre-Deployment Checklist

- Confirm the selected storage mode is configured correctly.
- Run `npm run build`.
- Optionally run `npm run lint`.
- Verify the student-facing build matches the version being reviewed.
- Verify district reviewers have the correct launch instructions.

## Deployment Options

### Option 1: District-hosted Next.js deployment

Use the Next.js app when district hosting and Microsoft 365 integration are required.

### Option 2: Local review bundle

Use the files in `public/KidVision_Local_App_Windows_v13_vocab/` with the local launcher scripts when the district wants a static local review experience.

## OneDrive Setup

Use `ONEDRIVE_SETUP.md` for the Microsoft 365 configuration and sharing workflow.
