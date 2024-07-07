export const errorCause = (errorSite, errorName, cause) =>{

    let descripcion = `[ ${new Date().toUTCString()} ] - [ ${errorName} ]\nError en ${errorSite} --> ${cause}`

    return descripcion

    }