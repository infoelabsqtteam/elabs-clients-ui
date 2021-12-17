export interface SearchModel {
    appId : string;
    key : string;
    key2: string;
    key3: string;
    value: string;
    from: string;
    to: string;
    pageNo: Number;
    pageSize:Number;
    crList: SearchCriteria[];
    log: {userId: string, appId: string,refCode: string,source: string, sessionId: string,clientId: string }
}

export interface SearchCriteria {
    operator: string;
    fieldType: string;
	fName: string;
    fValue: string;
}