import { Form, Field, ErrorMessage, defineRule, configure } from "vee-validate"
import { required, email, min, url } from '@vee-validate/rules'
import { localize } from "@vee-validate/i18n"
import db from '@/helpers/firebase-init.js'
import {collection, where, query, getDocs} from "firebase/firestore"

export default (app) => {
    app.component('VeeForm', Form)
    app.component('VeeField', Field)
    app.component('VeeErrorMessage', ErrorMessage)

    configure({
        generateMessage: localize('en', {
            messages: {
                required: '{field} is required',
                email: '{field} must be a valid email',
                min: '{field} must have at least 0:{min} characters',
                unique: '{field} in already taken',
                url: '{field} must be valid URL'
            }
        })
    })

    defineRule('required', required)
    defineRule('email', email)
    defineRule('min', min)
    defineRule('url', url)
    defineRule('unique', async (value, args) => {
        let resource, field, excluding
        if (Array.isArray(args)) {
            [resource, field, excluding] = args
        } else {
            ({ resource, field, excluding } = args)
        }

        if (value === excluding) return true

        const itemQuery = query(collection(db, resource), where(field, '==', value))
        const items  = await getDocs(itemQuery)
        return items.empty
    })
}