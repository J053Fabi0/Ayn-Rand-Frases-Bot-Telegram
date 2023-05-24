export function Metas({
  name,
  image,
  image_alt,
  description,
}: {
  name: string;
  image: string;
  image_alt: string;
  description: string;
}) {
  return (
    <>
      <title>{name}</title>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={description} />
      <meta property="og:title" content={description} />
      <meta property="og:description" content={description} />
      <meta name="twitter:description" content={description} />
      <meta name="description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={image_alt} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={image_alt} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={name} />
      <meta property="og:locale" content="en_US" />
    </>
  );
}
