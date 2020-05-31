export class User {
    username: string;
    password: string;
    emailId: string;
    mobileNo: string;
    firstName: string;
    middleName: string;
    lastName: string;
    role: string;
    status: string;
}

export class UserRoles {
    username: string;
    roleCode: string;
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INVITED = 'INVITED',
    INACTIVE = 'INACTIVE',
    NEW = 'NEW'
}
