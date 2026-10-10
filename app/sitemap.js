const siteUrl = process.env.NEXTAUTH_URL || "https://tax-manager.lughaty.cloud";

export default function sitemap() {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/imprint`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
