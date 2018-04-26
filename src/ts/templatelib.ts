const generateHtml = (htmlTemplate: string): HTMLElement[] => {
    let temp = document.createElement('div');
    temp.innerHTML = htmlTemplate.toString();
    return Array.from(temp.children) as HTMLElement[];
};

// TODO: conditional rendering
export const populateTemplate = async (htmlTemplate: string, props: Object): Promise<HTMLElement[]> => {

    // replace all of the format ${replaceMe}
    let regex = /\${(.*?)}/g;
    let match;
    let replace = {};

    while ((match = regex.exec(htmlTemplate)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        let replacement;

        // parse data if in object
        if (propsHasProperty(props, match[1])) {
            const propertyName = getPropertyName(match[1]);
            replacement = await processProperty(props, propertyName);
        }
        // parse default if not in object
        else if (getDefaultValue(match[1])) {
            replacement = getDefaultValue(match[1]);
        }
        // no data and no default
        else {
            replacement = 'no data';
        }

        replace[match[0]] = replacement;
    }

    Object.keys(replace).forEach((key: string) => {
        htmlTemplate = htmlTemplate.replace(key, replace[key])
    });

    return generateHtml(htmlTemplate);
};

const processProperty = async (props: Object, propertyName: string) => {
    // execute function
    if (typeof props[propertyName] === 'function') return await props[propertyName]();
    // join array
    else if (Array.isArray(props[propertyName])) return props[propertyName].join(', ');
    // return value
    else return props[propertyName];
};

const propsHasProperty = (props: Object, property: string) => {
    return props[getPropertyName(property)];
};

const getPropertyName = (match: string) => {
    return match.split('=').length > 1 ? match.split('=')[0] : match
};

const getDefaultValue = (match: string) => {
    return match.split('=').length > 1 ? match.split('=')[1] : null
};