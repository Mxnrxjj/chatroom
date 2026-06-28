export const getMessageDateLabel = (date) => {
    const messageDate = new Date(date);

    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (a, b) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    if (isSameDay(messageDate, today)) return "Today";

    if (isSameDay(messageDate, yesterday)) return "Yesterday";

    return messageDate.toLocaleDateString([], {
        day: "numeric",
        month: "long",
        year:
            messageDate.getFullYear() !== today.getFullYear()
                ? "numeric"
                : undefined,
    });
};