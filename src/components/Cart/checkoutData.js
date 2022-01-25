import validator from "validator";

const checkoutData = {
  isEmpty: (value) => {
    return value.trim() === "";
  },
  isValidMail: (mail) => {
    return validator.isEmail(mail);
  },
  isValidPhone: (phone) => {
    return phone.length === 10 && !isNaN(phone) && phone.startsWith("05");
  },
  isValidApartment: (aprtment) => {
    return !isNaN(aprtment) && aprtment.trim().length > 0;
  },

  areas: {
    center: [
      "בחר עיר",
      "בני ברק",
      "גבעתיים",
      "פתח תקווה",
      "רמת גן",
      "תל אביב - יפו",
    ],
    south: ["בחר עיר", "אשדוד", "אשקלון", "גדרה", "גן יבנה", "יבנה"],
    north: ["בחר עיר", "זכרון יעקב", "חיפה", "טירת כרמל", "עכו", "קיסריה"],
  },
};
export default checkoutData;
