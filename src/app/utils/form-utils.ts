export class FormUtils {
    public static getFormParams(params, formData: FormData) {
        if(params) {
            for (let key in params){
                formData.append(key, params[key]);
            }
        }
        return formData;
    }
}
