const REGEX_PATTERNS = [
    {
        regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        replacer: () => "****@****.com"
    },
    {
        regex: /\+?\d[\d\s\-]{8,}\d/g,
        replacer: () => "**********"
    }
];

const MASK = "********";

const applyRegexMasking = (str) => {
    let masked = str;

    REGEX_PATTERNS.forEach(({ regex, replacer }) => {
        masked = masked.replace(regex, replacer);
    });

    return masked;
};

const maskObject = (obj) => {
    if (!obj || typeof obj !== "object") return obj;

    const cloned = Array.isArray(obj) ? [...obj] : { ...obj };

    Object.keys(cloned).forEach(key => {
        const value = cloned[key];

        if (key === "name") {
            cloned[key] = MASK;
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

const maskData = (data) => {
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
