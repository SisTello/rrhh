import { useMemo, useState } from "react";
import "./calendar.scss";

import { calendarEvents } from "./calendarData";

const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];

const weekDays = [
    "LUN",
    "MAR",
    "MIÉ",
    "JUE",
    "VIE",
    "SÁB",
    "DOM",
];

const eventIcons = {
    empresa: "bi-building",
    departamento: "bi-diagram-3",
    sucursal: "bi-geo-alt",
    reunion: "bi-people",
    capacitacion: "bi-mortarboard",
    feriado: "bi-calendar-heart",
    actividad: "bi-stars",
    cumpleanos: "bi-balloon",
};

const eventLabels = {
    empresa: "Empresa",
    departamento: "Departamento",
    sucursal: "Sucursal",
    reunion: "Reunión",
    capacitacion: "Capacitación",
    feriado: "Feriado",
    actividad: "Actividad",
    cumpleanos: "Cumpleaños",
};

const getMonthDays = (year, month) => {
    const firstDay = new Date(year, month, 1);

    const lastDay = new Date(year, month + 1, 0);

    const previousMonthLastDay = new Date(
        year,
        month,
        0
    ).getDate();

    let startingDay = firstDay.getDay();

    // Convertir domingo = 0 a domingo = 6
    startingDay = startingDay === 0 ? 6 : startingDay - 1;

    const days = [];

    // Días del mes anterior
    for (let i = startingDay - 1; i >= 0; i--) {
        days.push({
            day: previousMonthLastDay - i,
            currentMonth: false,
        });
    }

    // Días del mes actual
    for (let day = 1; day <= lastDay.getDate(); day++) {
        days.push({
            day,
            currentMonth: true,
        });
    }

    // Días del siguiente mes
    let nextDay = 1;

    while (days.length < 42) {
        days.push({
            day: nextDay,
            currentMonth: false,
        });

        nextDay++;
    }

    return days;
};

