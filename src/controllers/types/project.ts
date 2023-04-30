type TProjectDetails = {
    name: string
    description?: string
    ownerName: string
    area: number
    unit: string
    status: string
    parentId?: string
    // logoUrl:string
    address1: string
    address2?: string
    pincode: string
}
export type TCreateProject = {
    // details: TProjectDetails
    name: string
    description?: string
    parentId?: string
    ownerName: string
    area: number
    unit: string
    status: string
    address1: string
    address2?: string
    pincode: string
    planningImages: string[]
    siteImages?: string[]
}

export type TUpdateProject = {
    name: string
    description?: string
    ownerName: string
    area: number
    unit: string
    status: string
    address1: string
    address2?: string
    pincode: string
}
