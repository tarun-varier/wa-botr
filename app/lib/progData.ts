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

const numOperators = [LessThan, LessThanEquals, GreaterThan, GreaterThanEquals, Equals, NotEquals];
const stringOperators = [Is, IsNot, Contains, NotContains, ...numOperators];

export const MessageField: Field = {
    id: "message",
    label: "Message",
    operators: stringOperators,
};

export const messageTypes: Message[] = [
    { id: "text", label: "Text Message", fields: [MessageField] },
    {
        id: "media", label: "Media Message", fields: [{
            id: "file-type", label: "File Type", operators: [Is, IsNot], possibleValues: [
                {
                    "id": "audio/aac",
                    "label": "AAC"
                },
                {
                    "id": "audio/amr",
                    "label": "AMR"
                },
                {
                    "id": "audio/mpeg",
                    "label": "MP3"
                },
                {
                    "id": "audio/mp4",
                    "label": "MP4 Audio"
                },
                {
                    "id": "audio/ogg (OPUS codecs only; base audio/ogg not supported.)",
                    "label": "OGG Audio"
                },
                {
                    "id": "text/plain",
                    "label": "Text"
                },
                {
                    "id": "application/vnd.ms-excel",
                    "label": "Microsoft Excel"
                },
                {
                    "id": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "label": "Microsoft Excel"
                },
                {
                    "id": "application/msword",
                    "label": "Microsoft Word"
                },
                {
                    "id": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "label": "Microsoft Word"
                },
                {
                    "id": "application/vnd.ms-powerpoint",
                    "label": "Microsoft PowerPoint"
                },
                {
                    "id": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                    "label": "Microsoft PowerPoint"
                },
                {
                    "id": "application/pdf",
                    "label": "PDF"
                },
                {
                    "id": "image/jpeg",
                    "label": "JPEG"
                },
                {
                    "id": "image/png",
                    "label": "PNG"
                },
                {
                    id: "image/webp",
                    label: "Sticker"
                },
                {
                    id: "video/3gp",
                    label: "3GPP"
                },
                {
                    id: "video/mp4",
                    label: "MP4 Video"
                }
            ]
        }]
    },
    { id: "location", label: "Location Message", fields: [{ id: "latitude", label: "Latitude", operators: numOperators }, { id: "longitude", label: "Longitude", operators: numOperators }] },
    { id: "contact", label: "Contact Message", fields: [{ id: "name", label: "Name", operators: stringOperators }, { id: "number", label: "Number", operators: stringOperators }] },
    { id: "interactive", label: "Interactive Message", fields: [{ id: "type", label: "Type", operators: stringOperators }, { id: "value", label: "Value", operators: stringOperators }] },
    { id: "reply", label: "Reply To Message", fields: [MessageField] },
    { id: "reaction", label: "Reaction Message", fields: [MessageField] },
];
