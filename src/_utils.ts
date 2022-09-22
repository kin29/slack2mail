export class Utils {
    public toObjectFromQuery(queryString): object{
        let queryObject = {};
        const params = queryString.split('&');
        for(let i = 0; i < params.length; i++) {
            const param = params[i].split('=');
            queryObject[param[0]] = param[1];
        }

        return queryObject;
    }
}