const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
    ).padStart(2, "0")}`;
};

const Calendar = () => {
    const today = new Date();

    const [currentDate, setCurrentDate] = useState(
        new Date(today.getFullYear(), today.getMonth(), 1)
    );

    const [selectedEvent, setSelectedEvent] = useState(null);

    const [filters, setFilters] = useState({
        empresa: true,
        departamento: true,
        sucursal: true,
        reunion: true,
        capacitacion: true,
        feriado: true,
        actividad: true,
    });

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const days = useMemo(
        () => getMonthDays(year, month),
        [year, month]
    );

    const filteredEvents = calendarEvents.filter(
        (event) => filters[event.category] !== false
    );

    const getEventsForDay = (day) => {
        const dateKey = formatDateKey(year, month, day);

        return filteredEvents.filter(
            (event) => event.date === dateKey
        );
    };

    const changeMonth = (amount) => {
        setCurrentDate(
            new Date(year, month + amount, 1)
        );
    };

    const goToToday = () => {
        setCurrentDate(
            new Date(today.getFullYear(), today.getMonth(), 1)
        );
    };

    const toggleFilter = (category) => {
        setFilters((current) => ({
            ...current,
            [category]: !current[category],
        }));
    };

    return (
        <div className="calendar-page">

            {/* ENCABEZADO */}
            <div className="calendar-page__header">

                <div>
                    <h1>CALENDARIO</h1>

                    <p>
                        Consulta las actividades, eventos y fechas
                        importantes de la empresa.
                    </p>
                </div>

                <div className="calendar-page__controls">

                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={goToToday}
                    >
                        <i className="bi bi-calendar-check"></i>
                        Hoy
                    </button>

                    <div className="calendar-view-selector">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                        >
                            Mes
                            <i className="bi bi-chevron-down"></i>
                        </button>
                    </div>

                </div>

            </div>

            {/* FILTROS */}
            <section className="calendar-filters">

                <div className="calendar-filters__title">
                    <i className="bi bi-funnel"></i>
                    <span>Mostrar</span>
                </div>

                <div className="calendar-filters__items">

                    {Object.keys(eventLabels).map((category) => {

                        if (category === "cumpleanos") {
                            return null;
                        }

                        return (
                            <label
                                key={category}
                                className="calendar-filter"
                            >
                                <input
                                    type="checkbox"
                                    checked={
                                        filters[category]
                                    }
                                    onChange={() =>
                                        toggleFilter(category)
                                    }
                                />

                                <span>
                                    {eventLabels[category]}
                                </span>
                            </label>
                        );
                    })}

                </div>

            </section>

            {/* CALENDARIO */}
            <section className="calendar-card">

                {/* NAVEGACIÓN */}
                <div className="calendar-card__header">

                    <button
                        type="button"
                        className="calendar-navigation-btn"
                        onClick={() => changeMonth(-1)}
                        aria-label="Mes anterior"
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>

                    <h2>
                        {monthNames[month]} {year}
                    </h2>

                    <button
                        type="button"
                        className="calendar-navigation-btn"
                        onClick={() => changeMonth(1)}
                        aria-label="Mes siguiente"
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>

                </div>

                {/* DÍAS DE LA SEMANA */}
                <div className="calendar-weekdays">

                    {weekDays.map((day) => (
                        <div
                            key={day}
                            className="calendar-weekday"
                        >
                            {day}
                        </div>
                    ))}

                </div>

                {/* CELDAS */}
                <div className="calendar-grid">

                    {days.map((calendarDay, index) => {

                        const dateKey = calendarDay.currentMonth
                            ? formatDateKey(
                                  year,
                                  month,
                                  calendarDay.day
                              )
                            : null;

                        const events = calendarDay.currentMonth
                            ? getEventsForDay(calendarDay.day)
                            : [];

                        const isToday =
                            calendarDay.currentMonth &&
                            calendarDay.day === today.getDate() &&
                            month === today.getMonth() &&
                            year === today.getFullYear();

                        return (
                            <div
                                key={`${dateKey}-${index}`}
                                className={`calendar-day ${
                                    calendarDay.currentMonth
                                        ? ""
                                        : "calendar-day--outside"
                                } ${
                                    isToday
                                        ? "calendar-day--today"
                                        : ""
                                }`}
                            >

                                <div className="calendar-day__number">
                                    {calendarDay.day}
                                </div>

                                <div className="calendar-day__events">

                                    {events
                                        .slice(0, 2)
                                        .map((event) => (
                                            <button
                                                type="button"
                                                key={event.id}
                                                className={`calendar-event calendar-event--${event.category}`}
                                                onClick={() =>
                                                    setSelectedEvent(
                                                        event
                                                    )
                                                }
                                            >
                                                <i
                                                    className={`bi ${
                                                        eventIcons[
                                                            event.category
                                                        ]
                                                    }`}
                                                ></i>

                                                <span>
                                                    {event.title}
                                                </span>
                                            </button>
                                        ))}

                                    {events.length > 2 && (
                                        <button
                                            type="button"
                                            className="calendar-more"
                                            onClick={() =>
                                                setSelectedEvent(
                                                    events[2]
                                                )
                                            }
                                        >
                                            +{events.length - 2} más
                                        </button>
                                    )}

                                </div>

                            </div>
                        );
                    })}

                </div>

            </section>

            {/* MODAL */}
            {selectedEvent && (
                <div
                    className="calendar-modal-backdrop"
                    onClick={() => setSelectedEvent(null)}
                >
                    <div
                        className="calendar-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="calendar-modal__header">

                            <div>
                                <span className="calendar-modal__category">
                                    {eventLabels[
                                        selectedEvent.category
                                    ]}
                                </span>

                                <h2>
                                    {selectedEvent.title}
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="calendar-modal__close"
                                onClick={() =>
                                    setSelectedEvent(null)
                                }
                                aria-label="Cerrar"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>

                        </div>

                        <div className="calendar-modal__body">

                            <div className="calendar-detail">
                                <i className="bi bi-calendar3"></i>

                                <div>
                                    <strong>Fecha</strong>
                                    <span>
                                        {selectedEvent.date}
                                    </span>
                                </div>
                            </div>

                            {selectedEvent.time && (
                                <div className="calendar-detail">
                                    <i className="bi bi-clock"></i>

                                    <div>
                                        <strong>Horario</strong>

                                        <span>
                                            {
                                                selectedEvent.time
                                            }{" "}
                                            -{" "}
                                            {
                                                selectedEvent.endTime
                                            }
                                        </span>
                                    </div>
                                </div>
                            )}

                            {selectedEvent.location && (
                                <div className="calendar-detail">
                                    <i className="bi bi-geo-alt"></i>

                                    <div>
                                        <strong>Lugar</strong>

                                        <span>
                                            {
                                                selectedEvent.location
                                            }
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="calendar-detail">
                                <i className="bi bi-tag"></i>

                                <div>
                                    <strong>Categoría</strong>

                                    <span>
                                        {
                                            eventLabels[
                                                selectedEvent
                                                    .category
                                            ]
                                        }
                                    </span>
                                </div>
                            </div>

                            <div className="calendar-detail">
                                <i className="bi bi-people"></i>

                                <div>
                                    <strong>Dirigido a</strong>

                                    <span>
                                        {
                                            selectedEvent.audience
                                        }
                                    </span>
                                </div>
                            </div>

                            <div className="calendar-detail calendar-detail--description">
                                <i className="bi bi-info-circle"></i>

                                <div>
                                    <strong>
                                        Descripción
                                    </strong>

                                    <span>
                                        {
                                            selectedEvent.description
                                        }
                                    </span>
                                </div>
                            </div>

                        </div>

                        <div className="calendar-modal__footer">

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    setSelectedEvent(null)
                                }
                            >
                                Cerrar
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default Calendar;