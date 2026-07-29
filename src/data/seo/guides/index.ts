import type { SeoPage } from '../types';
import { kakOzhivitStaroeFotoGuide } from './kakOzhivitStaroeFoto';
import { nejrosetiBezVpnGuide } from './nejrosetiBezVpn';
import { kakOplatitChatgptGuide } from './kakOplatitChatgpt';

export const guides: Record<string, SeoPage> = {
  'kak-ozhivit-staroe-foto': kakOzhivitStaroeFotoGuide,
  'nejroseti-bez-vpn': nejrosetiBezVpnGuide,
  'kak-oplatit-chatgpt-iz-rossii': kakOplatitChatgptGuide,
};