const aleaRNGFactory = require("number-generator/lib/aleaRNGFactory");

const numbergenertor = async () => {
  const generator1 = await aleaRNGFactory(Date.now());
  // my way
  const randomValue = generator1.uInt32();
  return (fiveDigitValue = randomValue % 100000); // Limits it to 5 digits. add 0 or less 0 to control digits

  // // Mentor way
  // return generator1.uInt32().toString().slice(0, 5);
};

module.exports = { numbergenertor };
