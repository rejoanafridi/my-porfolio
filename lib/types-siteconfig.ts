export interface SiteConfig {
    id: string
    siteName: string
    siteDescription: string
    siteUrl: string
    logoUrl: string
    faviconUrl: string
    metaImage: string
    footerText: string
    copyrightText: string
    // socialLinks: {
    //     platform: string
    //     url: string
    //     icon: string
    // }[]
}

export interface CloudinaryUploadResponse {
    secure_url: string
    public_id: string
    format: string
    width: number
    height: number
    resource_type: string
    url: string
    signature: string
    original_filename: string
    asset_id: string
}
