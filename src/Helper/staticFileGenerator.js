const StaticFileGenerator = (allImage) => {
  const ImageWithDomain = allImage.map((image) => {
    return `${process.env.DOMAIN_NAME}/${image.filename}`;
  });
  return ImageWithDomain;
};

module.exports = { StaticFileGenerator };
