import Head from "next/head";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  structuredData?: any;
  noIndex?: boolean;
}

export default function SEOHead({
  title,
  description,
  keywords = "KFZ Werkstatt Berlin, Auto Reparatur, Ölwechsel, Bremsenwechsel, Autohandel, Gebrauchtwagen Berlin",
  ogImage = "https://same-zm8g20fhpa3-latest.netlify.app/og-image.jpg",
  ogType = "website",
  canonicalUrl,
  structuredData,
  noIndex = false,
}: SEOProps) {
  const fullTitle = title.includes("Auto Service 19")
    ? title
    : `${title} | Auto Service 19 - KFZ Werkstatt Berlin`;
  const baseUrl = "https://same-zm8g20fhpa3-latest.netlify.app";
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Auto Service 19" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:site_name" content="Auto Service 19" />
      <meta property="og:locale" content="de_DE" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional Meta Tags */}
      <meta name="language" content="German" />
      <meta name="geo.region" content="DE-BE" />
      <meta name="geo.placename" content="Berlin" />
      <meta name="geo.position" content="52.5200;13.4050" />
      <meta name="ICBM" content="52.5200, 13.4050" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </Head>
  );
}
