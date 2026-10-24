import en, { TranslationKey } from './en'
import de from './de'
import cs from './cs'
import da from './da'
import es from './es'
import fi from './fi'
import fr from './fr'
import it from './it'
import nb from './nb'
import nl from './nl'
import pl from './pl'
import pt from './pt'
import sk from './sk'
import sv from './sv'
import tr from './tr'
import uk from './uk'
import zh_Hans from './zh-Hans'

export { en, de, cs, da, es, fi, fr, it, nb, nl, pl, pt, sk, sv, tr, uk, zh_Hans }
export type { TranslationKey }

export const translations: Record<string, Record<string, string>> = {
  en,
  de,
  cs,
  da,
  es,
  fi,
  fr,
  it,
  nb,
  nl,
  pl,
  pt,
  sk,
  sv,
  tr,
  uk,
  'zh-Hans': zh_Hans,
}
