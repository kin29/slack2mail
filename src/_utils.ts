export class Utils {
    public toObjectFromSlackQuery(queryString: string): postQueryFromSlack{
        let queryObject: postQueryFromSlack = {};
        const params = queryString.split('&');
        for(let i = 0; i < params.length; i++) {
            const param = params[i].split('=');
            queryObject[param[0]] = param[1];
        }

        return queryObject;
    }
}

export interface postQueryFromSlack {
    token?: string;
    team_id?: string;
    team_domain?: string;
    channel_id?: string;
    channel_name?: string;
    user_id?: string;
    user_name?: string;
    command?: string;
    text?: string;
    api_app_id?: string;
    is_enterprise_install?: string;
    response_url?: string;
    trigger_id?: string;
}
