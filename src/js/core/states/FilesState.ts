import { reactive } from "vue";
import { SPRFile } from "../file-formats/SPRFile";

export const FilesState = reactive({
    spr: null as SPRFile | null
});