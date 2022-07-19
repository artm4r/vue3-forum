import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPencil, faEarthEurope, faCamera } from '@fortawesome/free-solid-svg-icons'


library.add(faPencil, faEarthEurope, faCamera)

export default (app) => {
    app.component('fa', FontAwesomeIcon)
}