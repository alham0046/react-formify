const MonthName: Record<string, string> = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
}
const MonthNumber: Record<string, string> = {
    'January': '01',
    'February': '02',
    'March': '03',
    'April': '04',
    'May': '05',
    'June': '06',
    'July': '07',
    'August': '08',
    'September': '09',
    'October': '10',
    'November': '11',
    'December': '12',
}
const formatDateWithSuffix = (dateString : string) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const getDaySuffix = (d : any) => {
        if (d > 3 && d < 21) return 'th'; // for 11th–13th
        switch (d % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    return `${day}${getDaySuffix(day)} ${month} ${year}`;
}

type ParsedDate = {
    day: string;
    month: string;
    monthName: string
    year: string;
    getFormat: (format: string) => string;
};

const getDate = (date: string): ParsedDate | null => {
    // Match patterns like 21-04-2024, 2024/04/21, etc.
    const pattern = /(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})|(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})|(\d{1,2})(st|nd|rd|th)?\s+([A-Za-z]+)\s+(\d{4})/
    const match = date.match(pattern)

    if (!match) return null

    const normalize = (val: string) => val.padStart(2, '0');

    let day = '';
    let month = '';
    let year = '';
    let suffix = '';

    if (match[1]) {
        // yyyy-mm-dd format
        year = match[1]
        month = normalize(match[2])
        day = normalize(match[3])
    } else if (match[4]) {
        // dd-mm-yyyy format
        day = normalize(match[4])
        month = normalize(match[5])
        year = match[6]
    } else {
        // 23rd April 2025 format
        day = match[7]
        suffix = match[8]
        month = MonthNumber[match[9]]
        year = match[10]
    }

    const monthName = MonthName[month] ?? 'Unknown'

    return {
        day,
        month,
        year,
        monthName,
        getFormat: (format: string = 'yyyy-mm-dd') =>
            format.replace(/dd|mm|yyyy|MonthName/g, (token) => {
                switch (token) {
                    case 'dd':
                        return day;
                    case 'mm':
                        return month;
                    case 'yyyy':
                        return year;
                    case 'MonthName':
                        return monthName;
                    default:
                        return token;
                }
            }),
    }
}

export {formatDateWithSuffix, getDate}
