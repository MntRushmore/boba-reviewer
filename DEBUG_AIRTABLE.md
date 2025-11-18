# Airtable 404 Error - Debugging Guide

The error "Could not find what you are looking for" (404) typically means:

## Most Common Issues:

1. **Incorrect Base ID**
   - Your Base ID should start with `app...`
   - Find it at: https://airtable.com/api (select your base)
   - Or in the URL when viewing your base

2. **Incorrect Table Name**
   - The table name is **case-sensitive**
   - Current setting: `Websites`
   - Common names: `Websites`, `websites`, `Submissions`, `Table 1`

3. **API Token Permissions**
   - Token must have access to this specific base
   - Token needs `data.records:read` and `data.records:write` scopes

## Quick Fix Steps:

1. Open your Airtable base in browser
2. Check the exact table name (shown in the tab at bottom)
3. Update `.env.local`:
   ```
   AIRTABLE_TABLE_NAME=YourExactTableName
   ```
4. Restart the dev server: `npm run dev`

## Verify Your Settings:

Run this in terminal to see what the app is using:
```bash
cd /Users/rushilchopra/Desktop/boba-reviewer
node -e "require('dotenv').config({path:'.env.local'}); console.log('Base ID:', process.env.AIRTABLE_BASE_ID); console.log('Table Name:', process.env.AIRTABLE_TABLE_NAME);"
```

## Still Not Working?

The table name might be different. Common alternatives to try:
- `Websites`
- `websites` 
- `Submissions`
- `Table 1`
- `tbl...` (if you're using table ID instead of name)
