import type { Redirect } from 'next/dist/lib/load-custom-routes'

/**
 * Permanent (301) redirects from the old Wix addresses to the new site,
 * so search engines and existing links keep working.
 * Wix URLs contain accents; we list both encoded and decoded forms.
 */
const map: Array<[string, string]> = [
  ['/a-propos', '/a-propos'],
  ['/sessions', '/offres'],
  ['/event-list', '/evenements'],
  ['/voyage-en-inde', '/voyage-en-inde'],
  ['/pricing-plans/list', '/offres#carnets'],
  ['/service-page/suivi-personnalisé', '/offres/suivi-personnalise'],
  ['/service-page/formation-ayurveda-santé-10h', '/offres/formation-ayurveda-sante'],
  ['/service-page/consultation-gratuit-en-ligne-1', '/offres/consultation-decouverte'],
  ['/service-page/séance-individuelle-en-ligne', '/offres/seance-individuelle-en-ligne'],
  ['/service-page/formation-meditation-au-son-primordial', '/offres/meditation-son-primordial'],
  ['/service-page/séance-individuelle-en-presentiel', '/offres/seance-individuelle-presentiel'],
  ['/service-page/conférence-bien-être', '/offres/conference-bien-etre'],
  ['/event-details/ladakh-entre-ciel-et-silence-septembre-2026', '/voyage-en-inde/ladakh-entre-ciel-et-silence'],
  ['/post/comprendre-les-4-grands-cousins-ayurveda-yoga-tantra-vedanta', '/blog/comprendre-les-4-grands-cousins'],
  ['/post/tu-ne-peux-grandir-que-si-tu-laisses-tes-limitations-derrière-toi', '/blog/laisser-ses-limitations-derriere-soi'],
  ['/post/nous-cherchons-toujours-plus-alors-que-nous-avons-déjà-tout', '/blog/nous-avons-deja-tout'],
  ['/post/nous-devenons-ce-avec-quoi-nous-nourrissons-nos-sens', '/blog/nourrir-ses-sens'],
  ['/post/apprendre-a-écouter-son-coeur-et-son-corps', '/blog/ecouter-son-coeur-et-son-corps'],
  ['/post/fiu-de-tourner-en-rond', '/blog/fiu-de-tourner-en-rond'],
  ['/post/révision-et-vidange', '/blog/revision-et-vidange'],
  
]

const encode = (p: string) => p.split('/').map((s) => encodeURIComponent(s)).join('/')

export const legacyRedirects: Redirect[] = map
  .filter(([from, to]) => from !== to)
  .flatMap(([from, to]) => {
    const variants = Array.from(new Set([from, encode(from)]))
    return variants.map((source) => ({ source, destination: to, permanent: true }))
  })
