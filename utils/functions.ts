export const convertUrlToName = (queryName: string) => {
    return queryName.replace(/_/g, ' ')
        .replace(/ae/g, 'ä')
        .replace(/oe/g, 'ö')
        .replace(/ue/g, 'ü');
}