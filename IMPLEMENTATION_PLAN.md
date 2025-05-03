# Implementation Plan for Portfolio Website Enhancements

## 1. SiteConfig Module Implementation

### Database Changes

1. Create a new `site_config` table in the PostgreSQL database:

```sql
CREATE TABLE site_config (
  id TEXT PRIMARY KEY,
  site_name TEXT NOT NULL,
  site_description TEXT NOT NULL,
  site_url TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  meta_image TEXT,
  footer_text TEXT,
  copyright_text TEXT
);

CREATE TABLE site_config_social_links (
  id SERIAL PRIMARY KEY,
  config_id TEXT REFERENCES site_config(id),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  display_order INTEGER NOT NULL
);
```

### Backend API Implementation

1. Add functions to `lib/db-postgres.ts` for site config operations:

    - `getSiteConfig()`
    - `updateSiteConfig()`

2. Create a new API route at `app/api/site/config/route.ts` for handling site config data

3. Update the `[section]/route.ts` file to include the siteConfig case

### Frontend Admin Interface

1. Create a new admin page at `app/admin/site-config/page.tsx` with form fields for:

    - Site name
    - Site description
    - Site URL
    - Logo URL (with Cloudinary upload)
    - Favicon URL (with Cloudinary upload)
    - Meta image (with Cloudinary upload)
    - Footer text
    - Copyright text
    - Social links management

2. Update the admin sidebar in `components/admin/sidebar.tsx` to include a link to the new site config page

3. Create a custom hook `useSiteConfig` in `hooks/use-site-config.ts` to manage site config data

### Frontend Integration

1. Update the navbar component to use site name from siteConfig
2. Update the footer component to use footer text and copyright from siteConfig
3. Update the layout.tsx to use meta tags from siteConfig

## 2. Cloudinary Integration

### Setup

1. Sign up for a Cloudinary account and get API credentials
2. Add Cloudinary environment variables to `.env.local`:
    ```
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

### Backend Implementation

1. Install Cloudinary SDK:

    ```bash
    npm install cloudinary
    ```

2. Create a Cloudinary utility file at `lib/cloudinary.ts` to handle uploads

3. Create an API route at `app/api/upload/route.ts` for handling image uploads

### Frontend Components

1. Create an `ImageUploader` component at `components/admin/image-uploader.tsx`

2. Integrate the `ImageUploader` component with:
    - About page image field
    - Site config logo/favicon/meta image fields
    - Project images

## Implementation Order

1. Set up Cloudinary integration first
2. Implement the image uploader component
3. Create the siteConfig database tables and API endpoints
4. Build the admin interface for siteConfig
5. Update frontend components to use siteConfig data

## Testing

1. Test Cloudinary image uploads
2. Test saving and retrieving siteConfig data
3. Verify that the navbar, footer, and meta tags are updated correctly

## Notes

-   Ensure proper error handling for image uploads
-   Implement loading states for image uploads
-   Add validation for form fields
-   Consider adding image optimization options
-   Implement proper security for the upload API endpoint
