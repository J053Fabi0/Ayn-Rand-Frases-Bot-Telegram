import { ErrorPageProps } from "../deps.ts";
import Typography from "../components/Typography.tsx";

export default function Error500Page({ error }: ErrorPageProps) {
  return (
    <>
      <Typography variant="h1">500 internal error</Typography>
      <Typography variant="h4" class="mt-4">
        {(error as Error).message}
      </Typography>
    </>
  );
}
