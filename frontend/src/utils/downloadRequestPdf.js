const isAvailable = (value) => {
    const text = String(value ?? "").trim();
    return text && !/^x+$/i.test(text) ? text : "";
};

const encodeWinAnsi = (value) => Array.from(String(value), (character) => {
    const code = character.codePointAt(0);
    return (code >= 32 && code <= 255 ? code : 63).toString(16).padStart(2, "0");
}).join("").toUpperCase();

const wrapText = (value, limit = 82) => {
    const words = String(value).replace(/\s+/g, " ").trim().split(" ");
    const lines = [];
    let line = "";
    words.forEach((word) => {
        if (word.length > limit) {
            if (line) lines.push(line);
            line = "";
            for (let index = 0; index < word.length; index += limit) {
                lines.push(word.slice(index, index + limit));
            }
            return;
        }
        if (line && `${line} ${word}`.length > limit) {
            lines.push(line);
            line = word;
        } else {
            line = line ? `${line} ${word}` : word;
        }
    });
    if (line) lines.push(line);
    return lines.length ? lines : [""];
};

const buildPdf = (lines) => {
    const pages = [];
    let currentPage = [];
    lines.forEach((line) => {
        wrapText(line.text).forEach((text) => {
            if (currentPage.length >= 39) {
                pages.push(currentPage);
                currentPage = [];
            }
            currentPage.push({ ...line, text });
        });
    });
    if (currentPage.length || !pages.length) pages.push(currentPage);

    const objects = [];
    const addObject = (value) => {
        objects.push(value);
        return objects.length;
    };
    const catalogId = addObject("");
    const pagesId = addObject("");
    const regularFontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
    const boldFontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
    const pageIds = pages.map((pageLines) => {
        const content = [
            "q 0.047 0.471 0.741 rg 42 790 511 3 re f Q",
            ...pageLines.map((line, index) => {
                const y = 765 - index * 18;
                const font = line.bold ? "F2" : "F1";
                const size = line.title ? 20 : 11;
                const color = line.title ? "0.047 0.471 0.741" : "0.13 0.16 0.19";
                return `BT /${font} ${size} Tf ${color} rg 44 ${y} Td <${encodeWinAnsi(line.text)}> Tj ET`;
            }),
        ].join("\n");
        const contentId = addObject(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
        return addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${regularFontId} 0 R /F2 ${boldFontId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    });
    objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
    objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((object, index) => {
        offsets.push(pdf.length);
        pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });
    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach((offset) => {
        pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return new Blob([pdf], { type: "application/pdf" });
};

export const downloadRequestPdf = (request, currentUser, fieldLabels = {}) => {
    if (!request?.id || !request.type) {
        throw new Error("No se encontró la información necesaria de la solicitud.");
    }

    const lines = [
        { text: "SOLICITUD DE PERMISO", title: true },
        { text: `Folio: ${request.id}`, bold: true },
        { text: `Tipo de permiso: ${request.type}` },
        { text: `Fecha de solicitud: ${request.submittedAt || request.date || "No disponible"}` },
        { text: `Estado: ${request.status || "No disponible"}` },
    ];
    const name = isAvailable(currentUser?.fullName);
    const identity = isAvailable(currentUser?.document);
    if (name) lines.push({ text: `Nombre del colaborador: ${name}` });
    if (identity) lines.push({ text: `Documento de identidad: ${identity}` });
    lines.push({ text: "", bold: false });

    Object.entries(request.details || {}).forEach(([key, value]) => {
        const displayValue = typeof value === "string"
            ? value.trim()
            : value instanceof File
                ? value.name
                : "";
        if (!displayValue) return;
        lines.push({ text: `${fieldLabels[key] || key}: ${displayValue}` });
    });

    const blob = buildPdf(lines);
    const safeId = String(request.id).replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `solicitud_${safeId}.pdf`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    return filename;
};
