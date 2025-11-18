# Airtable Setup Guide

## Current Status
The app is running with **mock data** for demonstration purposes. To connect to your real Airtable base, follow these steps:

## Configuration Steps

1. **Get your Airtable Personal Access Token**
   - Go to https://airtable.com/create/tokens
   - Create a new token with these scopes:
     - `data.records:read`
     - `data.records:write`
   - Add access to your specific base

2. **Get your Base ID**
   - Open your Airtable base
   - Go to Help → API documentation
   - Find your base ID (starts with `app...`)

3. **Update `.env.local`**
   Replace the placeholder values:
   ```
   AIRTABLE_API_KEY=your_actual_token_here
   AIRTABLE_BASE_ID=your_actual_base_id_here
   AIRTABLE_TABLE_NAME=Websites
   ```

4. **Restart the dev server**
   ```bash
   npm run dev
   ```

## Expected Airtable Schema

Your Airtable table should have these fields:
- `Name` (Single line text)
- `Code URL` (URL)
- `Playable URL` (URL)
- `Decision Status` (Single select: Pending, Approved, Changes Requested)
- `Decision Reason` (Long text)
- `Event Code` (Single line text)
- `Screenshot URL` (URL) - Optional
- `Birthdate` (Date) - Optional

## Testing
Once configured, the app will automatically fetch real data from Airtable instead of using mock data!
