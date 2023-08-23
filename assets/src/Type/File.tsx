export type File = {
    path: string
    filename: string
    basename: string
    pathname: string
    extension: string
    realPath: string
    aTime: Date
    mTime: Date
    cTime: Date
    inode: number
    size: number
    perms: number
    owner: number
    group: number
    type: string
    writable: boolean
    readable: boolean
    executable: boolean
    file: boolean
    dir: boolean
    link: boolean
};
