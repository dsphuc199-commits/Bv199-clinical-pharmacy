import { cache } from "react";
import { cookies } from "next/headers";
import { getAccountSession } from "./access";
import { authConfig, SESSION_COOKIE } from "./session";

export const currentAdmin = cache(async () => {
  const config = authConfig();
  const session = await getAccountSession((await cookies()).get(SESSION_COOKIE)?.value, config);
  return session?.admin ? session : null;
});
