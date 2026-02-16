// Enable/Disable masking via env (default: enabled)
const ENABLE_MASKING = process.env.MASK_LOGS !== "false";

// Regex patterns for detecting emails and phone numbers
const REGEX_PATTERNS = [
    {
        regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        replacer: (match) => maskEmail(match)
    },
    {
        regex: /\+?\d[\d\s\-]{8,}\d/g,
        replacer: (match) => maskPhone(match)
    }
];

// Generic mask used for structured fields like address
const MASK = "********";

// Masks phone number and exposes last 4 digits
const maskPhone = (phone) => {
    const digits = phone.replace(/\D/g, "");

    if (digits.length <= 3) return "*".repeat(digits.length);

    const last4 = digits.slice(-4);
    return "*".repeat(Math.max(digits.length - 4, 0)) + last4;
};

// Masks email while partially exposing user and domain
const maskEmail = (email) => {
    const [user, domain] = email.split("@");
    if (!domain) return "***";

    const maskedUser =
        user.length <= 3
            ? "*".repeat(user.length)
            : (
                user[0] +
                "*".repeat(user.length - 3) +
                user.slice(-2)
            );

    const domainParts = domain.split(".");
    const mainDomain = domainParts[0] || "";

    const maskedDomain =
        mainDomain.length <= 3
            ? "***"
            : (
                "*".repeat(mainDomain.length - 2) +
                mainDomain.slice(-2)
            );

    const maskedTld = "***";

    return `${maskedUser}@${maskedDomain}.${maskedTld}`;
};

// Masks name by showing first and last two characters
const maskName = (name) => {
    if (!name || typeof name !== "string") return name;

    return name
        .split(" ")
        .map(part => {
            if (part.length <= 3) return "*".repeat(part.length);

            return (
                part[0] +
                "*".repeat(part.length - 2) +
                part.slice(-2)
            );
        })
        .join(" ");
};

// Applies regex-based masking on free-form strings
const applyRegexMasking = (str) => {
    let masked = str;

    REGEX_PATTERNS.forEach(({ regex, replacer }) => {
        masked = masked.replace(regex, replacer);
    });

    return masked;
};

// Recursively masks structured objects (name, region, nested fields)
const maskObject = (obj) => {
    if (!obj || typeof obj !== "object") return obj;

    const cloned = Array.isArray(obj) ? [...obj] : { ...obj };

    Object.keys(cloned).forEach(key => {
        const value = cloned[key];

        if (key === "name" && typeof value === "string") {
            cloned[key] = maskName(value);
            return;
        }

        if (key === "region" && typeof value === "object") {
            cloned[key] = {
                ...value,
                address: value.address ? MASK : value.address,
                city: value.city ? MASK : value.city,
                state: value.state ? MASK : value.state,
                zipcode: value.zipcode ? MASK : value.zipcode
            };
            return;
        }

        if (typeof value === "string") {
            cloned[key] = applyRegexMasking(value);
            return;
        }

        if (typeof value === "object") {
            cloned[key] = maskObject(value);
        }
    });

    return cloned;
};

// Entry point for masking (handles string or object)
const maskData = (data) => {

    // Skip masking if disabled
    if (!ENABLE_MASKING) return data;

    if (!data) return data;

    if (typeof data === "string") {
        return applyRegexMasking(data);
    }

    if (typeof data === "object") {
        return maskObject(data);
    }

    return data;
};

module.exports = { maskData };
