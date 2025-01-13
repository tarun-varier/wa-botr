import { Field, Message, Operator, } from "./types";

export const Is: Operator = { id: "str-is", label: "Is" };
export const IsNot: Operator = { id: "str-is-not", label: "Is Not" };
export const Contains: Operator = { id: "str-contains", label: "Contains" };
export const NotContains: Operator = { id: "str-not-contains", label: "Does not contain" };
export const LessThan: Operator = { id: "int-less-than", label: "Less Than" };
export const LessThanEquals: Operator = { id: "int-less-than-equals", label: "Less Than Equals" };
export const GreaterThan: Operator = { id: "int-greater-than", label: "Greater Than" };
export const GreaterThanEquals: Operator = { id: "int-greater-than-equals", label: "Greater Than Equals" };
export const Equals: Operator = { id: "int-equals", label: "Equals" };
export const NotEquals: Operator = { id: "int-not-equals", label: "Not Equals" };

export const numOperators = [LessThan, LessThanEquals, GreaterThan, GreaterThanEquals, Equals, NotEquals];
export const strOperators = [Is, IsNot, Contains, NotContains];
export const fileTypeOperators = [Is, IsNot];

export const getOperators = (type: string) => {
    switch (type) {
        case "str":
            return strOperators;
        case "num":
            return numOperators;
        case "strnum":
            return [...strOperators, ...numOperators];
        case "filetype":
            return fileTypeOperators;
        default:
            return [];
    }
}

export const MessageField: Field = {
    id: "message",
    label: "Message",
    type: "strnum",
};

const fileTypes = [
    {
        "type": "audio",
        "id": "audio/aac",
        "label": "AAC"
    },
    {
        "type": "audio",
        "id": "audio/amr",
        "label": "AMR"
    },
    {
        "type": "audio",
        "id": "audio/mpeg",
        "label": "MP3"
    },
    {
        "type": "audio",
        "id": "audio/mp4",
        "label": "MP4 Audio"
    },
    {
        "type": "audio",
        "id": "audio/ogg",
        "label": "OGG Audio"
    },
    {
        "type": "document",
        "id": "text/plain",
        "label": "Text"
    },
    {
        "type": "document",
        "id": "application/vnd.ms-excel",
        "label": "Microsoft Excel"
    },
    {
        "type": "document",
        "id": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "label": "Microsoft Excel"
    },
    {
        "type": "document",
        "id": "application/msword",
        "label": "Microsoft Word"
    },
    {
        "type": "document",
        "id": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "label": "Microsoft Word"
    },
    {
        "type": "document",
        "id": "application/vnd.ms-powerpoint",
        "label": "Microsoft PowerPoint"
    },
    {
        "type": "document",
        "id": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "label": "Microsoft PowerPoint"
    },
    {
        "type": "document",
        "id": "application/pdf",
        "label": "PDF"
    },
    {
        "type": "image",
        "id": "image/jpeg",
        "label": "JPEG"
    },
    {
        "type": "image",
        "id": "image/png",
        "label": "PNG"
    },
    {
        "type": "video",
        id: "video/3gp",
        label: "3GPP"
    },
    {
        "type": "video",
        id: "video/mp4",
        label: "MP4 Video"
    }
]

const locationFields: Field[] =
    [{ id: "latitude", label: "Latitude", type: "num" }, { id: "longitude", label: "Longitude", type: "num" }]
const contactFields: Field[] = [{ id: "first_name", label: "First Name", type: "str" }, { id: "last_name", label: "Last Name", type: "str" }, { id: "phone", label: "Phone No.", type: "phnum" }, { id: "email", label: "Email", type: "email" }]

export const messageTypes: Message[] = [
    { id: "text", label: "Text Message", triggerFields: [MessageField], responseFields: [MessageField] },
    {
        id: "media", label: "Media Message", triggerFields: [{
            id: "file_type", label: "File Type", type: "filetype", possibleValues: fileTypes
        }], responseFields: [{ id: "file", label: "File", type: "file" }]
    },
    { id: "location", label: "Location Message", triggerFields: locationFields, responseFields: locationFields },
    { id: "contact", label: "Contact Message", triggerFields: contactFields, responseFields: contactFields },
    {
        id: "interactive", label: "Button Message",
        triggerFields: [{ id: "value", label: "Value", type: "str" }],
        responseFields: [{ id: "buttons", label: "Buttons", type: "buttons" }]
    },
    { id: "reply", label: "Reply To Message", triggerFields: [MessageField, { id: "id", label: "Message ID", type: "str" }], responseFields: [MessageField, { id: "id", label: "Message ID", type: "str" }] },
    { id: "reaction", label: "Reaction Message", triggerFields: [MessageField, { id: "id", label: "Message ID", type: "str" }], responseFields: [MessageField, { id: "id", label: "Message ID", type: "str" }] },
];
