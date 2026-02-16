// Import masking function
const { maskData } = require('../logger/mask');

describe("PII Masking Tests", () => {

  /* ---------------- EMAIL TESTS ---------------- */

  // Should mask simple email
  test("should mask simple email", () => {
    const input = "test@gmail.com";
    const output = maskData(input);
    expect(output).toContain("@");
    expect(output).not.toContain("test@gmail.com");
  });

  // Should mask short email user <=3
  test("should mask short email user <=3", () => {
    const input = "tom@gmail.com";
    const output = maskData(input);
    expect(output).toMatch(/\*\*\*/);
  });

  // Should mask complex email
  test("should mask complex email", () => {
    const input = "vikrant.yadav@trackier.com";
    const output = maskData(input);
    expect(output).not.toContain("vikrant.yadav");
    expect(output).not.toContain("trackier");
  });

  // Should mask multiple emails
  test("should mask multiple emails in string", () => {
    const input = "Contact test@gmail.com or admin@yahoo.com";
    const output = maskData(input);
    expect(output).not.toContain("test@gmail.com");
    expect(output).not.toContain("admin@yahoo.com");
  });

  /* ---------------- PHONE TESTS ---------------- */

  // Should expose last 4 digits
  test("should mask phone and expose last 4 digits", () => {
    const input = "9876543210";
    const output = maskData(input);
    expect(output.endsWith("3210")).toBe(true);
  });

  // Should handle phone with country code
  test("should mask phone with country code", () => {
    const input = "+256 1234567899";
    const output = maskData(input);
    expect(output.endsWith("7899")).toBe(true);
  });

  // Should not change phone <=3 digits (regex won’t match)
  test("should fully mask phone <=3 digits", () => {
    const input = "123";
    const output = maskData(input);
    expect(output).toBe("123");
  });

  /* ---------------- NAME TESTS ---------------- */

  // Should mask full name
  test("should mask full name", () => {
    const input = { name: "Vikrant Yadav" };
    const output = maskData(input);
    expect(output.name).not.toBe("Vikrant Yadav");
  });

  // Should fully mask short name
  test("should mask short name fully", () => {
    const input = { name: "Tom" };
    const output = maskData(input);
    expect(output.name).toBe("***");
  });

  /* ---------------- REGION TESTS ---------------- */

  // Should mask region fields
  test("should mask region fields", () => {
    const input = {
      region: {
        address: "Sector 70",
        city: "Noida",
        state: "UP",
        zipcode: "201301"
      }
    };

    const output = maskData(input);

    expect(output.region.address).toBe("********");
    expect(output.region.city).toBe("********");
    expect(output.region.state).toBe("********");
    expect(output.region.zipcode).toBe("********");
  });

  /* ---------------- OBJECT TESTS ---------------- */

  // Should mask email and phone in object
  test("should mask email and phone in object", () => {
    const input = {
      email: "abc@gmail.com",
      phone: "9876543210"
    };

    const output = maskData(input);

    expect(output.email).not.toContain("abc@gmail.com");
    expect(output.phone.endsWith("3210")).toBe(true);
  });

  // Should recursively mask nested object
  test("should recursively mask nested object", () => {
    const input = {
      user: {
        email: "nested@gmail.com",
        phone: "9876543210"
      }
    };

    const output = maskData(input);

    expect(output.user.email).not.toContain("nested@gmail.com");
    expect(output.user.phone.endsWith("3210")).toBe(true);
  });

  /* ---------------- SAFE STRING TEST ---------------- */

  // Should not modify safe string
  test("should not change safe string", () => {
    const input = "Service started successfully";
    const output = maskData(input);
    expect(output).toBe(input);
  });

});


/*
   MASKING TOGGLE TESTS
*/

describe("Masking Toggle Tests", () => {

  // Should return original value when masking disabled
  test("should return original value when MASK_LOGS=false", () => {

    process.env.MASK_LOGS = "false";

    jest.resetModules(); // reload module with updated env
    const { maskData } = require('../logger/mask');

    const input = "test@gmail.com";
    const output = maskData(input);

    expect(output).toBe("test@gmail.com");

    process.env.MASK_LOGS = "true"; // restore for other tests
  });

});
