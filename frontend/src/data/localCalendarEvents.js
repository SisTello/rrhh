let localCalendarEvents = [];

export const getLocalCalendarEvents = () => localCalendarEvents;

export const addLocalCalendarEvent = (event) => {
    localCalendarEvents = [
        event,
        ...localCalendarEvents.filter((item) => item.id !== event.id),
    ];
};

export const removeLocalCalendarEvent = (eventId) => {
    localCalendarEvents = localCalendarEvents.filter((event) => event.id !== eventId);
};
