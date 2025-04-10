const Mailchecker = (email = "mahmudulislammern@gmail.com") => {
  const mailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return mailRegex.test(email);
};

const PasswordChecker = (password) => {
  const PassRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  return PassRegex.test(password);
};

const bdNumberChecker = (number) => {
  const bdMobileRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
  bdMobileRegex.test(number);
  console.log(bdMobileRegex);

  return bdNumberChecker;
};

const UsernameChecker = (username) => {
  const usernameRegex = /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]{3,20}(?<![_.])$/;
  return usernameRegex.test(username);

  //  * ✅ Valid usernames:
  //  * - 3 to 20 characters long
  //  * - Can contain letters (a–z, A–Z), numbers (0–9), dots (.), and underscores (_)
  //  * - Cannot start or end with a dot or underscore
  //  * - Cannot have two dots or two underscores in a row (e.g., "__" or "..")
  //  *
  //  * ❌ Invalid usernames:
  //  * - Starts or ends with a dot or underscore
  //  *   e.g., ".user", "_user", "user_", "user."
  //  * - Less than 3 or more than 20 characters
  //  *   e.g., "ab", "thisusernameiswaytoolong123"
  //  * - Contains consecutive special characters
  //  *   e.g., "user__name", "user..name", "user._name"
  //  * - Contains invalid characters
  //  *   e.g., "user@name", "hello world"
};

module.exports = {
  Mailchecker,
  PasswordChecker,
  bdNumberChecker,
  UsernameChecker,
};
