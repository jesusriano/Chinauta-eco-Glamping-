import regeneratedDome2Image from '../assets/images/regenerated_image_1790617455020.jpg';
import bochicaRomanticDecor from '../assets/images/bochica_romantic_decor_1790618007934.jpg';
import bochicaJacuzziDeck from '../assets/images/bochica_jacuzzi_deck_1790618019311.jpg';
import bochicaSunsetView from '../assets/images/bochica_sunset_view_1790617981274.jpg';
import huitacaDeckJacuzzi from '../assets/images/huitaca_deck_jacuzzi_1790621224807.jpg';
import huitacaCatamaranMesh from '../assets/images/huitaca_catamaran_mesh_1790621260604.jpg';
import huitacaEntranceSteps from '../assets/images/huitaca_entrance_steps_1790621247333.jpg';

export const DEFAULT_DOME_GALLERIES: Record<number, string[]> = {
  1: [
    huitacaDeckJacuzzi,
    huitacaCatamaranMesh,
    huitacaEntranceSteps,
    'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80'
  ],
  2: [
    bochicaRomanticDecor,
    bochicaJacuzziDeck,
    bochicaSunsetView
  ],
  3: [
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
  ],
  4: [
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80'
  ],
  5: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80'
  ],
  6: [
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80'
  ]
};

export function getDomeImages(dome: { id?: number; image_url?: string; images?: string[] }): string[] {
  const id = Number(dome.id);

  if (id === 2) {
    return [bochicaRomanticDecor, bochicaJacuzziDeck, bochicaSunsetView];
  }

  const defaults = DEFAULT_DOME_GALLERIES[id] || [];

  if (Array.isArray(dome.images) && dome.images.length > 0) {
    return dome.images;
  }

  if (dome.image_url && !defaults.includes(dome.image_url)) {
    return [dome.image_url, ...defaults];
  }

  return defaults.length > 0 ? defaults : [dome.image_url || 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80'];
}
