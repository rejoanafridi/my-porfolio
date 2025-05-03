# Cloudinary Integration Setup

## Configuration

The portfolio website is now configured to use Cloudinary for image storage and management with the following credentials:

- **Cloud Name**: afridi-storage
- **API Key**: 925252225862794
- **API Secret**: hHsJzPL4h4ECmPdl81hYVJ1rVGM

These credentials have been directly configured in the `lib/cloudinary.ts` file.

## Features

### Image Upload

The application uses Cloudinary for all image uploads, providing:

- Secure cloud storage for all portfolio images
- Automatic optimization and transformation capabilities
- CDN delivery for fast loading times

### Image Management

Images can be uploaded through the admin interface using the `ImageUploader` component, which is used in various sections including:

- Hero section (profile image)
- Project images
- Site configuration (logo, favicon, meta images)

## Site Configuration Module

A new site configuration module has been added to the admin panel, allowing you to manage:

- Site name and description (used in meta tags and navbar)
- Site URL
- Logo and favicon
- Meta image for social sharing
- Footer text and copyright information

## How to Access

1. Log in to the admin panel
2. Navigate to "Site Configuration" in the sidebar
3. Update your site's information
4. Click "Save Configuration" to apply changes

## Technical Implementation

The Cloudinary integration uses the official Cloudinary SDK for Node.js. Images are uploaded through a secure API route that validates admin permissions before allowing uploads.

The site configuration module connects to the existing site data API endpoints to retrieve and update site information.