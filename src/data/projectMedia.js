const autoAlexScreens = [
  { src: "./assets/autoalex-home.jpeg", preview: "./assets/autoalex-home", width: 1536, height: 874 },
  { src: "./assets/autoalex-calculator.png", preview: "./assets/autoalex-calculator", width: 1902, height: 1080 },
  { src: "./assets/autoalex-order.png", preview: "./assets/autoalex-order", width: 1901, height: 1080 },
];
const gameScreens = {
  uk: [
    { src: "./assets/nickolasgames-home-uk.png?v=2", preview: "./assets/nickolasgames-home-uk", width: 1904, height: 876 },
    { src: "./assets/nickolasgames-catalog-uk.png", preview: "./assets/nickolasgames-catalog-uk", width: 1900, height: 1080 },
  ],
  en: [
    { src: "./assets/nickolasgames-home-en.png?v=2", preview: "./assets/nickolasgames-home-en", width: 1902, height: 877 },
    { src: "./assets/nickolasgames-catalog-en.png", preview: "./assets/nickolasgames-catalog-en", width: 1900, height: 1080 },
  ],
  sv: [
    { src: "./assets/nickolasgames-home-sv.png?v=2", preview: "./assets/nickolasgames-home-sv", width: 1900, height: 878 },
    { src: "./assets/nickolasgames-catalog-sv.png", preview: "./assets/nickolasgames-catalog-sv", width: 1898, height: 1080 },
  ],
};

export function projectMedia(index, language) {
  return index === 1
    ? { screens: gameScreens[language] }
    : { screens: autoAlexScreens, mockup: { src: "./assets/autoalex-devices-figma.png", width: 836, height: 607 } };
}
