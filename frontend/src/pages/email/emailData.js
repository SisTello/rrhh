import mockCurrentUser from "../../data/mockCurrentUser";
import mockEmployees from "../../data/mockEmployees";
import { initialBranches, initialDepartments } from "../administrator/administratorData";

export const emailContacts = mockEmployees;

export const emailDepartments = [
    ...new Set([
        ...initialDepartments.map((department) => department.name),
        ...emailContacts.map((employee) => employee.department),
    ]),
].sort((a, b) => a.localeCompare(b, "es"));

export const emailBranches = [
    ...new Set([
        ...initialBranches.map((branch) => branch.name),
        ...emailContacts.map((employee) => employee.branch),
    ]),
].sort((a, b) => a.localeCompare(b, "es"));

export const emailAreas = [
    {
        name: "Administración",
        departments: ["Talento Humano", "Finanzas", "Dirección"],
    },
    {
        name: "Operaciones",
        departments: ["Operaciones", "Servicio al Cliente"],
    },
    {
        name: "Tecnología",
        departments: ["Tecnología"],
    },
];

export const emailCurrentUser =
    emailContacts.find((employee) => employee.name === mockCurrentUser.fullName) ??
    emailContacts.find((employee) => employee.id === "employee-001") ??
    emailContacts[0];

const sampleAttachment = {
    id: "attachment-guide",
    name: "guia_de_accesos.txt",
    size: 1240,
    type: "text/plain",
    dataUrl: "data:text/plain;charset=utf-8,Gu%C3%ADa%20de%20accesos%20internos%20TELLO",
};

export const initialEmailMessages = [
    {
        id: "email-001",
        status: "sent",
        senderId: "employee-002",
        toIds: ["employee-001"],
        ccIds: [],
        subject: "Actualización de accesos internos",
        body: "Hola Valeria:\n\nTe comparto la guía actualizada para solicitar accesos a las herramientas internas. Si necesitas apoyo, responde a este mensaje.\n\nSaludos,\nDiego",
        sentAt: "2026-10-30T09:30:00-06:00",
        priority: "normal",
        attachments: [sampleAttachment],
        readBy: {},
        importantBy: ["employee-001"],
        deletedBy: [],
    },
    {
        id: "email-002",
        status: "sent",
        senderId: "employee-003",
        toIds: ["employee-001"],
        ccIds: ["employee-002"],
        subject: "Reunión de planeación trimestral",
        body: "Buen día, equipo:\n\nLa reunión de planeación será el próximo lunes a las 10:00. Por favor, revisen los objetivos del área antes de la sesión.\n\nGracias,\nGabriela",
        sentAt: "2026-10-29T15:15:00-06:00",
        priority: "high",
        attachments: [],
        readBy: {},
        importantBy: [],
        deletedBy: [],
    },
    {
        id: "email-003",
        status: "sent",
        senderId: "employee-001",
        toIds: ["employee-002"],
        ccIds: [],
        subject: "Re: Actualización de accesos internos",
        body: "Hola Diego:\n\nMuchas gracias por compartir la guía. La revisaremos con el equipo y te contactamos si surge alguna duda.\n\nSaludos,\nValeria",
        sentAt: "2026-10-29T11:45:00-06:00",
        priority: "normal",
        attachments: [],
        readBy: { "employee-002": true },
        importantBy: [],
        deletedBy: [],
    },
    {
        id: "email-004",
        status: "sent",
        senderId: "employee-001",
        toIds: ["employee-003", "employee-004"],
        ccIds: [],
        subject: "Agenda de bienestar del equipo",
        body: "Comparto la propuesta de actividades de bienestar para el siguiente mes. Quedo atenta a sus comentarios.",
        sentAt: "2026-10-28T08:20:00-06:00",
        priority: "normal",
        attachments: [sampleAttachment],
        readBy: { "employee-003": true, "employee-004": false },
        importantBy: [],
        deletedBy: [],
    },
    {
        id: "draft-001",
        status: "draft",
        senderId: "employee-001",
        toIds: ["employee-003"],
        ccIds: [],
        subject: "Seguimiento de capacitación",
        body: "Hola Gabriela:\n\nTe escribo para dar seguimiento a",
        sentAt: null,
        priority: "normal",
        attachments: [],
        readBy: {},
        importantBy: [],
        deletedBy: [],
    },
];
