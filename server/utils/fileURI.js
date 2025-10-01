
import DataURIParser from "datauri/parser.js";
import path from "path";

const parser = new DataURIParser();

function getFileUri(file) {
    const ext = path.extname(file.originalname).toString()
    return parser.format(ext, file.buffer).content;
}

export default getFileUri;