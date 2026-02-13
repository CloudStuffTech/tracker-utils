let { Logger } = require('../index');

Logger.init({
    service: "test-service",
    enableConsoleLog: true
});

// EMAIL + PHONE TESTS
Logger.info("User email is test@gmail.com and phone is +919876543210");
Logger.info("User email is test@gmail.com and phone is (+91) 9876543210");
Logger.info("User phone is 98765 43210");

Logger.info("Contact test@gmail.com or admin@yahoo.com");
Logger.info("Email vikrant+prod@gmail.com");
Logger.info("Email user@mail.company.co.uk");
Logger.info('{"email":"abc@gmail.com"}');
Logger.info("ADMIN@COMPANY.COM");
Logger.info("Email test@gmail");

// PHONE VARIATIONS
Logger.info("Call 9876543210");
Logger.info("Call +919876543210");
Logger.info("Call +919876543210");
Logger.info("Call 98765-43210");
Logger.info("Phones 9876543210 and 9123456789");
Logger.info("US number +14155552671");
Logger.info("Call (+91) 9876543210");

// MIXED STRING TEST
Logger.info("User abc@gmail.com called 9876543210");

// JSON STRING TEST
Logger.info('{"email":"abc@gmail.com","phone":"9876543210"}');

// OBJECT LOG TESTS
Logger.info({
  message: "Payment from user@gmail.com",
  phone: "+919876543210"
});

Logger.info({
    email: "abc@gmail.com",
    phone: "9876543210",
    message: "Testing object log with some dummy value 876 and email is abc@gmail.com with phone number is 1234567890"
});

// NAME MASKING TESTS
Logger.info({
    name: "Vikrant",
    email: "user@gmail.com",
    phone: "9876543210"
});

Logger.info({
    name: "John Doe",
    message: "User profile updated"
});

// REGION ADDRESS TESTS
Logger.info({
    name: "Alice Wonderland",
    region: {
        address: "B 63, Sector 70, Zone 2",
        city: "Noida",
        state: "Uttar Pradesh",
        zipcode: "201301",
        country: "IN"
    }
});

Logger.info({
    region: {
        address: "221B Baker Street, Zone 5",
        city: "London",
        state: "Greater London",
        zipcode: "NW16XE"
    },
    message: "Shipping details updated"
});

Logger.info({
    region: {
        address: "Contact abc@gmail.com or call +919876543210",
        city: "Mumbai",
        state: "MH",
        zipcode: "400001"
    }
});

Logger.info({
    region: {
        city: "Delhi",
        state: "Delhi"
    }
});

// DB-LIKE OBJECT TEST
Logger.info({
    display_id: 752,
    name: "Test Advertiser",
    email: "advtest123@test.com",
    phone: "9876543210",
    region: {
        address: "B 63 Sector 70 Zone 2",
        city: "Noida",
        state: "UP",
        zipcode: "201301",
        country: "IN",
        currency: "INR"
    },
    status: "active"
});

Logger.info({
    display_id: 752,
    name: "test",
    email: "test@gmail.com",
    phone: "9876543210",
    status: "active"
});


// SAFE TEXT TEST
Logger.info("Service started successfully");
Logger.info("No sensitive data here");
