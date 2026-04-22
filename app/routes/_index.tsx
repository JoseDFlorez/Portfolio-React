import { redirect } from "react-router";

import type { Route } from "./+types/_index";
import { pickLocale } from "~/i18n/locale";

export async function loader({ request }: Route.LoaderArgs) {
  const locale = pickLocale(request.headers.get("Accept-Language"));
  throw redirect(`/${locale}`);
}

export default function RootIndexRedirect() {
  return null;
}
