import { WEBSITE_URL } from "../env.ts";

export function Metas({
  title,
  // image,
  // image_alt,
  description,
}: {
  title: string;
  // image: string;
  // image_alt: string;
  description: string;
}) {
  return (
    <>
      {/* <!-- Primary Meta Tags --> */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-with, initial-scale=1" />

      {/* <!-- Open Graph / Facebook --> */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={WEBSITE_URL} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* <meta property="og:image" content="https://i.postimg.cc/N07LcmsX/Site-preview.png" /> */}

      {/* <!-- Twitter --> */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={WEBSITE_URL} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {/* <meta property="twitter:image" content="https://i.postimg.cc/N07LcmsX/Site-preview.png" /> */}
    </>
  );
}
