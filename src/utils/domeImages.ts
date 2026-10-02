import regeneratedDome2Image from '../assets/images/regenerated_image_1790617455020.jpg';
import bochicaRomanticDecor from '../assets/images/bochica_romantic_decor_1790618007934.jpg';
import bochicaJacuzziDeck from '../assets/images/bochica_jacuzzi_deck_1790618019311.jpg';
import bochicaSunsetView from '../assets/images/bochica_sunset_view_1790617981274.jpg';
import huitacaDeckJacuzzi from '../assets/images/huitaca_deck_jacuzzi_1790621224807.jpg';
import huitacaCatamaranMesh from '../assets/images/huitaca_catamaran_mesh_1790621260604.jpg';
import huitacaEntranceSteps from '../assets/images/huitaca_entrance_steps_1790621247333.jpg';
import chinautaDeckAsoleadoras from '../assets/images/chinauta_deck_asoleadoras_1790624838157.jpg';
import chinautaRomanticDomeNight from '../assets/images/chinauta_romantic_dome_night_1790624852355.jpg';

export const DEFAULT_DOME_GALLERIES: Record<number, string[]> = {
  1: [
    chinautaDeckAsoleadoras,
    huitacaDeckJacuzzi,
    huitacaCatamaranMesh,
    huitacaEntranceSteps
  ],
  2: [
    chinautaRomanticDomeNight,
    bochicaRomanticDecor,
    bochicaJacuzziDeck,
    bochicaSunsetView
  ],
  3: [
    chinautaRomanticDomeNight,
    chinautaDeckAsoleadoras,
    huitacaDeckJacuzzi,
    bochicaJacuzziDeck
  ],
  4: [
    chinautaDeckAsoleadoras,
    chinautaRomanticDomeNight,
    huitacaEntranceSteps,
    bochicaSunsetView
  ],
  5: [
    chinautaRomanticDomeNight,
    huitacaCatamaranMesh,
    bochicaRomanticDecor,
    chinautaDeckAsoleadoras
  ],
  6: [
    bochicaJacuzziDeck,
    chinautaRomanticDomeNight,
    chinautaDeckAsoleadoras,
    huitacaDeckJacuzzi
  ]
};

export function getDomeImages(dome: { id?: number; image_url?: string; images?: string[] }): string[] {
  const id = Number(dome.id);
  const defaults = DEFAULT_DOME_GALLERIES[id] || [
    chinautaRomanticDomeNight,
    chinautaDeckAsoleadoras
  ];

  if (Array.isArray(dome.images) && dome.images.length > 0) {
    // Filter out generic unsplash fallback if local images exist
    const nonUnsplash = dome.images.filter(img => !img.includes('unsplash.com'));
    if (nonUnsplash.length > 0) {
      return nonUnsplash;
    }
    return dome.images;
  }

  if (dome.image_url && !dome.image_url.includes('unsplash.com') && !defaults.includes(dome.image_url)) {
    return [dome.image_url, ...defaults];
  }

  return defaults;
}
