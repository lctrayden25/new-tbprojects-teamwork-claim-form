export const amountFormat = (amount: number): string => {
    return new Intl.NumberFormat('en-HK', {
        style: 'currency',
        currency: 'HKD'
    }).format(amount);
};

export const dateFormat = (date: string): string => {
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(`${date}T00:00:00`));
}
