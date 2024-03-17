export interface TemplateData {
    title: string,
    description: string
}




export enum QuestionType {
    SHORT_ANSWER = 'ShortAnswer',
    LONG_ANSWER = "LongAnswer",
    NUMERIC = "Numeric",
    HEADING = "Heading",
    SUB_HEADING = "Subheading",
    CHECKBOX = "Checkbox",
    RADIOBUTTON = "RadioButton",
    YesNo ="YesNo",
  DATE_TIME = "DateTime",
  DATE_ONLY = "DateOnly",
  TIME_ONLY = "TimeOnly",
  DROP_DOWN = "DropDown",
  IMAGE_UPLOAD = "ImageUpload",
 
};

export interface QuestionsData {
    questionIndex: string,
    question: string,
    questionType: QuestionType,
    isRequired: boolean,
    options: any[]
    validations: any
    [key: string]: any
}

export const questionList = [{
    questionType: QuestionType.SHORT_ANSWER,
    title: "Short Answer",
    icon: "text"
}, {
    questionType: QuestionType.LONG_ANSWER,
    title: "Long Answer",
    icon: "text-long"
}, {
    questionType: QuestionType.NUMERIC,
    title: "Numeric",
    icon: "numeric"
}, {
    questionType: QuestionType.HEADING,
    title: "Heading",
    icon: "text-long"
},
{
    questionType: QuestionType.SUB_HEADING,
    title: "Sub Heading",
    icon: "text-long"
},
{
    questionType: QuestionType.CHECKBOX,
    title: "Checkbox",
    icon: "checkbox-outline"
},
{
    questionType: QuestionType.RADIOBUTTON,
    title: "Radio Button",
    icon: "radiobox-marked"
},
{
    questionType: QuestionType.YesNo,
    title: "YesNo",
    icon: "radiobox-marked"
},
{
    questionType: QuestionType.DATE_TIME,
    title: "Date Time",
    icon: "calendar-month"
},
{
    questionType: QuestionType.DATE_ONLY,
    title: "Date",
    icon: "calendar-month"
},
{
    questionType: QuestionType.TIME_ONLY,
    title: "Time",
    icon: "clock-time-ten-outline"
},
{
    questionType: QuestionType.DROP_DOWN,
    title: "Dropdown",
    icon: "arrow-down-drop-circle-outline"
}, {
    questionType: QuestionType.IMAGE_UPLOAD,
    title: "File Upload",
    icon: "file-image-outline"
}]

export const getQuestionName = (questionType: QuestionType) => {
    switch (questionType) {
        case QuestionType.SHORT_ANSWER:
            return "Short Answer"
        case QuestionType.LONG_ANSWER:
            return "Long Answer"
        case QuestionType.NUMERIC:
            return "Numeric"
        case QuestionType.HEADING:
            return "Heading"
        case QuestionType.SUB_HEADING:
            return "Sub Heading"
        case QuestionType.CHECKBOX:
            return "Checkbox"
        case QuestionType.RADIOBUTTON:
            return "RadioButton"
            case QuestionType.YesNo:
            return "YesNo"
        case QuestionType.DATE_TIME:
            return "DateTime"
        case QuestionType.DROP_DOWN:
            return "Dropdown"
        case QuestionType.DATE_ONLY:
            return "Date"
        case QuestionType.TIME_ONLY:
            return "Time"
        case QuestionType.IMAGE_UPLOAD:
            return "File Upload"
    }
}

export const ALLOWED_FILE_TYPES = [{
    fileType: "Image",
    fileTitle: "Image"
},{
    fileType: "Video",
    fileTitle: "Video"
}]

export const ALLOWED_FILE_TYPES2 = [{
    fileType: "Document",
    fileTitle: "Document"
},{
    fileType: "Audio",
    fileTitle: "Audio"
}]

export const ALLOWED_FILE_TYPES3 = [{
    fileType: "Remark",
    fileTitle: "Remark"
},{
    fileType: "Image",
    fileTitle: "Image"
},{
    fileType: "Video",
    fileTitle: "Video"
}
]
export const ALLOWED_FILE_TYPES4 = [{
    fileType: "Document",
    fileTitle: "Document"
},{
    fileType: "Audio",
    fileTitle: "Audio"
}]