import 'server-only'

import { cookies } from 'next/headers'

import { DEFAULT_LANG, dictionaries, isLang, LANG_COOKIE, type Lang } from './dictionary'

export async function getLang(): Promise<Lang> {
  const v = (await cookies()).get(LANG_COOKIE)?.value
  return isLang(v) ? v : DEFAULT_LANG
}

export async function getT() {
  const lang = await getLang()
  return { lang, t: dictionaries[lang] }
}
