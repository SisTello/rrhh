export const requestTypes = [
    {
        id: "horas",
        title: "Permiso por horas",
        description:
            "Solicita autorización para ausentarte durante algunas horas.",
        icon: "bi-clock",
    },
    {
        id: "dia",
        title: "Permiso por día",
        description:
            "Solicita permiso para ausentarte durante una jornada.",
        icon: "bi-calendar-day",
    },
    {
        id: "minutos",
        title: "Permiso por minutos",
        description:
            "Solicita una autorización por un periodo corto.",
        icon: "bi-stopwatch",
    },
    {
        id: "vacaciones",
        title: "Vacaciones",
        description:
            "Solicita tus días de vacaciones.",
        icon: "bi-sun",
    },
    {
        id: "licencias",
        title: "Licencias",
        description:
            "Realiza una solicitud de licencia.",
        icon: "bi-file-earmark-medical",
    },
    {
        id: "otros",
        title: "Otros",
        description:
            "Realiza otro tipo de solicitud.",
        icon: "bi-three-dots",
    },
];

export const requestFormConfig = {

    horas: {
        title: "Permiso por horas",
        fields: [
            {
                name: "date",
                label: "Fecha",
                type: "date",
                required: true,
                col: "col-md-6",
            },
            {
                name: "startTime",
                label: "Hora de salida",
                type: "time",
                required: true,
                col: "col-md-6",
            },
            {
                name: "endTime",
                label: "Hora de retorno",
                type: "time",
                required: true,
                col: "col-md-6",
            },
            {
                name: "reason",
                label: "Motivo",
                type: "textarea",
                required: true,
                col: "col-12",
            },
        ],
    },

    dia: {
        title: "Permiso por día",
        fields: [
            {
                name: "date",
                label: "Fecha del permiso",
                type: "date",
                required: true,
                col: "col-md-6",
            },
            {
                name: "reason",
                label: "Motivo",
                type: "textarea",
                required: true,
                col: "col-12",
            },
        ],
    },

    minutos: {
        title: "Permiso por minutos",
        fields: [
            {
                name: "date",
                label: "Fecha",
                type: "date",
                required: true,
                col: "col-md-6",
            },
            {
                name: "time",
                label: "Hora",
                type: "time",
                required: true,
                col: "col-md-6",
            },
            {
                name: "minutes",
                label: "Cantidad de minutos",
                type: "number",
                min: 1,
                required: true,
                col: "col-md-6",
            },
            {
                name: "reason",
                label: "Motivo",
                type: "textarea",
                required: true,
                col: "col-12",
            },
        ],
    },

    vacaciones: {
        title: "Solicitud de vacaciones",
        fields: [
            {
                name: "startDate",
                label: "Fecha de inicio",
                type: "date",
                required: true,
                col: "col-md-6",
            },
            {
                name: "endDate",
                label: "Fecha de finalización",
                type: "date",
                required: true,
                col: "col-md-6",
            },
            {
                name: "returnDate",
                label: "Fecha de reincorporación",
                type: "date",
                required: true,
                col: "col-md-6",
            },
            {
                name: "reason",
                label: "Observaciones",
                type: "textarea",
                required: false,
                col: "col-12",
            },
        ],
    },

    licencias: {
        title: "Solicitud de licencia",
        fields: [
            {
                name: "licenseType",
                label: "Tipo de licencia",
                type: "select",
                required: true,
                col: "col-md-6",
                options: [
                    "Médica",
                    "Personal",
                    "Maternidad / Paternidad",
                    "Otra",
                ],
            },
            {
                name: "startDate",
                label: "Fecha de inicio",
                type: "date",
                required: true,
                col: "col-md-6",
            },
            {
                name: "endDate",
                label: "Fecha de finalización",
                type: "date",
                required: true,
                col: "col-md-6",
            },
            {
                name: "reason",
                label: "Motivo",
                type: "textarea",
                required: true,
                col: "col-12",
            },
            {
                name: "attachment",
                label: "Documento de respaldo",
                type: "file",
                required: false,
                col: "col-12",
            },
        ],
    },

    otros: {
        title: "Otra solicitud",
        fields: [
            {
                name: "requestType",
                label: "Tipo de solicitud",
                type: "text",
                required: true,
                col: "col-md-6",
            },
            {
                name: "date",
                label: "Fecha",
                type: "date",
                required: true,
                col: "col-md-6",
            },
            {
                name: "reason",
                label: "Descripción / Motivo",
                type: "textarea",
                required: true,
                col: "col-12",
            },
        ],
    },
};

export const requestSummary = {
    pending: 2,
    approved: 8,
    rejected: 1,
    total: 11,
};

export const myRequests = [
    {
        id: 1024,
        type: "Permiso por horas",
        date: "28/09/2026",
        status: "Pendiente",
        statusClass: "pending",
    },
    {
        id: 1019,
        type: "Vacaciones",
        date: "25/09/2026",
        status: "Aprobada",
        statusClass: "approved",
    },
    {
        id: 1014,
        type: "Permiso por día",
        date: "20/09/2026",
        status: "Rechazada",
        statusClass: "rejected",
    },
];