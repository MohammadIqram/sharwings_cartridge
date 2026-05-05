/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://sharwings.in', // Replace with your actual domain
  generateRobotsTxt: true, // This creates the robots.txt file automatically
  sitemapSize: 7000,
  exclude: ['/admin/*', '/account/*', '/cart','/admin-dashboard', '/admin-dashboard/*','/profile','/purchase-success','/purchase-failed'], // Pages you don't want on Google
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/account', '/cart'],
      },
    ],
  },
}
