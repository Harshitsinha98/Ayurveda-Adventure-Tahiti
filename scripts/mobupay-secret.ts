/**
 * Prints the Mobupay webhook signing secret for the key in MOBUPAY_SECRET_KEY.
 * Usage: npm run mobupay:secret
 */
import { getSigningSecret } from '../src/lib/mobupay'

const r = await getSigningSecret()
const secret = r.webhookSecret || r.secret || r.signingSecret
console.log(secret ? `MOBUPAY_WEBHOOK_SECRET=${secret}` : r)
