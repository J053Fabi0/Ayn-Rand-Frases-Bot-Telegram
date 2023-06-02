import Metas from "../components/Metas.tsx";
import { UnknownPageProps, Head } from "../deps.ts";
import Typography from "../components/Typography.tsx";

export default function NotFoundPage({ url }: UnknownPageProps) {
  // 404 for quotes
  if (url.pathname.startsWith("/quote"))
    return (
      <>
        <Head>
          <Metas description="" title="Quote not found" />
        </Head>
        <Typography variant="h4">Quote not found</Typography>{" "}
      </>
    );

  return (
    <>
      <Typography variant="h1">404 not found</Typography>
      <Typography variant="h4" class="mt-4">
        {url.pathname}
      </Typography>
    </>
  );
}
