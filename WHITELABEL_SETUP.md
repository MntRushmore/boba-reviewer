too lazy to make one myself so here is the guide yaal

# Whitelabel Setup Guide

this dang portal can be used for any ysws or hackathon

## Quick Start

1. Copy `.env.local.example` to `.env.local`
2. Update the environment variables with your custom values
3. Restart the development server

## Environment Variables

### Airtable Configuration

```bash
AIRTABLE_API_KEY=your_personal_access_token_here
AIRTABLE_BASE_ID=your_base_id_here
AIRTABLE_TABLE_NAME=Websites
```

- **AIRTABLE_API_KEY**: Your Airtable Personal Access Token
- **AIRTABLE_BASE_ID**: The ID of your Airtable base (starts with `app`)
- **AIRTABLE_TABLE_NAME**: Name of the table in your base

### Whitelabel Configuration

```bash
NEXT_PUBLIC_APP_NAME=Boba Drops
NEXT_PUBLIC_APP_SUBTITLE=Submission Reviewer
NEXT_PUBLIC_SIGN_IN_URL=https://your-domain.com/handler/sign-in?after_auth_return_to=%2Fhandler%2Fsign-up
```

- **NEXT_PUBLIC_APP_NAME**: Main title shown in the sidebar (e.g., "Summer of Making", "Code Jam 2024")
- **NEXT_PUBLIC_APP_SUBTITLE**: Subtitle/description below the main title
- **NEXT_PUBLIC_SIGN_IN_URL**: Full URL for Stack Auth sign-in page

### View Names

```bash
NEXT_PUBLIC_VIEW_1_NAME=Workshop Under Review
NEXT_PUBLIC_VIEW_2_NAME=Individual Under Review
```

- **NEXT_PUBLIC_VIEW_1_NAME**: Name of the first Airtable view (must match exactly)
- **NEXT_PUBLIC_VIEW_2_NAME**: Name of the second Airtable view (must match exactly)

⚠️ **Important**: These view names must match exactly with the view names in your Airtable base.

## Example Configurations

### Example 1: Summer of Making
```bash
NEXT_PUBLIC_APP_NAME=Summer of Making
NEXT_PUBLIC_APP_SUBTITLE=Project Reviewer
NEXT_PUBLIC_SIGN_IN_URL=https://som.hackclub.com/handler/sign-in?after_auth_return_to=%2F
NEXT_PUBLIC_VIEW_1_NAME=Projects Pending Review
NEXT_PUBLIC_VIEW_2_NAME=Projects Under Review
```

### Example 2: Hackathon Submissions
```bash
NEXT_PUBLIC_APP_NAME=Code Jam 2024
NEXT_PUBLIC_APP_SUBTITLE=Submission Portal
NEXT_PUBLIC_SIGN_IN_URL=https://codejam.example.com/handler/sign-in?after_auth_return_to=%2F
NEXT_PUBLIC_VIEW_1_NAME=Active Submissions
NEXT_PUBLIC_VIEW_2_NAME=Finals Round
```

## Airtable Setup

Your Airtable table should have the following fields:

### Required Fields
- **Name**: Text (submitter name)
- **Code URL**: URL (link to code repository)
- **Playable URL**: URL (link to live demo)
- **Status**: Single Select (options: `Pending`, `Approved`, `Rejected`)
- **Event Code**: Text (event identifier)

### Optional Fields
- **Decision Reason (to email)**: Long Text (feedback sent to submitter)
- **Birthdate**: Date
- **Screenshot**: Attachment

### Views Setup

Create two views in your Airtable base:
1. First view (e.g., "Workshop Under Review")
2. Second view (e.g., "Individual Under Review")

Make sure the view names in Airtable exactly match what you set in `NEXT_PUBLIC_VIEW_1_NAME` and `NEXT_PUBLIC_VIEW_2_NAME`.

## Deployment

When deploying to Vercel or another platform:

1. Add all environment variables in your platform's dashboard
2. Ensure `NEXT_PUBLIC_*` variables are set (they're exposed to the client)
3. Keep `AIRTABLE_*` variables secret (server-only)

## Support

For issues or questions dm @rushmore on slack
