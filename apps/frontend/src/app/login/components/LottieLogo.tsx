'use client';

import Player from 'react-lottie-player';

export default function LottieLogo() {
  return <Player loop play path="/lottie/logo.json" className="w-full h-full" />;
}
