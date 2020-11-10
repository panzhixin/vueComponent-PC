import {
    http
} from '../http'


export default {
    uploadImg(data) {
        return http({
            url: "/upload",
            method: "post",
            data
        })
    },
    visitAbout(data) {
        return http({
            url: "/about",
            method: "get",
            data
        })
    },
}