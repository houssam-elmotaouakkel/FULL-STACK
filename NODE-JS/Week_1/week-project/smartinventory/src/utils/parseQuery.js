export function parseQuery(query) {
    const parsed = {};
    
    for (const [key, value] of Object.entries(query)) {
        if (value === 'true') parsed[key] = true;
        else if (value === 'false') parsed[key] = false;
        else if (!isNaN(value) && value !== '') parsed[key] = Number(value);
        else parsed[key] = value;
    }
    
    return parsed;
}

export function validatePagination(page, limit) {
    if (page && (!Number.isInteger(page) || page < 1)) {
        throw new Error('Page must be a positive integer');
    }
    if (limit && (!Number.isInteger(limit) || limit < 1)) {
        throw new Error('Limit must be a positive integer');
    }
}

export function validatePriceRange(minPrice, maxPrice) {
    if (minPrice && maxPrice && minPrice > maxPrice) {
        throw new Error('minPrice cannot be greater than maxPrice');
    }
}

export function validateDateRange(from, to) {
    if (from && to && new Date(from) > new Date(to)) {
        throw new Error('From date cannot be after to date');
    }
}