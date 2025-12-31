import { google } from 'googleapis';

export const gmail = google.gmail('v1');

export const oauth2Client = new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET
);

// Helper to set credentials from a stored refresh token
export function setCredentials(accessToken: string, refreshToken?: string) {
    oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    });
}
