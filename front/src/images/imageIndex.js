const imageRequireContext = require.context('./', false, /\.(png|jpe?g|svg)$/);
const imageFiles = imageRequireContext.keys();

const images = {};
imageFiles.forEach((file, index) => {
  const imageName = `card_${index + 1}`;
  images[imageName] = imageRequireContext(file);
});

export default images;
