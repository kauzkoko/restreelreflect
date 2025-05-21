export const convertUrlToName = (queryName: string) => {
    return queryName.replace(/_/g, ' ')
        .replace(/ae/g, 'ä')
        .replace(/oe/g, 'ö')
        .replace(/ue/g, 'ü');
}

export const map = (value, inMin, inMax, outMin, outMax) => {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}